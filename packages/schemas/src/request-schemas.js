"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptCapturedPayloadSchema = exports.RequestSuggestionsPayloadSchema = void 0;
const zod_1 = require("zod");
exports.RequestSuggestionsPayloadSchema = zod_1.z.object({
    sessionId: zod_1.z.string(),
    draftId: zod_1.z.string(),
    workspaceId: zod_1.z.string().optional(),
    modelProfile: zod_1.z.string(),
});
exports.PromptCapturedPayloadSchema = zod_1.z.object({
    sessionId: zod_1.z.string(),
    promptText: zod_1.z.string(),
    sourceSite: zod_1.z.string(),
    tabUrl: zod_1.z.string().url(),
    conversationTitle: zod_1.z.string().optional().nullable(),
    capturedAt: zod_1.z.string().datetime(),
});
