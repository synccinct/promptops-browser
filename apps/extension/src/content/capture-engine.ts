import { BaseAdapter } from "./adapters/base";
import { ExtensionEvent } from "@optiprompt/domain";

export class CaptureEngine {
  private lastCapturedText: string = "";

  constructor(private adapter: BaseAdapter) {}

  start() {
    const input = this.adapter.findPromptInput();
    if (!input) {
      console.warn(`[OptiPrompt] Could not find input for adapter: ${this.adapter.name}`);
      return;
    }

    // Monitor for changes
    input.addEventListener("input", (e) => {
      const text = this.extractText(e.target as HTMLElement);
      if (text === this.lastCapturedText) return;
      
      this.lastCapturedText = text;

      this.sendToBackground({
        type: "PROMPT_CHANGED",
        payload: {
          ...this.adapter.capturePrompt(text),
          draftId: "", // Resolved by background
          previousPromptText: "", // Not tracked here yet
        }
      });
    });

    // Monitor for submissions
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const text = this.extractText(e.target as HTMLElement);
        this.sendToBackground({
          type: "PROMPT_SUBMITTED",
          payload: {
            ...this.adapter.capturePrompt(text),
            draftId: "",
            submittedAt: new Date().toISOString(),
          }
        });
      }
    });
  }

  private extractText(el: HTMLElement): string {
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      return el.value;
    }
    return el.innerText || el.textContent || "";
  }

  private sendToBackground(event: any) {
    chrome.runtime.sendMessage(event);
  }
}
