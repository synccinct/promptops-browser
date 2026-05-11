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
