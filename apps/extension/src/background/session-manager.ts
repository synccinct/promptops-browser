import { PromptSession, PromptDraft } from "@optiprompt/domain";
import { storage } from "./storage";

export class SessionManager {
  async getOrCreateSession(sourceSite: string, tabUrl: string, conversationTitle?: string | null): Promise<PromptSession> {
    const activeSession = await storage.get<PromptSession>("activeSession");
    if (activeSession && activeSession.tabUrl === tabUrl) {
      return activeSession;
    }

    const session: PromptSession = {
      id: crypto.randomUUID(),
      workspaceId: null, // To be resolved via auth
      userId: "local-user",
      sourceSite,
      tabUrl,
      conversationTitle: conversationTitle || null,
      startedAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
    };

    await storage.set("activeSession", session);
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
