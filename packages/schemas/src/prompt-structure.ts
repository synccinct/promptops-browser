import { z } from "zod";

export const PromptVariableSchema = z.object({
  name: z.string(),
  required: z.boolean(),
  defaultValue: z.string().optional(),
});

export const ToolDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.unknown()),
});

export const PromptStructureSchema = z.object({
  intent: z.string().optional(),
  audience: z.string().optional(),
  constraints: z.array(z.string()),
  outputFormat: z.string().optional(),
  examples: z.array(z.string()),
  variables: z.array(PromptVariableSchema),
  tools: z.array(ToolDefinitionSchema).optional(),
});

export type PromptVariable = z.infer<typeof PromptVariableSchema>;
export type ToolDefinition = z.infer<typeof ToolDefinitionSchema>;
export type PromptStructure = z.infer<typeof PromptStructureSchema>;
