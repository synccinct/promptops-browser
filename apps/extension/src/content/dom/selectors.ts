/**
 * Centralized DOM selector definitions for each supported AI platform.
 * These selectors are the single source of truth for finding prompt inputs,
 * submit buttons, conversation titles, and model indicators on each site.
 *
 * @module dom/selectors
 */

export interface SiteSelectors {
  /** CSS selectors for the prompt input element, tried in order until one matches. */
  promptInput: string[];
  /** CSS selectors for the submit / send button. */
  submitButton: string[];
  /** CSS selectors for the conversation title display. */
  conversationTitle: string[];
  /** CSS selectors for the active model indicator. */
  modelIndicator: string[];
  /** CSS selectors for the conversation list / sidebar container (used for badge anchoring). */
  conversationContainer: string[];
}

/**
 * ChatGPT (chatgpt.com) DOM selectors.
 * ChatGPT uses a ProseMirror-based `#prompt-textarea` as a contenteditable div,
 * with a data-testid send button adjacent to it.
 */
export const CHATGPT_SELECTORS: SiteSelectors = {
  promptInput: [
    "#prompt-textarea",
    "textarea[data-id='root']",
    "div[contenteditable='true'][data-placeholder]",
  ],
  submitButton: [
    "button[data-testid='send-button']",
    "button[data-testid='fruitjuice-send-button']",
    "form button[type='submit']",
  ],
  conversationTitle: [
    "nav a.bg-token-sidebar-surface-secondary",
    "h1",
  ],
  modelIndicator: [
    "button[data-testid='model-selector'] span",
    "[data-testid='model-selector']",
  ],
  conversationContainer: [
    "main .flex.flex-col",
    "main",
  ],
};

/**
 * Claude (claude.ai) DOM selectors.
 * Claude uses a contenteditable div for input with a ProseMirror-like editor.
 */
export const CLAUDE_SELECTORS: SiteSelectors = {
  promptInput: [
    "div.ProseMirror[contenteditable='true']",
    "[contenteditable='true']",
    "fieldset div[contenteditable='true']",
  ],
  submitButton: [
    "button[aria-label='Send Message']",
    "button[type='submit']",
    "fieldset button:last-of-type",
  ],
  conversationTitle: [
    "button[data-testid='chat-title']",
    "header h2",
  ],
  modelIndicator: [
    "button[data-testid='model-selector'] span",
    "[data-testid='model-picker'] span",
  ],
  conversationContainer: [
    "div[class*='conversation']",
    "main",
  ],
};

/**
 * Gemini (gemini.google.com) DOM selectors.
 * Gemini uses a rich-text editor with a `.ql-editor` class or a plain textarea.
 */
export const GEMINI_SELECTORS: SiteSelectors = {
  promptInput: [
    ".ql-editor[contenteditable='true']",
    "rich-textarea .ql-editor",
    ".textarea",
    "textarea",
  ],
  submitButton: [
    "button.send-button",
    "button[aria-label='Send message']",
    ".input-area button[mat-icon-button]",
  ],
  conversationTitle: [
    ".conversation-title",
    "header h1",
  ],
  modelIndicator: [
    "model-selector .selected-model",
    ".model-selector button span",
  ],
  conversationContainer: [
    ".conversation-container",
    "main",
  ],
};

/**
 * Perplexity (perplexity.ai) DOM selectors.
 * Perplexity uses a standard textarea element with a nearby submit button.
 */
export const PERPLEXITY_SELECTORS: SiteSelectors = {
  promptInput: [
    "textarea[placeholder*='Ask']",
    "textarea",
  ],
  submitButton: [
    "button[aria-label='Submit']",
    "button[type='submit']",
    "form button:last-of-type",
  ],
  conversationTitle: [
    "h1.font-display",
    "h1",
  ],
  modelIndicator: [
    "[data-testid='model-selector']",
    "button.model-selector span",
  ],
  conversationContainer: [
    ".answer-container",
    "main",
  ],
};

/**
 * Registry mapping site names to their selector definitions.
 */
export const SELECTOR_REGISTRY: Record<string, SiteSelectors> = {
  ChatGPT: CHATGPT_SELECTORS,
  Claude: CLAUDE_SELECTORS,
  Gemini: GEMINI_SELECTORS,
  Perplexity: PERPLEXITY_SELECTORS,
};

/**
 * Attempts to find an element using a list of fallback selectors.
 * Returns the first match, or null if none match.
 */
export function queryWithFallbacks(selectors: string[]): HTMLElement | null {
  for (const selector of selectors) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) return el;
  }
  return null;
}

/**
 * Same as queryWithFallbacks but returns all matches from the first selector that has results.
 */
export function queryAllWithFallbacks(selectors: string[]): HTMLElement[] {
  for (const selector of selectors) {
    const els = document.querySelectorAll<HTMLElement>(selector);
    if (els.length > 0) return Array.from(els);
  }
  return [];
}
