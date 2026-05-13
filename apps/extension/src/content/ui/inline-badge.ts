/**
 * Inline badge UI injection.
 *
 * Renders a small OptiPrompt status badge near the prompt input element to
 * indicate that the extension is active and monitoring. The badge shows
 * different states: idle, analyzing, suggestions ready.
 *
 * All DOM is created imperatively (no React) since this runs in the content
 * script context, directly in the host page DOM.
 *
 * @module ui/inline-badge
 */

export type BadgeState = "idle" | "analyzing" | "ready" | "error";

const BADGE_ID = "optiprompt-inline-badge";

/**
 * Style constants injected into the page via a <style> element.
 */
const BADGE_STYLES = `
  #${BADGE_ID} {
    position: absolute;
    z-index: 99999;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 12px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    user-select: none;
    pointer-events: auto;
    transition: all 0.2s ease;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
    opacity: 0.85;
  }

  #${BADGE_ID}:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  #${BADGE_ID}[data-state="idle"] {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: #a8b2d1;
    border: 1px solid rgba(168, 178, 209, 0.2);
  }

  #${BADGE_ID}[data-state="analyzing"] {
    background: linear-gradient(135deg, #1a1a2e, #0d1b3e);
    color: #64b5f6;
    border: 1px solid rgba(100, 181, 246, 0.3);
  }

  #${BADGE_ID}[data-state="ready"] {
    background: linear-gradient(135deg, #0d3b2e, #1a4a3a);
    color: #81c784;
    border: 1px solid rgba(129, 199, 132, 0.3);
  }

  #${BADGE_ID}[data-state="error"] {
    background: linear-gradient(135deg, #3b1a1a, #4a2020);
    color: #ef9a9a;
    border: 1px solid rgba(239, 154, 154, 0.3);
  }

  #${BADGE_ID} .optiprompt-badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  #${BADGE_ID}[data-state="idle"] .optiprompt-badge-dot {
    background: #a8b2d1;
  }

  #${BADGE_ID}[data-state="analyzing"] .optiprompt-badge-dot {
    background: #64b5f6;
    animation: optiprompt-pulse 1.2s ease-in-out infinite;
  }

  #${BADGE_ID}[data-state="ready"] .optiprompt-badge-dot {
    background: #81c784;
  }

  #${BADGE_ID}[data-state="error"] .optiprompt-badge-dot {
    background: #ef9a9a;
  }

  @keyframes optiprompt-pulse {
    0%, 100% { opacity: 0.4; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;

const STATE_LABELS: Record<BadgeState, string> = {
  idle: "OptiPrompt",
  analyzing: "Analyzing…",
  ready: "Suggestions",
  error: "Error",
};

let styleInjected = false;

function injectStyles(): void {
  if (styleInjected) return;
  const style = document.createElement("style");
  style.id = "optiprompt-badge-styles";
  style.textContent = BADGE_STYLES;
  document.head.appendChild(style);
  styleInjected = true;
}

/**
 * Creates or updates the inline badge near a target anchor element.
 *
 * @param anchor - The element to position the badge near (usually the prompt input)
 * @param state  - The current badge state
 * @param onClick - Optional click handler (e.g., to open the side panel)
 * @returns The badge HTMLElement
 */
export function showInlineBadge(
  anchor: HTMLElement,
  state: BadgeState = "idle",
  onClick?: () => void
): HTMLElement {
  injectStyles();

  let badge = document.getElementById(BADGE_ID);

  if (!badge) {
    badge = document.createElement("div");
    badge.id = BADGE_ID;
    badge.innerHTML = `
      <span class="optiprompt-badge-dot"></span>
      <span class="optiprompt-badge-label">${STATE_LABELS[state]}</span>
    `;

    // Position relative to the anchor
    const anchorParent = anchor.parentElement || document.body;
    if (getComputedStyle(anchorParent).position === "static") {
      anchorParent.style.position = "relative";
    }
    anchorParent.appendChild(badge);
  }

  // Update state
  badge.setAttribute("data-state", state);
  const label = badge.querySelector(".optiprompt-badge-label");
  if (label) label.textContent = STATE_LABELS[state];

  // Position the badge at the top-right corner of the anchor
  positionBadge(badge, anchor);

  // Update click handler
  if (onClick) {
    badge.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onClick();
    };
  }

  return badge;
}

/**
 * Positions the badge at the top-right of the anchor element.
 */
function positionBadge(badge: HTMLElement, anchor: HTMLElement): void {
  const anchorRect = anchor.getBoundingClientRect();
  const parentRect = (anchor.parentElement || document.body).getBoundingClientRect();

  badge.style.top = `${anchorRect.top - parentRect.top - 8}px`;
  badge.style.right = `${parentRect.right - anchorRect.right + 4}px`;
  badge.style.left = "auto";
}

/**
 * Updates the badge state without recreating it.
 */
export function updateBadgeState(state: BadgeState): void {
  const badge = document.getElementById(BADGE_ID);
  if (!badge) return;

  badge.setAttribute("data-state", state);
  const label = badge.querySelector(".optiprompt-badge-label");
  if (label) label.textContent = STATE_LABELS[state];
}

/**
 * Removes the badge from the DOM.
 */
export function removeBadge(): void {
  const badge = document.getElementById(BADGE_ID);
  badge?.remove();
}
