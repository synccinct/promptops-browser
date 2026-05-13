/**
 * ChatGPT adapter (chatgpt.com).
 *
 * ChatGPT uses a ProseMirror-based contenteditable `#prompt-textarea` div.
 * Submission is triggered by Enter key or clicking the send button.
 * The model selector is exposed via a `[data-testid='model-selector']` element.
 *
 * @module adapters/chatgpt
 */

import { BaseAdapter, AdapterListenerCallbacks } from "./base";
import { CHATGPT_SELECTORS, SiteSelectors, queryWithFallbacks } from "../dom/selectors";
import { PromptInputHandle } from "../dom/prompt-input";

export class ChatGPTAdapter extends BaseAdapter {
  readonly name = "ChatGPT";
  readonly selectors: SiteSelectors = CHATGPT_SELECTORS;

  matches(url: string): boolean {
    return url.includes("chatgpt.com");
  }

  getConversationTitle(): string | null {
    // ChatGPT puts the conversation title in the page title with a suffix
    const titleEl = queryWithFallbacks(this.selectors.conversationTitle);
    if (titleEl) return titleEl.textContent?.trim() || null;

    // Fallback: strip suffix from document.title
    const title = document.title;
    if (title && title !== "ChatGPT") {
      return title.replace(/\s*[-|]\s*ChatGPT$/, "").trim() || null;
    }
    return null;
  }

  getModelProfile(): string | null {
    const el = queryWithFallbacks(this.selectors.modelIndicator);
    const text = el?.textContent?.trim();
    if (text) return text;

    // Default fallback
    return "gpt-4o";
  }

  /**
   * ChatGPT-specific listener installation.
   * ChatGPT's ProseMirror editor requires observing `input` events on the
   * contenteditable div. Submit detection uses both Enter key and the send
   * button, plus a MutationObserver to detect when ChatGPT clears the input
   * after submission.
   */
  installListeners(callbacks: AdapterListenerCallbacks): () => void {
    const cleanupFns: (() => void)[] = [];
    const inputHandle = this.findPromptInput();
    const inputEl = inputHandle?.getElement();

    if (!inputEl) {
      console.warn("[OptiPrompt:ChatGPT] Could not find prompt input");
      return () => {};
    }

    let lastText = "";

    // --- Input change via MutationObserver (ProseMirror doesn't always fire input events) ---
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

    // Also listen for regular input events as a fallback
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

    // --- Enter key submission ---
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

    // --- Send button click ---
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
