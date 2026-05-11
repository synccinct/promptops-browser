import { z } from "zod";

export const PromptPatchSchema = z.object({
  replaceText: z.string().optional(),
  insertions: z.array(
    z.object({
      at: z.number(),
      text: z.string(),
    })
  ).optional(),
});

export const SuggestionScoresSchema = z.object({
  clarity: z.number().min(0).max(100),
  specificity: z.number().min(0).max(100),
  completeness: z.number().min(0).max(100),
  modelFit: z.number().min(0).max(100),
});

export const SuggestionCardSchema = z.object({
  id: z.string(),
  kind: z.enum(["constraint", "context", "format", "model-fit", "risk"]),
  title: z.string(),
  message: z.string(),
  actionLabel: z.string().optional(),
  actionPatch: PromptPatchSchema.optional(),
});

export const PromptVariantSchema = z.object({
  id: z.string(),
  label: z.string(),
  strategy: z.enum(["concise", "structured", "model-specific", "safer"]),
  promptText: z.string(),
});

export const SuggestionTraceSchema = z.object({
  nodeId: z.string(),
  reason: z.string(),
  state: z.enum(["cached", "updated", "pending", "failed"]),
});

export const SuggestionEnvelopeSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  promptDraftId: z.string(),
  promptVersionId: z.string().optional(),
  status: z.enum(["pending", "ready", "failed"]),
  scores: SuggestionScoresSchema,
  cards: z.array(SuggestionCardSchema),
  variants: z.array(PromptVariantSchema),
  trace: z.array(SuggestionTraceSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ZodSuggestionEnvelope = z.infer<typeof SuggestionEnvelopeSchema>;
