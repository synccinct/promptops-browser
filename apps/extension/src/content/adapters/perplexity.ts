/**
 * Perplexity adapter (perplexity.ai).
 *
 * Perplexity uses a standard `<textarea>` for prompt input with a nearby
 * submit button. The search-oriented UX means prompts are typically shorter
 * and submitted via Enter.
 *
 * @module adapters/perplexity
 */

import { BaseAdapter } from "./base";
import { PERPLEXITY_SELECTORS, SiteSelectors } from "../dom/selectors";

export class PerplexityAdapter extends BaseAdapter {
  readonly name = "Perplexity";
  readonly selectors: SiteSelectors = PERPLEXITY_SELECTORS;

  matches(url: string): boolean {
    return url.includes("perplexity.ai");
  }

  getConversationTitle(): string | null {
    const title = document.title;
    if (title && title !== "Perplexity") {
      return title.replace(/\s*[-|]\s*Perplexity$/, "").trim() || null;
    }
    return null;
  }

  getModelProfile(): string | null {
    const el = document.querySelector<HTMLElement>("[data-testid='model-selector']");
    const text = el?.textContent?.trim();
    if (text) return text;

    return "perplexity-sonar";
  }

  // Perplexity uses a standard textarea; the base adapter's installListeners()
  // handles textarea input/submit detection correctly, so no override needed.
}
