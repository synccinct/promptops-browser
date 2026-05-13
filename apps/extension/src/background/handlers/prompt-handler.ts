import { ExtensionEvent } from "@optiprompt/domain";
import { sessionManager } from "../session-manager";
import { apiClient } from "../auth-bridge";
import { openSidePanelForTab } from "../sidepanel-behavior";

let suggestionTimeout: ReturnType<typeof setTimeout> | null = null;

export const promptHandler = {
  async handleCaptured(
    payload: Extract<ExtensionEvent, { type: "PROMPT_CAPTURED" }>["payload"],
    sender: chrome.runtime.MessageSender
  ) {
    const session = await sessionManager.getOrCreateSession(
      payload.sourceSite,
      payload.tabUrl,
      payload.conversationTitle,
      sender.tab?.id
    );
    
    if (sender.tab?.id) {
      openSidePanelForTab(sender.tab.id).catch(() => {});
    }

    chrome.runtime.sendMessage({
      type: "SESSION_UPDATED",
      payload: { session }
    }).catch(() => {});

    return { success: true, sessionId: session.id };
  },

  async handleChanged(payload: Extract<ExtensionEvent, { type: "PROMPT_CHANGED" }>["payload"]) {
    try {
      const draft = await sessionManager.updateDraft(
        payload.promptText,
        payload.promptText.trim()
      );

      chrome.runtime.sendMessage({
        type: "DRAFT_UPDATED",
        payload: { draft }
      }).catch(() => {});

      promptHandler.scheduleSuggestionRequest(draft.sessionId, draft.id, payload.promptText);

      return { success: true, draftId: draft.id };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  async handleSubmitted() {
    if (suggestionTimeout) clearTimeout(suggestionTimeout);
    console.log("[Background] Prompt submitted, finalizing analysis");
    return { success: true };
  },

  scheduleSuggestionRequest(sessionId: string, draftId: string, promptText: string) {
    if (suggestionTimeout) clearTimeout(suggestionTimeout);

    suggestionTimeout = setTimeout(async () => {
      console.log("[Background] Requesting suggestions for draft:", draftId);
      
      try {
        chrome.runtime.sendMessage({ type: "ANALYSIS_STARTED" }).catch(() => {});

        const envelope = await apiClient.requestSuggestions({
          sessionId,
          draftId,
          modelProfile: "gpt-4o",
          promptText
        });

        chrome.runtime.sendMessage({
          type: "SUGGESTIONS_READY",
          payload: { sessionId, draftId, envelope }
        }).catch(() => {});

      } catch (error) {
        console.error("[Background] Suggestion error:", error);
      }
    }, 2000);
  }
};
