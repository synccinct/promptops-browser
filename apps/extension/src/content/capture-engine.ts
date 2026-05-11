import { BaseAdapter } from "./adapters/base";
import { ExtensionEvent } from "@optiprompt/domain";

export class CaptureEngine {
  private lastCapturedText: string = "";
  private currentDraftId: string = "";

  constructor(private adapter: BaseAdapter) {}

  start() {
    const input = this.adapter.findPromptInput();
    if (!input) {
      console.warn(`[OptiPrompt] Could not find input for adapter: ${this.adapter.name}`);
      return;
    }

    // Initial capture to start the session
    const text = this.extractText(input);
    this.sendToBackground({
      type: "PROMPT_CAPTURED",
      payload: {
        ...this.adapter.capturePrompt(text),
      }
    });

    // Monitor for changes
    input.addEventListener("input", async (e) => {
      const text = this.extractText(e.target as HTMLElement);
      if (text === this.lastCapturedText) return;
      
      this.lastCapturedText = text;

      const response = await this.sendToBackground({
        type: "PROMPT_CHANGED",
        payload: {
          ...this.adapter.capturePrompt(text),
          draftId: this.currentDraftId,
          previousPromptText: "", // Not tracked here yet
        }
      });

      if (response && response.draftId) {
        this.currentDraftId = response.draftId;
      }
    });

    // Monitor for submissions
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        if (e.isComposing) return;
        const textBefore = this.extractText(e.target as HTMLElement);
        if (!textBefore.trim()) return;

        // Delay submission check to see if the host app consumed the event (cleared the input)
        setTimeout(() => {
          const textAfter = this.extractText(e.target as HTMLElement);
          if (textAfter.trim() === "") {
            this.sendToBackground({
              type: "PROMPT_SUBMITTED",
              payload: {
                ...this.adapter.capturePrompt(textBefore),
                draftId: this.currentDraftId,
                submittedAt: new Date().toISOString(),
              }
            });
          }
        }, 100);
      }
    }, { capture: true });

    // Listen for patch applications from the sidepanel
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "APPLY_PATCH") {
        const patch = message.payload?.patch;
        const targetInput = this.adapter.findPromptInput();
        
        if (targetInput && patch?.replaceText !== undefined) {
          if (targetInput instanceof HTMLTextAreaElement || targetInput instanceof HTMLInputElement) {
            targetInput.value = patch.replaceText;
          } else {
            targetInput.textContent = patch.replaceText;
          }
          
          targetInput.dispatchEvent(new Event("input", { bubbles: true }));
          sendResponse({ success: true });
        }
      }
    });
  }

  private extractText(el: HTMLElement): string {
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      return el.value;
    }
    return el.innerText || el.textContent || "";
  }

  private sendToBackground(event: ExtensionEvent): Promise<any> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(event, resolve);
    });
  }
}
