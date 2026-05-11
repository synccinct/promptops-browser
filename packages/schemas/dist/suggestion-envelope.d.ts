import { z } from "zod";
export declare const PromptPatchSchema: z.ZodObject<{
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
}>;
export declare const SuggestionScoresSchema: z.ZodObject<{
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
export declare const SuggestionCardSchema: z.ZodObject<{
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
}>;
export declare const PromptVariantSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    strategy: z.ZodEnum<["concise", "structured", "model-specific", "safer"]>;
    promptText: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    label: string;
    strategy: "concise" | "structured" | "model-specific" | "safer";
    promptText: string;
}, {
    id: string;
    label: string;
    strategy: "concise" | "structured" | "model-specific" | "safer";
    promptText: string;
}>;
export declare const SuggestionTraceSchema: z.ZodObject<{
    nodeId: z.ZodString;
    reason: z.ZodString;
    state: z.ZodEnum<["cached", "updated", "pending", "failed"]>;
}, "strip", z.ZodTypeAny, {
    nodeId: string;
    reason: string;
    state: "cached" | "updated" | "pending" | "failed";
}, {
    nodeId: string;
    reason: string;
    state: "cached" | "updated" | "pending" | "failed";
}>;
export declare const SuggestionEnvelopeSchema: z.ZodObject<{
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
        id: string;
        label: string;
        strategy: "concise" | "structured" | "model-specific" | "safer";
        promptText: string;
    }, {
        id: string;
        label: string;
        strategy: "concise" | "structured" | "model-specific" | "safer";
        promptText: string;
    }>, "many">;
    trace: z.ZodArray<z.ZodObject<{
        nodeId: z.ZodString;
        reason: z.ZodString;
        state: z.ZodEnum<["cached", "updated", "pending", "failed"]>;
    }, "strip", z.ZodTypeAny, {
        nodeId: string;
        reason: string;
        state: "cached" | "updated" | "pending" | "failed";
    }, {
        nodeId: string;
        reason: string;
        state: "cached" | "updated" | "pending" | "failed";
    }>, "many">;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "failed" | "ready";
    id: string;
    sessionId: string;
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
        id: string;
        label: string;
        strategy: "concise" | "structured" | "model-specific" | "safer";
        promptText: string;
    }[];
    trace: {
        nodeId: string;
        reason: string;
        state: "cached" | "updated" | "pending" | "failed";
    }[];
    createdAt: string;
    updatedAt: string;
    promptVersionId?: string | undefined;
}, {
    status: "pending" | "failed" | "ready";
    id: string;
    sessionId: string;
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
        id: string;
        label: string;
        strategy: "concise" | "structured" | "model-specific" | "safer";
        promptText: string;
    }[];
    trace: {
        nodeId: string;
        reason: string;
        state: "cached" | "updated" | "pending" | "failed";
    }[];
    createdAt: string;
    updatedAt: string;
    promptVersionId?: string | undefined;
}>;
export type PromptPatch = z.infer<typeof PromptPatchSchema>;
export type SuggestionScores = z.infer<typeof SuggestionScoresSchema>;
export type SuggestionCard = z.infer<typeof SuggestionCardSchema>;
export type PromptVariant = z.infer<typeof PromptVariantSchema>;
export type SuggestionTrace = z.infer<typeof SuggestionTraceSchema>;
export type SuggestionEnvelope = z.infer<typeof SuggestionEnvelopeSchema>;
