/**
 * Adapter registry — resolves the correct site-specific adapter for a given URL.
 *
 * All adapters are registered here. The registry is consulted by the content
 * script entry point to determine which adapter (if any) should be activated
 * for the current page.
 *
 * @module adapter-registry
 */

import { BaseAdapter } from "./adapters/base";
import { ChatGPTAdapter } from "./adapters/chatgpt";
import { ClaudeAdapter } from "./adapters/claude";
import { GeminiAdapter } from "./adapters/gemini";
import { PerplexityAdapter } from "./adapters/perplexity";

/**
 * All registered adapters, checked in order.
 */
const adapters: BaseAdapter[] = [
  new ChatGPTAdapter(),
  new ClaudeAdapter(),
  new GeminiAdapter(),
  new PerplexityAdapter(),
];

/**
 * Returns the first adapter that matches the given URL, or null if none match.
 */
export function findActiveAdapter(url: string): BaseAdapter | null {
  return adapters.find((a) => a.matches(url)) || null;
}

/**
 * Returns the names of all registered adapters (useful for debugging/logging).
 */
export function getRegisteredAdapterNames(): string[] {
  return adapters.map((a) => a.name);
}
