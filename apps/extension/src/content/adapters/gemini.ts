/**
 * Gemini adapter (gemini.google.com).
 *
 * Gemini uses a Quill-based rich text editor (`.ql-editor`) with contenteditable,
 * or occasionally a plain textarea. Submit is typically via Enter key or a
 * dedicated send button.
 *
 * @module adapters/gemini
 */

import { BaseAdapter, AdapterListenerCallbacks } from "./base";
import { GEMINI_SELECTORS, SiteSelectors, queryWithFallbacks } from "../dom/selectors";

export class GeminiAdapter extends BaseAdapter {
  readonly name = "Gemini";
  readonly selectors: SiteSelectors = GEMINI_SELECTORS;

  matches(url: string): boolean {
    return url.includes("gemini.google.com");
  }

  getConversationTitle(): string | null {
    const titleEl = queryWithFallbacks(this.selectors.conversationTitle);
    if (titleEl) return titleEl.textContent?.trim() || null;

    const title = document.title;
    if (title && title !== "Gemini") {
      return title.replace(/\s*[-|]\s*Gemini$/, "").trim() || null;
    }
    return null;
  }

  getModelProfile(): string | null {
    const el = queryWithFallbacks(this.selectors.modelIndicator);
    const text = el?.textContent?.trim();
    if (text) return text;

    return "gemini-pro";
  }

  /**
   * Gemini-specific listener installation.
   * Gemini's Quill editor is contenteditable, requiring MutationObserver.
   * Also handles the case where Gemini uses a plain textarea.
   */
  installListeners(callbacks: AdapterListenerCallbacks): () => void {
    const cleanupFns: (() => void)[] = [];
    const inputHandle = this.findPromptInput();
    const inputEl = inputHandle?.getElement();

    if (!inputEl) {
      console.warn("[OptiPrompt:Gemini] Could not find prompt input");
      return () => {};
    }

    let lastText = "";

    if (inputHandle?.isContentEditable()) {
      // Quill editor: use MutationObserver
      const inputObserver = new MutationObserver(() => {
        if (!inputHandle) return;
        const text = inputHandle.getText();
        if (text !== lastText) {
          lastText = text;
          callbacks.onInputChange(text);
        }
      });
      inputObserver.observe(inputEl, {
        childList: true,
        subtree: true,
        characterData: true,
      });
      cleanupFns.push(() => inputObserver.disconnect());
    }

    // Standard input event listener (works for textarea and as fallback)
    const onInput = () => {
      if (!inputHandle) return;
      const text = inputHandle.getText();
      if (text !== lastText) {
        lastText = text;
        callbacks.onInputChange(text);
      }
    };
    inputEl.addEventListener("input", onInput);
    cleanupFns.push(() => inputEl.removeEventListener("input", onInput));

    // Enter key submission
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
        const textBefore = inputHandle?.getText() || "";
        if (!textBefore.trim()) return;

        setTimeout(() => {
          const textAfter = inputHandle?.getText() || "";
          if (!textAfter.trim()) {
            callbacks.onSubmit(textBefore);
            lastText = "";
          }
        }, 200);
      }
    };
    inputEl.addEventListener("keydown", onKeydown, { capture: true });
    cleanupFns.push(() =>
      inputEl.removeEventListener("keydown", onKeydown, { capture: true })
    );

    // Submit button click
    const submitBtn = this.findSubmitButton();
    if (submitBtn) {
      const onBtnClick = () => {
        const textBefore = inputHandle?.getText() || "";
        if (!textBefore.trim()) return;

        setTimeout(() => {
          const textAfter = inputHandle?.getText() || "";
          if (!textAfter.trim()) {
            callbacks.onSubmit(textBefore);
            lastText = "";
          }
        }, 200);
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
}
