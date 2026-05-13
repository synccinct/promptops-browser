import { PromptSession, PromptDraft } from "@optiprompt/domain";
import { storage } from "./storage";
import { syncManager } from "./sync-manager";

export class SessionManager {
  private currentSession: PromptSession | null = null;
  // Add JSDoc comment for clarity
  /**
   * Clears sessions associated with a closed tab
   * @param tabId - The ID of the tab that was closed
   */
  clearIfTab(tabId: number) {
    if (this.currentSession?.tabId === tabId) {
      this.currentSession = null;
    }
  }

  // Add JSDoc comment for clarity
  /**
   * Updates session state when tab URL changes
   * @param tabId - ID of tab that changed
   * @param newUrl - New URL of the tab
   */
  updateSession(tabId: number, newUrl: string | undefined) {
    if (this.currentSession?.tabId === tabId && newUrl) {
      this.currentSession = {
        ...this.currentSession,
        tabUrl: newUrl,
      };
    }
  }
  async getOrCreateSession(
    sourceSite: string,
    tabUrl: string,
    conversationTitle?: string | null,
    tabId?: number
  ): Promise<PromptSession> {
    const activeSession = await storage.get<PromptSession>("activeSession");
    if (activeSession && activeSession.tabUrl === tabUrl) {
      this.currentSession = activeSession;
      return activeSession;
    }

    const session: PromptSession = {
      id: crypto.randomUUID(),
      workspaceId: null, // To be resolved via auth
      userId: "local-user",
      sourceSite,
      tabUrl,
      conversationTitle: conversationTitle || null,
      tabId,
      startedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };

    this.currentSession = session;
    await storage.set("activeSession", session);

    syncManager.queueSyncTask("CREATE_SESSION", session).catch(console.error);

    return session;
  }

  async updateDraft(rawText: string, normalizedText: string): Promise<PromptDraft> {
    const activeSession = await storage.get<PromptSession>("activeSession");
    if (!activeSession) {
      throw new Error("No active session");
    }

    const draft: PromptDraft = {
      id: crypto.randomUUID(),
      sessionId: activeSession.id,
      rawText,
      normalizedText,
      createdAt: new Date().toISOString(),
    };

    await storage.set("currentDraft", draft);

    syncManager.queueSyncTask("CREATE_DRAFT", draft).catch(console.error);

    return draft;
  }

  async getActiveSession() {
    return await storage.get<PromptSession>("activeSession");
  }

  async getCurrentDraft() {
    return await storage.get<PromptDraft>("currentDraft");
  }

  async clear() {
    await storage.remove("activeSession");
    await storage.remove("currentDraft");
  }
}

export const sessionManager = new SessionManager();
