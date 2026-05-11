import { PromptSession, PromptDraft } from "@optiprompt/domain";

export class SessionManager {
  private activeSession: PromptSession | null = null;
  private currentDraft: PromptDraft | null = null;

  async getOrCreateSession(sourceSite: string, tabUrl: string, conversationTitle?: string | null): Promise<PromptSession> {
    if (this.activeSession && this.activeSession.tabUrl === tabUrl) {
      return this.activeSession;
    }

    // In a real app, this might call the backend to start a session
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

    this.activeSession = session;
    return session;
  }

  async updateDraft(rawText: string, normalizedText: string): Promise<PromptDraft> {
    if (!this.activeSession) {
      throw new Error("No active session");
    }

    const draft: PromptDraft = {
      id: crypto.randomUUID(),
      sessionId: this.activeSession.id,
      rawText,
      normalizedText,
      createdAt: new Date().toISOString(),
    };

    this.currentDraft = draft;
    return draft;
  }

  getActiveSession() {
    return this.activeSession;
  }

  getCurrentDraft() {
    return this.currentDraft;
  }

  clear() {
    this.activeSession = null;
    this.currentDraft = null;
  }
}

export const sessionManager = new SessionManager();
