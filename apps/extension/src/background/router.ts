import { ExtensionEvent } from "@optiprompt/domain";
import { promptHandler } from "./handlers/prompt-handler";
import { patchHandler } from "./handlers/patch-handler";
import { openSidePanelForTab } from "./sidepanel-behavior";

/**
 * Internal message types used for UI coordination (not part of ExtensionEvent).
 */
interface InternalMessage {
  type: string;
  payload?: any;
}

export function initRouter() {
  chrome.runtime.onMessage.addListener(
    (message: ExtensionEvent | InternalMessage, sender, sendResponse) => {
      handleEvent(message as ExtensionEvent | InternalMessage, sender).then(sendResponse);
      return true;
    }
  );
}

async function handleEvent(
  event: ExtensionEvent | InternalMessage,
  sender: chrome.runtime.MessageSender
) {
  console.log("[Background] Handling event:", event.type);

  switch (event.type) {
    case "PROMPT_CAPTURED":
      return promptHandler.handleCaptured(
        (event as Extract<ExtensionEvent, { type: "PROMPT_CAPTURED" }>).payload,
        sender
      );
    case "PROMPT_CHANGED":
      return promptHandler.handleChanged(
        (event as Extract<ExtensionEvent, { type: "PROMPT_CHANGED" }>).payload
      );
    case "PROMPT_SUBMITTED":
      return promptHandler.handleSubmitted();
    case "APPLY_PATCH":
      return patchHandler.handleApplyPatch(
        (event as Extract<ExtensionEvent, { type: "APPLY_PATCH" }>).payload
      );
    case "OPEN_SIDEPANEL":
      if (sender.tab?.id) {
        return openSidePanelForTab(sender.tab.id)
          .then(() => ({ success: true }))
          .catch(() => ({ success: false, error: "Could not open side panel" }));
      }
      return { success: false, error: "No tab context" };
    default:
      return { success: false, error: "Unhandled event type" };
  }
}
