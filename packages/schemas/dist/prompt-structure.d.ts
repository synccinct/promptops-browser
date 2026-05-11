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
export declare const ToolDefinitionSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    parameters: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}, {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
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
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        parameters: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    }, {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    }>, "many">>;
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
    tools?: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    }[] | undefined;
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
    tools?: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    }[] | undefined;
}>;
export type PromptVariable = z.infer<typeof PromptVariableSchema>;
export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;
export type PromptStructure = z.infer<typeof PromptStructureSchema>;
