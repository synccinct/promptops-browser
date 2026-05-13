/**
 * Inline action buttons injected near the prompt input.
 *
 * When suggestions are ready, this module renders small action buttons
 * (e.g., "Apply", "View All") adjacent to the prompt input, giving the
 * user quick access to suggestion actions without needing to open the
 * side panel.
 *
 * All DOM is created imperatively (no React) since this runs in the content
 * script context, directly in the host page DOM.
 *
 * @module ui/inline-actions
 */

const ACTIONS_ID = "optiprompt-inline-actions";

const ACTIONS_STYLES = `
  #${ACTIONS_ID} {
    position: absolute;
    z-index: 99998;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px;
    border-radius: 8px;
    background: rgba(15, 15, 30, 0.92);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    pointer-events: auto;
  }

  #${ACTIONS_ID}.optiprompt-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .optiprompt-action-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: none;
    border-radius: 6px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .optiprompt-action-btn:hover {
    transform: translateY(-1px);
  }

  .optiprompt-action-btn:active {
    transform: translateY(0);
  }

  .optiprompt-action-btn--apply {
    background: linear-gradient(135deg, #2e7d32, #388e3c);
    color: #e8f5e9;
  }

  .optiprompt-action-btn--apply:hover {
    background: linear-gradient(135deg, #388e3c, #43a047);
    box-shadow: 0 2px 8px rgba(46, 125, 50, 0.4);
  }

  .optiprompt-action-btn--view {
    background: rgba(255, 255, 255, 0.06);
    color: #b0bec5;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .optiprompt-action-btn--view:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #eceff1;
  }

  .optiprompt-action-btn--dismiss {
    background: transparent;
    color: #78909c;
    padding: 4px 6px;
    min-width: auto;
  }

  .optiprompt-action-btn--dismiss:hover {
    color: #ef5350;
  }
`;

/**
 * Inline action button definition.
 */
export interface InlineAction {
  id: string;
  label: string;
  variant: "apply" | "view" | "dismiss";
  onClick: () => void;
}

let actionsStyleInjected = false;

function injectActionsStyles(): void {
  if (actionsStyleInjected) return;
  const style = document.createElement("style");
  style.id = "optiprompt-actions-styles";
  style.textContent = ACTIONS_STYLES;
  document.head.appendChild(style);
  actionsStyleInjected = true;
}

/**
 * Shows inline action buttons near the anchor element.
 *
 * @param anchor  - The element to position actions near (usually the prompt input)
 * @param actions - List of action buttons to render
 * @returns The actions container HTMLElement
 */
export function showInlineActions(
  anchor: HTMLElement,
  actions: InlineAction[]
): HTMLElement {
  injectActionsStyles();

  // Remove existing if present
  removeInlineActions();

  const container = document.createElement("div");
  container.id = ACTIONS_ID;

  for (const action of actions) {
    const btn = document.createElement("button");
    btn.className = `optiprompt-action-btn optiprompt-action-btn--${action.variant}`;
    btn.textContent = action.label;
    btn.setAttribute("data-action-id", action.id);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      action.onClick();
    });
    container.appendChild(btn);
  }

  // Position relative to the anchor
  const anchorParent = anchor.parentElement || document.body;
  if (getComputedStyle(anchorParent).position === "static") {
    anchorParent.style.position = "relative";
  }
  anchorParent.appendChild(container);

  // Position below the anchor element
  positionActions(container, anchor);

  // Animate in
  requestAnimationFrame(() => {
    container.classList.add("optiprompt-visible");
  });

  return container;
}

/**
 * Positions the actions container below the anchor element.
 */
function positionActions(container: HTMLElement, anchor: HTMLElement): void {
  const anchorRect = anchor.getBoundingClientRect();
  const parentRect = (anchor.parentElement || document.body).getBoundingClientRect();

  container.style.top = `${anchorRect.bottom - parentRect.top + 4}px`;
  container.style.right = `${parentRect.right - anchorRect.right}px`;
  container.style.left = "auto";
}

/**
 * Removes the inline actions from the DOM.
 */
export function removeInlineActions(): void {
  const existing = document.getElementById(ACTIONS_ID);
  existing?.remove();
}

/**
 * Returns whether inline actions are currently visible.
 */
export function areInlineActionsVisible(): boolean {
  return document.getElementById(ACTIONS_ID) !== null;
}
