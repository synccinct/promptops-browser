// Background Worker Component

import { ExtensionEvent } from "@optiprompt/domain";
import { sessionManager } from "./session-manager";

let suggestionTimeout: ReturnType<typeof setTimeout> | null = null;

export function initRouter() {
  chrome.runtime.onMessage.addListener((message: ExtensionEvent, sender, sendResponse) => {
    handleEvent(message, sender).then(sendResponse);
    return true; 
  });
}

async function handleEvent(event: ExtensionEvent, sender: chrome.runtime.MessageSender) {
  console.log("[Background] Handling event:", event.type, event.payload);

  switch (event.type) {
    case "PROMPT_CAPTURED": {
      const session = await sessionManager.getOrCreateSession(
        event.payload.sourceSite,
        event.payload.tabUrl,
        event.payload.conversationTitle
      );
      
      chrome.runtime.sendMessage({
        type: "SESSION_UPDATED",
        payload: { session }
      }).catch(() => {});

      return { success: true, sessionId: session.id };
    }

    case "PROMPT_CHANGED": {
      try {
        const draft = await sessionManager.updateDraft(
          event.payload.promptText,
          event.payload.promptText.trim()
        );

        chrome.runtime.sendMessage({
          type: "DRAFT_UPDATED",
          payload: { draft }
        }).catch(() => {});

        // Trigger debounced suggestion request
        scheduleSuggestionRequest(draft.sessionId, draft.id, event.payload.promptText);

        return { success: true, draftId: draft.id };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    }

    case "PROMPT_SUBMITTED": {
      if (suggestionTimeout) clearTimeout(suggestionTimeout);
      console.log("[Background] Prompt submitted, finalizing analysis");
      return { success: true };
    }

    case "APPLY_PATCH": {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "APPLY_PATCH",
            payload: event.payload
          });
        }
      });
      return { success: true };
    }

    default:
      return { success: false, error: "Unhandled event type" };
  }
}

function scheduleSuggestionRequest(sessionId: string, draftId: string, promptText: string) {
  if (suggestionTimeout) clearTimeout(suggestionTimeout);

  suggestionTimeout = setTimeout(async () => {
    console.log("[Background] Requesting suggestions for draft:", draftId);
    
    try {
      chrome.runtime.sendMessage({ type: "ANALYSIS_STARTED" }).catch(() => {});

      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const apiToken = import.meta.env.VITE_API_TOKEN || "dev-token-123";

      const response = await fetch(`${baseUrl}/api/extension/suggestions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          sessionId,
          draftId,
          modelProfile: "gpt-4o", // Default for now
          promptText
        })
      });

      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const envelope = await response.json();

      chrome.runtime.sendMessage({
        type: "SUGGESTIONS_READY",
        payload: { sessionId, draftId, envelope }
      }).catch(() => {});

    } catch (error) {
      console.error("[Background] Suggestion error:", error);
    }
  }, 2000); // 2s debounce
}
