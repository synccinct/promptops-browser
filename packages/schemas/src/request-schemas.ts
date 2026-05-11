import { z } from "zod";

export const RequestSuggestionsPayloadSchema = z.object({
  sessionId: z.string(),
  draftId: z.string(),
  workspaceId: z.string().optional(),
  modelProfile: z.string(),
  promptText: z.string(),
});

export const PromptCapturedPayloadSchema = z.object({
  sessionId: z.string(),
  promptText: z.string(),
  sourceSite: z.string(),
  tabUrl: z.string().url(),
  conversationTitle: z.string().optional().nullable(),
  capturedAt: z.string().datetime(),
});
