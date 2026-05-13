import { z } from "zod";
import { SuggestionEnvelopeSchema } from "./suggestion-envelope";

export const SuggestionsRequestSchema = z.object({
  sessionId: z.string(),
  draftId: z.string(),
  workspaceId: z.string().optional(),
  promptText: z.string(),
  modelProfile: z.string(),
});

export const SuggestionsResponseSchema = z.object({
  envelope: SuggestionEnvelopeSchema,
});

export const SyncSessionRequestSchema = z.object({
  sessionId: z.string(),
  sourceSite: z.string(),
  tabUrl: z.string().url(),
  conversationTitle: z.string().optional().nullable(),
  workspaceId: z.string().optional(),
});

export const RecordDraftRequestSchema = z.object({
  draftId: z.string(),
  rawText: z.string(),
  normalizedText: z.string(),
});

export const SessionStartSchema = z.object({
  sessionId: z.string(),
  sourceSite: z.string(),
  tabUrl: z.string().url(),
  conversationTitle: z.string().optional().nullable(),
});

export const ExtensionRecordDraftSchema = z.object({
  sessionId: z.string(),
  draftId: z.string(),
  rawText: z.string(),
  normalizedText: z.string(),
});
