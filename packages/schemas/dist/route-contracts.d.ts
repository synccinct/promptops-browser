import { z } from "zod";
export declare const SuggestionsRequestSchema: z.ZodObject<{
    sessionId: z.ZodString;
    draftId: z.ZodString;
    workspaceId: z.ZodOptional<z.ZodString>;
    promptText: z.ZodString;
    modelProfile: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    draftId: string;
    promptText: string;
    modelProfile: string;
    workspaceId?: string | undefined;
}, {
    sessionId: string;
    draftId: string;
    promptText: string;
    modelProfile: string;
    workspaceId?: string | undefined;
}>;
export declare const SuggestionsResponseSchema: z.ZodObject<{
    envelope: z.ZodObject<{
        id: z.ZodString;
        sessionId: z.ZodString;
        promptDraftId: z.ZodString;
        promptVersionId: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<["pending", "ready", "failed"]>;
        scores: z.ZodObject<{
            clarity: z.ZodNumber;
            specificity: z.ZodNumber;
            completeness: z.ZodNumber;
            modelFit: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            clarity: number;
            specificity: number;
            completeness: number;
            modelFit: number;
        }, {
            clarity: number;
            specificity: number;
            completeness: number;
            modelFit: number;
        }>;
        cards: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            kind: z.ZodEnum<["constraint", "context", "format", "model-fit", "risk"]>;
            title: z.ZodString;
            message: z.ZodString;
            actionLabel: z.ZodOptional<z.ZodString>;
            actionPatch: z.ZodOptional<z.ZodObject<{
                replaceText: z.ZodOptional<z.ZodString>;
                insertions: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    at: z.ZodNumber;
                    text: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    at: number;
                    text: string;
                }, {
                    at: number;
                    text: string;
                }>, "many">>;
            }, "strip", z.ZodTypeAny, {
                replaceText?: string | undefined;
                insertions?: {
                    at: number;
                    text: string;
                }[] | undefined;
            }, {
                replaceText?: string | undefined;
                insertions?: {
                    at: number;
                    text: string;
                }[] | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            message: string;
            id: string;
            kind: "constraint" | "context" | "format" | "model-fit" | "risk";
            title: string;
            actionLabel?: string | undefined;
            actionPatch?: {
                replaceText?: string | undefined;
                insertions?: {
                    at: number;
                    text: string;
                }[] | undefined;
            } | undefined;
        }, {
            message: string;
            id: string;
            kind: "constraint" | "context" | "format" | "model-fit" | "risk";
            title: string;
            actionLabel?: string | undefined;
            actionPatch?: {
                replaceText?: string | undefined;
                insertions?: {
                    at: number;
                    text: string;
                }[] | undefined;
            } | undefined;
        }>, "many">;
        variants: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            strategy: z.ZodEnum<["concise", "structured", "model-specific", "safer"]>;
            promptText: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            promptText: string;
            id: string;
            label: string;
            strategy: "concise" | "structured" | "model-specific" | "safer";
        }, {
            promptText: string;
            id: string;
            label: string;
            strategy: "concise" | "structured" | "model-specific" | "safer";
        }>, "many">;
        trace: z.ZodArray<z.ZodObject<{
            nodeId: z.ZodString;
            reason: z.ZodString;
            state: z.ZodEnum<["cached", "updated", "pending", "failed"]>;
        }, "strip", z.ZodTypeAny, {
            nodeId: string;
            reason: string;
            state: "pending" | "failed" | "cached" | "updated";
        }, {
            nodeId: string;
            reason: string;
            state: "pending" | "failed" | "cached" | "updated";
        }>, "many">;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        sessionId: string;
        status: "pending" | "ready" | "failed";
        id: string;
        promptDraftId: string;
        scores: {
            clarity: number;
            specificity: number;
            completeness: number;
            modelFit: number;
        };
        cards: {
            message: string;
            id: string;
            kind: "constraint" | "context" | "format" | "model-fit" | "risk";
            title: string;
            actionLabel?: string | undefined;
            actionPatch?: {
                replaceText?: string | undefined;
                insertions?: {
                    at: number;
                    text: string;
                }[] | undefined;
            } | undefined;
        }[];
        variants: {
            promptText: string;
            id: string;
            label: string;
            strategy: "concise" | "structured" | "model-specific" | "safer";
        }[];
        trace: {
            nodeId: string;
            reason: string;
            state: "pending" | "failed" | "cached" | "updated";
        }[];
        createdAt: string;
        updatedAt: string;
        promptVersionId?: string | undefined;
    }, {
        sessionId: string;
        status: "pending" | "ready" | "failed";
        id: string;
        promptDraftId: string;
        scores: {
            clarity: number;
            specificity: number;
            completeness: number;
            modelFit: number;
        };
        cards: {
            message: string;
            id: string;
            kind: "constraint" | "context" | "format" | "model-fit" | "risk";
            title: string;
            actionLabel?: string | undefined;
            actionPatch?: {
                replaceText?: string | undefined;
                insertions?: {
                    at: number;
                    text: string;
                }[] | undefined;
            } | undefined;
        }[];
        variants: {
            promptText: string;
            id: string;
            label: string;
            strategy: "concise" | "structured" | "model-specific" | "safer";
        }[];
        trace: {
            nodeId: string;
            reason: string;
            state: "pending" | "failed" | "cached" | "updated";
        }[];
        createdAt: string;
        updatedAt: string;
        promptVersionId?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    envelope: {
        sessionId: string;
        status: "pending" | "ready" | "failed";
        id: string;
        promptDraftId: string;
        scores: {
            clarity: number;
            specificity: number;
            completeness: number;
            modelFit: number;
        };
        cards: {
            message: string;
            id: string;
            kind: "constraint" | "context" | "format" | "model-fit" | "risk";
            title: string;
            actionLabel?: string | undefined;
            actionPatch?: {
                replaceText?: string | undefined;
                insertions?: {
                    at: number;
                    text: string;
                }[] | undefined;
            } | undefined;
        }[];
        variants: {
            promptText: string;
            id: string;
            label: string;
            strategy: "concise" | "structured" | "model-specific" | "safer";
        }[];
        trace: {
            nodeId: string;
            reason: string;
            state: "pending" | "failed" | "cached" | "updated";
        }[];
        createdAt: string;
        updatedAt: string;
        promptVersionId?: string | undefined;
    };
}, {
    envelope: {
        sessionId: string;
        status: "pending" | "ready" | "failed";
        id: string;
        promptDraftId: string;
        scores: {
            clarity: number;
            specificity: number;
            completeness: number;
            modelFit: number;
        };
        cards: {
            message: string;
            id: string;
            kind: "constraint" | "context" | "format" | "model-fit" | "risk";
            title: string;
            actionLabel?: string | undefined;
            actionPatch?: {
                replaceText?: string | undefined;
                insertions?: {
                    at: number;
                    text: string;
                }[] | undefined;
            } | undefined;
        }[];
        variants: {
            promptText: string;
            id: string;
            label: string;
            strategy: "concise" | "structured" | "model-specific" | "safer";
        }[];
        trace: {
            nodeId: string;
            reason: string;
            state: "pending" | "failed" | "cached" | "updated";
        }[];
        createdAt: string;
        updatedAt: string;
        promptVersionId?: string | undefined;
    };
}>;
export declare const SyncSessionRequestSchema: z.ZodObject<{
    sessionId: z.ZodString;
    sourceSite: z.ZodString;
    tabUrl: z.ZodString;
    conversationTitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    workspaceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    sourceSite: string;
    tabUrl: string;
    workspaceId?: string | undefined;
    conversationTitle?: string | null | undefined;
}, {
    sessionId: string;
    sourceSite: string;
    tabUrl: string;
    workspaceId?: string | undefined;
    conversationTitle?: string | null | undefined;
}>;
export declare const RecordDraftRequestSchema: z.ZodObject<{
    draftId: z.ZodString;
    rawText: z.ZodString;
    normalizedText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    draftId: string;
    rawText: string;
    normalizedText: string;
}, {
    draftId: string;
    rawText: string;
    normalizedText: string;
}>;
export declare const SessionStartSchema: z.ZodObject<{
    sessionId: z.ZodString;
    sourceSite: z.ZodString;
    tabUrl: z.ZodString;
    conversationTitle: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    sourceSite: string;
    tabUrl: string;
    conversationTitle?: string | null | undefined;
}, {
    sessionId: string;
    sourceSite: string;
    tabUrl: string;
    conversationTitle?: string | null | undefined;
}>;
export declare const ExtensionRecordDraftSchema: z.ZodObject<{
    sessionId: z.ZodString;
    draftId: z.ZodString;
    rawText: z.ZodString;
    normalizedText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
    draftId: string;
    rawText: string;
    normalizedText: string;
}, {
    sessionId: string;
    draftId: string;
    rawText: string;
    normalizedText: string;
}>;
