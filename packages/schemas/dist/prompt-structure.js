"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptStructureSchema = exports.ToolDefinitionSchema = exports.PromptVariableSchema = void 0;
const zod_1 = require("zod");
exports.PromptVariableSchema = zod_1.z.object({
    name: zod_1.z.string(),
    required: zod_1.z.boolean(),
    defaultValue: zod_1.z.string().optional(),
});
exports.ToolDefinitionSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    parameters: zod_1.z.record(zod_1.z.unknown()),
});
exports.PromptStructureSchema = zod_1.z.object({
    intent: zod_1.z.string().optional(),
    audience: zod_1.z.string().optional(),
    constraints: zod_1.z.array(zod_1.z.string()),
    outputFormat: zod_1.z.string().optional(),
    examples: zod_1.z.array(zod_1.z.string()),
    variables: zod_1.z.array(exports.PromptVariableSchema),
    tools: zod_1.z.array(exports.ToolDefinitionSchema).optional(),
});
