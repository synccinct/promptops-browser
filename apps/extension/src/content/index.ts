/**
 * Content script entry point.
 *
 * This is the main entry point injected into all supported AI platform pages.
 * It detects the active adapter, waits for the prompt input element to appear
 * in the DOM (handling SPA lazy-loading), initializes the CaptureEngine, and
 * watches for SPA navigation events to reinitialize when the user navigates
 * to a new conversation.
 *
 * @module content/index
 */

import { findActiveAdapter } from "./adapter-registry";
import { CaptureEngine } from "./capture-engine";
import { waitForAnyElement } from "./dom/observers";
import { watchNavigation, ObserverHandle } from "./dom/observers";

let currentEngine: CaptureEngine | null = null;
let navWatcher: ObserverHandle | null = null;

/**
 * Initializes the content script for the current page.
 * Finds the active adapter, waits for the prompt input to appear,
 * and starts the capture engine.
 */
async function init(): Promise<void> {
  // Clean up any existing engine from a previous SPA navigation
  cleanup();

  const adapter = findActiveAdapter(window.location.href);
  if (!adapter) {
    console.log("[OptiPrompt] No matching adapter for this page");
    return;
  }

  console.log(`[OptiPrompt] Active adapter: ${adapter.name}`);

  try {
    // Wait for the prompt input to appear in the DOM (SPA-safe)
    const inputEl = await waitForAnyElement(adapter.selectors.promptInput, {
      timeout: 15_000,
    });

    console.log(`[OptiPrompt] Prompt input found for ${adapter.name}:`, inputEl.tagName);

    // Start the capture engine
    const engine = new CaptureEngine(adapter);
    engine.start();
    currentEngine = engine;
  } catch (err) {
    console.warn(`[OptiPrompt] Failed to initialize for ${adapter.name}:`, err);
  }
}

/**
 * Cleans up the current engine and any injected UI.
 */
function cleanup(): void {
  if (currentEngine) {
    currentEngine.destroy();
    currentEngine = null;
  }
}

/**
 * Bootstrap: run init and set up SPA navigation watching.
 */
function bootstrap(): void {
  init();

  // Watch for SPA navigation (pushState, replaceState, popstate)
  navWatcher = watchNavigation((newUrl) => {
    console.log(`[OptiPrompt] SPA navigation detected: ${newUrl}`);
    // Re-initialize after a brief delay to let the new page render
    setTimeout(() => init(), 500);
  });
}

// Ensure the DOM is ready before bootstrapping
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
