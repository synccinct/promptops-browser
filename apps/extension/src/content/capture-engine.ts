/**
 * CaptureEngine — orchestrates prompt detection, change tracking, submission
 * detection, and UI injection for a single adapter lifecycle.
 *
 * The capture engine is the bridge between the content adapter layer and the
 * background service worker. It uses the adapter's `installListeners()` to
 * receive normalized input/submit events, then dispatches typed messages to
 * the background via `chrome.runtime.sendMessage`.
 *
 * It also manages the inline badge and inline actions UI components injected
 * into the host page DOM.
 *
 * @module capture-engine
 */

import { BaseAdapter } from "./adapters/base";
import { ExtensionEvent } from "@optiprompt/domain";
import { createPromptInputHandle } from "./dom/prompt-input";
import { showInlineBadge, updateBadgeState, removeBadge, BadgeState } from "./ui/inline-badge";
import { showInlineActions, removeInlineActions, InlineAction } from "./ui/inline-actions";

export class CaptureEngine {
  private currentDraftId: string = "";
  private lastCapturedText: string = "";
  private listenerCleanup: (() => void) | null = null;
  private destroyed = false;

  constructor(private adapter: BaseAdapter) {}

  /**
   * Starts the capture engine:
   * 1. Sends an initial PROMPT_CAPTURED event to open a session
   * 2. Installs adapter listeners for input changes and submissions
   * 3. Injects the inline badge near the prompt input
   * 4. Listens for messages from the background (APPLY_PATCH, SUGGESTIONS_READY)
   */
  start(): void {
    const inputHandle = this.adapter.findPromptInput();
    const inputEl = inputHandle?.getElement();

    if (!inputEl) {
      console.warn(
        `[OptiPrompt:CaptureEngine] Could not find prompt input for adapter: ${this.adapter.name}`
      );
      return;
    }

    // Initial capture to start the session
    const initialText = inputHandle?.getText() || "";
    this.sendToBackground({
      type: "PROMPT_CAPTURED",
      payload: {
        ...this.adapter.capturePrompt(initialText),
      },
    });

    // Inject inline badge
    showInlineBadge(inputEl, "idle", () => {
      // Clicking the badge opens the side panel
      chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" }).catch(() => {});
    });

    // Install adapter listeners
    this.listenerCleanup = this.adapter.installListeners({
      onInputChange: (text: string) => this.handleInputChange(text),
      onSubmit: (text: string) => this.handleSubmit(text),
    });

    // Listen for messages from background → content
    chrome.runtime.onMessage.addListener(this.onBackgroundMessage);
  }

  /**
   * Stops the capture engine and cleans up all listeners and injected UI.
   */
  destroy(): void {
    this.destroyed = true;
    this.listenerCleanup?.();
    this.listenerCleanup = null;
    chrome.runtime.onMessage.removeListener(this.onBackgroundMessage);
    removeBadge();
    removeInlineActions();
  }

  /**
   * Handles text input changes from the adapter.
   */
  private async handleInputChange(text: string): Promise<void> {
    if (this.destroyed) return;
    if (text === this.lastCapturedText) return;

    this.lastCapturedText = text;

    // Remove inline actions when user starts typing again
    removeInlineActions();

    const response = await this.sendToBackground({
      type: "PROMPT_CHANGED",
      payload: {
        ...this.adapter.capturePrompt(text),
        draftId: this.currentDraftId,
        previousPromptText: "",
      },
    });

    if (response?.draftId) {
      this.currentDraftId = response.draftId;
    }
  }

  /**
   * Handles prompt submission from the adapter.
   */
  private async handleSubmit(text: string): Promise<void> {
    if (this.destroyed) return;

    removeInlineActions();
    updateBadgeState("idle");

    await this.sendToBackground({
      type: "PROMPT_SUBMITTED",
      payload: {
        ...this.adapter.capturePrompt(text),
        draftId: this.currentDraftId,
        submittedAt: new Date().toISOString(),
      },
    });

    this.currentDraftId = "";
    this.lastCapturedText = "";
  }

  /**
   * Handles messages from the background service worker.
   */
  private onBackgroundMessage = (
    message: { type: string; payload?: any },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): boolean | void => {
    if (this.destroyed) return;

    switch (message.type) {
      case "APPLY_PATCH": {
        const patch = message.payload?.patch;
        const inputHandle = this.adapter.findPromptInput();

        if (inputHandle && patch?.replaceText !== undefined) {
          inputHandle.setText(patch.replaceText);
          this.lastCapturedText = patch.replaceText;
          sendResponse({ success: true });
        } else {
          sendResponse({ success: false, error: "No input found or invalid patch" });
        }
        return true; // Async response
      }

      case "ANALYSIS_STARTED": {
        updateBadgeState("analyzing");
        break;
      }

      case "SUGGESTIONS_READY": {
        updateBadgeState("ready");
        this.showSuggestionActions(message.payload);
        break;
      }

      case "ANALYSIS_ERROR": {
        updateBadgeState("error");
        // Reset to idle after a brief delay
        setTimeout(() => updateBadgeState("idle"), 3000);
        break;
      }
    }
  };

  /**
   * Shows inline action buttons when suggestions are ready.
   */
  private showSuggestionActions(payload?: {
    envelope?: { cards?: Array<{ replaceText?: string }> };
  }): void {
    const inputEl = this.adapter.findPromptInputElement();
    if (!inputEl) return;

    const firstPatch = payload?.envelope?.cards?.[0]?.replaceText;

    const actions: InlineAction[] = [
      {
        id: "view-all",
        label: "✨ View Suggestions",
        variant: "view",
        onClick: () => {
          chrome.runtime.sendMessage({ type: "OPEN_SIDEPANEL" }).catch(() => {});
        },
      },
    ];

    // Only show "Apply Top" if there's a concrete replacement available
    if (firstPatch) {
      actions.unshift({
        id: "apply-top",
        label: "Apply Top",
        variant: "apply",
        onClick: () => {
          const inputHandle = this.adapter.findPromptInput();
          if (inputHandle) {
            inputHandle.setText(firstPatch);
            this.lastCapturedText = firstPatch;
          }
          removeInlineActions();
          updateBadgeState("idle");
        },
      });
    }

    actions.push({
      id: "dismiss",
      label: "✕",
      variant: "dismiss",
      onClick: () => {
        removeInlineActions();
        updateBadgeState("idle");
      },
    });

    showInlineActions(inputEl, actions);
  }

  /**
   * Sends a typed ExtensionEvent to the background service worker.
   */
  private sendToBackground(event: ExtensionEvent): Promise<any> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(event, resolve);
    });
  }
}
