"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtensionRecordDraftSchema = exports.SessionStartSchema = exports.RecordDraftRequestSchema = exports.SyncSessionRequestSchema = exports.SuggestionsResponseSchema = exports.SuggestionsRequestSchema = void 0;
const zod_1 = require("zod");
const suggestion_envelope_1 = require("./suggestion-envelope");
exports.SuggestionsRequestSchema = zod_1.z.object({
    sessionId: zod_1.z.string(),
    draftId: zod_1.z.string(),
    workspaceId: zod_1.z.string().optional(),
    promptText: zod_1.z.string(),
    modelProfile: zod_1.z.string(),
});
exports.SuggestionsResponseSchema = zod_1.z.object({
    envelope: suggestion_envelope_1.SuggestionEnvelopeSchema,
});
exports.SyncSessionRequestSchema = zod_1.z.object({
    sessionId: zod_1.z.string(),
    sourceSite: zod_1.z.string(),
    tabUrl: zod_1.z.string().url(),
    conversationTitle: zod_1.z.string().optional().nullable(),
    workspaceId: zod_1.z.string().optional(),
});
exports.RecordDraftRequestSchema = zod_1.z.object({
    draftId: zod_1.z.string(),
    rawText: zod_1.z.string(),
    normalizedText: zod_1.z.string(),
});
exports.SessionStartSchema = zod_1.z.object({
    sessionId: zod_1.z.string(),
    sourceSite: zod_1.z.string(),
    tabUrl: zod_1.z.string().url(),
    conversationTitle: zod_1.z.string().optional().nullable(),
});
exports.ExtensionRecordDraftSchema = zod_1.z.object({
    sessionId: zod_1.z.string(),
    draftId: zod_1.z.string(),
    rawText: zod_1.z.string(),
    normalizedText: zod_1.z.string(),
});
