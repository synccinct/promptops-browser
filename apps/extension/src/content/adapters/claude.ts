/**
 * Claude adapter (claude.ai).
 *
 * Claude uses a ProseMirror-based contenteditable div for prompt input.
 * The editor is typically inside a `fieldset` container.
 * Model selection and conversation title may be detected from header elements.
 *
 * @module adapters/claude
 */

import { BaseAdapter, AdapterListenerCallbacks } from "./base";
import { CLAUDE_SELECTORS, SiteSelectors, queryWithFallbacks } from "../dom/selectors";

export class ClaudeAdapter extends BaseAdapter {
  readonly name = "Claude";
  readonly selectors: SiteSelectors = CLAUDE_SELECTORS;

  matches(url: string): boolean {
    return url.includes("claude.ai");
  }

  getConversationTitle(): string | null {
    const titleEl = queryWithFallbacks(this.selectors.conversationTitle);
    if (titleEl) return titleEl.textContent?.trim() || null;

    // Fallback: parse document title
    const title = document.title;
    if (title && title !== "Claude") {
      return title.replace(/\s*[-|]\s*Claude$/, "").trim() || null;
    }
    return null;
  }

  getModelProfile(): string | null {
    const el = queryWithFallbacks(this.selectors.modelIndicator);
    const text = el?.textContent?.trim();
    if (text) return text;

    // Default fallback
    return "claude-sonnet-4";
  }

  /**
   * Claude-specific listener installation.
   * Claude's contenteditable ProseMirror editor requires MutationObserver
   * monitoring since standard `input` events may not fire reliably.
   */
  installListeners(callbacks: AdapterListenerCallbacks): () => void {
    const cleanupFns: (() => void)[] = [];
    const inputHandle = this.findPromptInput();
    const inputEl = inputHandle?.getElement();

    if (!inputEl) {
      console.warn("[OptiPrompt:Claude] Could not find prompt input");
      return () => {};
    }

    let lastText = "";

    // MutationObserver for ProseMirror contenteditable
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

    // Fallback input event listener
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
