/**
 * Base adapter interface for all AI platform content adapters.
 * Defines the common contract that every site-specific adapter must implement.
 *
 * Per AGENT.md: "Define the common interface: matches(url), findPromptInput(),
 * getConversationTitle(), getModelProfile(), installListeners()."
 *
 * @module adapters/base
 */

import { PromptCapturedPayload } from "@optiprompt/domain";
import { SiteSelectors, queryWithFallbacks } from "../dom/selectors";
import { PromptInputHandle, createPromptInputHandle } from "../dom/prompt-input";

/**
 * Callback signatures used by adapters to notify the capture engine of DOM events.
 */
export interface AdapterListenerCallbacks {
  /** Fired when the user modifies text in the prompt input. */
  onInputChange: (text: string) => void;
  /** Fired when the user submits a prompt (Enter, button click, etc.). */
  onSubmit: (text: string) => void;
}

/**
 * Abstract base class for all AI platform adapters.
 * Each adapter is responsible for:
 * 1. Detecting whether the current URL matches its platform
 * 2. Locating the prompt input element in the DOM
 * 3. Installing event listeners for input changes and submissions
 * 4. Extracting conversation metadata (title, model)
 * 5. Normalizing captured output so the rest of the system is source-site agnostic
 */
export abstract class BaseAdapter {
  abstract readonly name: string;
  abstract readonly selectors: SiteSelectors;

  /**
   * Returns true if this adapter handles the given URL.
   */
  abstract matches(url: string): boolean;

  /**
   * Finds the prompt input element using the adapter's selector list.
   * Returns a normalized PromptInputHandle or null if not found.
   */
  findPromptInput(): PromptInputHandle | null {
    const el = queryWithFallbacks(this.selectors.promptInput);
    return createPromptInputHandle(el);
  }

  /**
   * Returns the raw HTMLElement for the prompt input (for legacy compatibility).
   */
  findPromptInputElement(): HTMLElement | null {
    return queryWithFallbacks(this.selectors.promptInput);
  }

  /**
   * Finds the submit/send button element.
   */
  findSubmitButton(): HTMLElement | null {
    return queryWithFallbacks(this.selectors.submitButton);
  }

  /**
   * Extracts the current conversation title from the page.
   * Returns null if not detectable.
   */
  getConversationTitle(): string | null {
    const el = queryWithFallbacks(this.selectors.conversationTitle);
    return el?.textContent?.trim() || null;
  }

  /**
   * Extracts the currently selected model identifier from the page.
   * Returns null if not detectable; subclasses should provide fallback defaults.
   */
  getModelProfile(): string | null {
    const el = queryWithFallbacks(this.selectors.modelIndicator);
    return el?.textContent?.trim() || null;
  }

  /**
   * Installs DOM event listeners for input changes and prompt submissions.
   * This is the primary method that wires the adapter to the capture engine.
   *
   * Subclasses may override this to handle platform-specific submission patterns
   * (e.g., button clicks, keyboard shortcuts, contenteditable nuances).
   *
   * @param callbacks - Callback functions for input change and submit events
   * @returns A cleanup function to remove all installed listeners
   */
  installListeners(callbacks: AdapterListenerCallbacks): () => void {
    const cleanupFns: (() => void)[] = [];
    const inputHandle = this.findPromptInput();
    const inputEl = inputHandle?.getElement();

    if (!inputEl) {
      console.warn(`[OptiPrompt:${this.name}] Could not find prompt input for listener install`);
      return () => {};
    }

    // --- Input change listener ---
    const onInput = () => {
      if (!inputHandle) return;
      const text = inputHandle.getText();
      callbacks.onInputChange(text);
    };
    inputEl.addEventListener("input", onInput);
    cleanupFns.push(() => inputEl.removeEventListener("input", onInput));

    // --- Keyboard submit listener (Enter without Shift) ---
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        if (!inputHandle) return;
        const text = inputHandle.getText();
        if (!text.trim()) return;

        // Delay to let the host app clear the input (confirms submission)
        setTimeout(() => {
          if (inputHandle.isEmpty()) {
            callbacks.onSubmit(text);
          }
        }, 150);
      }
    };
    inputEl.addEventListener("keydown", onKeydown, { capture: true });
    cleanupFns.push(() =>
      inputEl.removeEventListener("keydown", onKeydown, { capture: true })
    );

    // --- Submit button click listener ---
    const submitBtn = this.findSubmitButton();
    if (submitBtn) {
      const onBtnClick = () => {
        if (!inputHandle) return;
        const text = inputHandle.getText();
        if (!text.trim()) return;

        setTimeout(() => {
          if (inputHandle.isEmpty()) {
            callbacks.onSubmit(text);
          }
        }, 150);
      };
      submitBtn.addEventListener("click", onBtnClick, { capture: true });
      cleanupFns.push(() =>
        submitBtn.removeEventListener("click", onBtnClick, { capture: true })
      );
    }

    return () => {
      for (const fn of cleanupFns) fn();
    };
  }

  /**
   * Creates a normalized PromptCapturedPayload from raw text input.
   * Ensures the rest of the system is source-site agnostic.
   */
  capturePrompt(rawText: string): PromptCapturedPayload {
    return {
      sessionId: "", // Resolved by session manager in the background
      promptText: rawText,
      sourceSite: this.name,
      tabUrl: window.location.href,
      conversationTitle: this.getConversationTitle(),
      capturedAt: new Date().toISOString(),
    };
  }
}
