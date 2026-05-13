/**
 * MutationObserver-based DOM watchers for reliably detecting when prompt input
 * elements appear in SPAs. AI sites load dynamically; the prompt textarea may
 * not exist on initial page load.
 *
 * @module dom/observers
 */

export interface ObserverHandle {
  /** Stops observing and cleans up. */
  disconnect(): void;
}

/**
 * Options for `waitForElement`.
 */
export interface WaitForElementOptions {
  /** Maximum time (ms) to wait before giving up. Default: 30_000. */
  timeout?: number;
  /** Root element to observe. Default: `document.body`. */
  root?: Element;
  /** If true, also observe attribute changes. Default: false. */
  observeAttributes?: boolean;
}

/**
 * Returns a Promise that resolves when an element matching the selector appears
 * in the DOM. Uses MutationObserver under the hood to avoid polling.
 *
 * If the element already exists when called, resolves immediately.
 *
 * @param selector - CSS selector string
 * @param options  - Configuration options
 */
export function waitForElement(
  selector: string,
  options: WaitForElementOptions = {}
): Promise<HTMLElement> {
  const { timeout = 30_000, root, observeAttributes = false } = options;

  return new Promise<HTMLElement>((resolve, reject) => {
    // Check if already present
    const existing = document.querySelector<HTMLElement>(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    let settled = false;
    let observer: MutationObserver | null = null;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      observer?.disconnect();
      reject(new Error(`[OptiPrompt] Timed out waiting for element: ${selector}`));
    }, timeout);

    observer = new MutationObserver((mutations) => {
      if (settled) return;

      for (const mutation of mutations) {
        // Check added nodes
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches(selector)) {
            settled = true;
            clearTimeout(timer);
            observer?.disconnect();
            resolve(node);
            return;
          }
          // Also check descendants of added node
          const descendant = node.querySelector<HTMLElement>(selector);
          if (descendant) {
            settled = true;
            clearTimeout(timer);
            observer?.disconnect();
            resolve(descendant);
            return;
          }
        }
      }
    });

    observer.observe(root ?? document.body, {
      childList: true,
      subtree: true,
      attributes: observeAttributes,
    });
  });
}

/**
 * Waits for an element using a list of fallback selectors. Resolves as soon as
 * any one of the selectors matches.
 */
export function waitForAnyElement(
  selectors: string[],
  options: WaitForElementOptions = {}
): Promise<HTMLElement> {
  // Race all selectors — first one to appear wins
  return Promise.race(
    selectors.map((sel) => waitForElement(sel, options))
  );
}

/**
 * Watches for navigation events within SPAs. Calls the callback whenever the
 * URL changes (via pushState, replaceState, or popstate).
 *
 * Returns a handle with a `disconnect()` method to stop watching.
 */
export function watchNavigation(
  callback: (url: string) => void
): ObserverHandle {
  let lastUrl = location.href;

  const check = () => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      callback(lastUrl);
    }
  };

  // Monkey-patch pushState and replaceState to fire events
  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  history.pushState = function (...args) {
    originalPushState(...args);
    check();
  };

  history.replaceState = function (...args) {
    originalReplaceState(...args);
    check();
  };

  window.addEventListener("popstate", check);

  // Fallback interval for edge cases
  const intervalId = setInterval(check, 1000);

  return {
    disconnect() {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", check);
      clearInterval(intervalId);
    },
  };
}
