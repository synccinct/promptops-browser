import { z } from "zod";
export declare const RequestSuggestionsPayloadSchema: z.ZodObject<{
    sessionId: z.ZodString;
    draftId: z.ZodString;
    workspaceId: z.ZodOptional<z.ZodString>;
    modelProfile: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    draftId: string;
    modelProfile: string;
    workspaceId?: string | undefined;
}, {
    sessionId: string;
    draftId: string;
    modelProfile: string;
    workspaceId?: string | undefined;
}>;
export declare const PromptCapturedPayloadSchema: z.ZodObject<{
    sessionId: z.ZodString;
    promptText: z.ZodString;
    sourceSite: z.ZodString;
    tabUrl: z.ZodString;
    conversationTitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    capturedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    promptText: string;
    sessionId: string;
    sourceSite: string;
    tabUrl: string;
    capturedAt: string;
    conversationTitle?: string | null | undefined;
}, {
    promptText: string;
    sessionId: string;
    sourceSite: string;
    tabUrl: string;
    capturedAt: string;
    conversationTitle?: string | null | undefined;
}>;
