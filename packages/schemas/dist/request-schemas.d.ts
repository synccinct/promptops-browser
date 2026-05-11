import { z } from "zod";
export declare const RequestSuggestionsPayloadSchema: z.ZodObject<{
    sessionId: z.ZodString;
    draftId: z.ZodString;
    workspaceId: z.ZodOptional<z.ZodString>;
    modelProfile: z.ZodString;
    promptText: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    draftId: string;
    modelProfile: string;
    workspaceId?: string | undefined;
    promptText?: string | undefined;
}, {
    sessionId: string;
    draftId: string;
    modelProfile: string;
    workspaceId?: string | undefined;
    promptText?: string | undefined;
}>;
export declare const PromptCapturedPayloadSchema: z.ZodObject<{
    sessionId: z.ZodString;
    promptText: z.ZodString;
    sourceSite: z.ZodString;
    tabUrl: z.ZodString;
    conversationTitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    capturedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    promptText: string;
    sourceSite: string;
    tabUrl: string;
    capturedAt: string;
    conversationTitle?: string | null | undefined;
}, {
    sessionId: string;
    promptText: string;
    sourceSite: string;
    tabUrl: string;
    capturedAt: string;
    conversationTitle?: string | null | undefined;
}>;
