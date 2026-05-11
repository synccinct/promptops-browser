import { upsertSession, PromptSession } from "../repositories/prompt-session-repository";
import { saveDraft, PromptDraft } from "../repositories/prompt-draft-repository";

interface SyncSessionRequest {
  sessionId: string;
  userId: string;
  workspaceId?: string;
  sourceSite: string;
  tabUrl: string;
  conversationTitle?: string;
}

export async function syncSession(req: SyncSessionRequest): Promise<PromptSession> {
  const sessionData: PromptSession = {
    id: req.sessionId,
    user_id: req.userId,
    workspace_id: req.workspaceId,
    source_site: req.sourceSite,
    tab_url: req.tabUrl,
    conversation_title: req.conversationTitle,
    started_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
  };

  return await upsertSession(sessionData);
}

interface RecordDraftRequest {
  draftId: string;
  sessionId: string;
  rawText: string;
  normalizedText: string;
}

export async function recordDraft(req: RecordDraftRequest): Promise<PromptDraft> {
  const draftData: PromptDraft = {
    id: req.draftId,
    session_id: req.sessionId,
    raw_text: req.rawText,
    normalized_text: req.normalizedText,
  };

  return await saveDraft(draftData);
}
