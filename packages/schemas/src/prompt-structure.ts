import { z } from "zod";

export const PromptVariableSchema = z.object({
  name: z.string(),
  required: z.boolean(),
  defaultValue: z.string().optional(),
});

export const PromptStructureSchema = z.object({
  intent: z.string().optional(),
  audience: z.string().optional(),
  constraints: z.array(z.string()),
  outputFormat: z.string().optional(),
  examples: z.array(z.string()),
  variables: z.array(PromptVariableSchema),
});

export type ZodPromptStructure = z.infer<typeof PromptStructureSchema>;
