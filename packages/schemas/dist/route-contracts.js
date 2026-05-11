"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuggestionsResponseSchema = exports.SuggestionsRequestSchema = void 0;
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
