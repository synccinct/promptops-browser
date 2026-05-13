import { ExtensionEvent } from "@optiprompt/domain";

export const patchHandler = {
  async handleApplyPatch(payload: Extract<ExtensionEvent, { type: "APPLY_PATCH" }>["payload"]) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "APPLY_PATCH",
          payload
        });
      }
    });
    return { success: true };
  }
};
