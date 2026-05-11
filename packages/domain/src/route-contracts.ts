import type { SuggestionEnvelope } from "./domain-types";

export interface SuggestionsRequest {
  sessionId: string;
  draftId: string;
  workspaceId?: string;
  promptText: string;
  modelProfile: string;
}

export interface SuggestionsResponse {
  envelope: SuggestionEnvelope;
}
