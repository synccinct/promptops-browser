"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionEnvelopeSchema = exports.SuggestionTraceSchema = exports.PromptVariantSchema = exports.SuggestionCardSchema = exports.SuggestionScoresSchema = exports.PromptPatchSchema = void 0;
const zod_1 = require("zod");
exports.PromptPatchSchema = zod_1.z.object({
    replaceText: zod_1.z.string().optional(),
    insertions: zod_1.z.array(zod_1.z.object({
        at: zod_1.z.number(),
        text: zod_1.z.string(),
    })).optional(),
});
exports.SuggestionScoresSchema = zod_1.z.object({
    clarity: zod_1.z.number().min(0).max(100),
    specificity: zod_1.z.number().min(0).max(100),
    completeness: zod_1.z.number().min(0).max(100),
    modelFit: zod_1.z.number().min(0).max(100),
});
exports.SuggestionCardSchema = zod_1.z.object({
    id: zod_1.z.string(),
    kind: zod_1.z.enum(["constraint", "context", "format", "model-fit", "risk"]),
    title: zod_1.z.string(),
    message: zod_1.z.string(),
    actionLabel: zod_1.z.string().optional(),
    actionPatch: exports.PromptPatchSchema.optional(),
});
exports.PromptVariantSchema = zod_1.z.object({
    id: zod_1.z.string(),
    label: zod_1.z.string(),
    strategy: zod_1.z.enum(["concise", "structured", "model-specific", "safer"]),
    promptText: zod_1.z.string(),
});
exports.SuggestionTraceSchema = zod_1.z.object({
    nodeId: zod_1.z.string(),
    reason: zod_1.z.string(),
    state: zod_1.z.enum(["cached", "updated", "pending", "failed"]),
});
exports.SuggestionEnvelopeSchema = zod_1.z.object({
    id: zod_1.z.string(),
    sessionId: zod_1.z.string(),
    promptDraftId: zod_1.z.string(),
    promptVersionId: zod_1.z.string().optional(),
    status: zod_1.z.enum(["pending", "ready", "failed"]),
    scores: exports.SuggestionScoresSchema,
    cards: zod_1.z.array(exports.SuggestionCardSchema),
    variants: zod_1.z.array(exports.PromptVariantSchema),
    trace: zod_1.z.array(exports.SuggestionTraceSchema),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
