import type { PromptPatch, SuggestionEnvelope } from "./domain-types";

export interface PromptCapturedPayload {
  sessionId: string;
  promptText: string;
  sourceSite: string;
  tabUrl: string;
  conversationTitle?: string | null;
  capturedAt: string;
}

export interface PromptChangedPayload extends PromptCapturedPayload {
  draftId: string;
  previousPromptText?: string;
}

export interface PromptSubmittedPayload extends PromptChangedPayload {
  submittedAt: string;
}

export interface RequestSuggestionsPayload {
  sessionId: string;
  draftId: string;
  workspaceId?: string;
  modelProfile: string;
  promptText: string;
}

export interface SuggestionsReadyPayload {
  sessionId: string;
  draftId: string;
  envelope: SuggestionEnvelope;
}

export interface SuggestionAcceptedPayload {
  sessionId: string;
  draftId: string;
  suggestionId: string;
  patch?: PromptPatch;
  acceptedAt: string;
}

export interface SuggestionDismissedPayload {
  sessionId: string;
  draftId: string;
  suggestionId: string;
  dismissedAt: string;
}

export interface VersionSavedPayload {
  sessionId: string;
  draftId: string;
  promptAssetId?: string;
  versionId: string;
  savedAt: string;
}

export interface SyncFlushRequestedPayload {
  reason: "manual" | "interval" | "online";
  requestedAt: string;
}

export interface ApplyPatchPayload {
  patch: PromptPatch;
}

export type ExtensionEvent =
  | { type: "PROMPT_CAPTURED"; payload: PromptCapturedPayload }
  | { type: "PROMPT_CHANGED"; payload: PromptChangedPayload }
  | { type: "PROMPT_SUBMITTED"; payload: PromptSubmittedPayload }
  | { type: "REQUEST_SUGGESTIONS"; payload: RequestSuggestionsPayload }
  | { type: "SUGGESTIONS_READY"; payload: SuggestionsReadyPayload }
  | { type: "SUGGESTION_ACCEPTED"; payload: SuggestionAcceptedPayload }
  | { type: "SUGGESTION_DISMISSED"; payload: SuggestionDismissedPayload }
  | { type: "VERSION_SAVED"; payload: VersionSavedPayload }
  | { type: "SYNC_FLUSH_REQUESTED"; payload: SyncFlushRequestedPayload }
  | { type: "APPLY_PATCH"; payload: ApplyPatchPayload };
