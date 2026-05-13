export function setupSidePanelBehavior() {
  if (typeof chrome === "undefined" || !chrome.sidePanel) return;
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
}

export async function openSidePanelForTab(tabId: number) {
  if (typeof chrome === "undefined" || !chrome.sidePanel) return;
  try {
    await chrome.sidePanel.open({ tabId });
  } catch (err) {
    console.warn("[Background] Could not programmatically open side panel:", err);
  }
}
