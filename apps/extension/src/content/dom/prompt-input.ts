/**
 * Unified prompt input abstraction. Normalizes reading and writing text across
 * `<textarea>`, `<input>`, and `contenteditable` elements (ProseMirror, etc.).
 *
 * @module dom/prompt-input
 */

/**
 * Represents a normalized handle to a prompt input element, regardless of
 * whether it is a textarea, input, or contenteditable div.
 */
export class PromptInputHandle {
  constructor(private readonly element: HTMLElement) {}

  /** Returns the underlying DOM element. */
  getElement(): HTMLElement {
    return this.element;
  }

  /** Returns true if the element is a textarea or input. */
  isNativeInput(): boolean {
    return (
      this.element instanceof HTMLTextAreaElement ||
      this.element instanceof HTMLInputElement
    );
  }

  /** Returns true if the element is a contenteditable div. */
  isContentEditable(): boolean {
    return (
      this.element.getAttribute("contenteditable") === "true" ||
      this.element.isContentEditable
    );
  }

  /**
   * Extracts the current text from the input element.
   * Handles textarea, input, and contenteditable elements.
   */
  getText(): string {
    if (this.isNativeInput()) {
      return (this.element as HTMLTextAreaElement | HTMLInputElement).value;
    }

    // For contenteditable: prefer innerText for proper newline handling
    return this.element.innerText || this.element.textContent || "";
  }

  /**
   * Sets the text content of the input element, triggering the appropriate
   * input events so the host application recognizes the change.
   */
  setText(text: string): void {
    if (this.isNativeInput()) {
      const nativeEl = this.element as HTMLTextAreaElement | HTMLInputElement;
      // Use native setter to bypass React / framework value trapping
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(nativeEl, text);
      } else {
        nativeEl.value = text;
      }
    } else {
      // For contenteditable elements
      this.element.textContent = text;
    }

    // Fire input event so the host SPA picks up the change
    this.element.dispatchEvent(new Event("input", { bubbles: true }));
    // Some frameworks also listen for InputEvent
    this.element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertText",
        data: text,
      })
    );
  }

  /**
   * Checks if the input is currently empty.
   */
  isEmpty(): boolean {
    return this.getText().trim().length === 0;
  }

  /**
   * Focuses the input element.
   */
  focus(): void {
    this.element.focus();
  }

  /**
   * Returns the bounding rect of the input, useful for UI injection positioning.
   */
  getBounds(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}

/**
 * Creates a PromptInputHandle from a raw HTMLElement.
 * Returns null if the element is not a valid input target.
 */
export function createPromptInputHandle(
  element: HTMLElement | null
): PromptInputHandle | null {
  if (!element) return null;

  const isInput =
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLInputElement;
  const isEditable =
    element.getAttribute("contenteditable") === "true" ||
    element.isContentEditable;

  if (!isInput && !isEditable) return null;

  return new PromptInputHandle(element);
}
