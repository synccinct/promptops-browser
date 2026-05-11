import { z } from "zod";
export declare const PromptVariableSchema: z.ZodObject<{
    name: z.ZodString;
    required: z.ZodBoolean;
    defaultValue: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    required: boolean;
    defaultValue?: string | undefined;
}, {
    name: string;
    required: boolean;
    defaultValue?: string | undefined;
}>;
export declare const PromptStructureSchema: z.ZodObject<{
    intent: z.ZodOptional<z.ZodString>;
    audience: z.ZodOptional<z.ZodString>;
    constraints: z.ZodArray<z.ZodString, "many">;
    outputFormat: z.ZodOptional<z.ZodString>;
    examples: z.ZodArray<z.ZodString, "many">;
    variables: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        required: z.ZodBoolean;
        defaultValue: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        required: boolean;
        defaultValue?: string | undefined;
    }, {
        name: string;
        required: boolean;
        defaultValue?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    constraints: string[];
    examples: string[];
    variables: {
        name: string;
        required: boolean;
        defaultValue?: string | undefined;
    }[];
    intent?: string | undefined;
    audience?: string | undefined;
    outputFormat?: string | undefined;
}, {
    constraints: string[];
    examples: string[];
    variables: {
        name: string;
        required: boolean;
        defaultValue?: string | undefined;
    }[];
    intent?: string | undefined;
    audience?: string | undefined;
    outputFormat?: string | undefined;
}>;
export type ZodPromptStructure = z.infer<typeof PromptStructureSchema>;
