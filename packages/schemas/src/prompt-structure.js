"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptStructureSchema = exports.PromptVariableSchema = void 0;
const zod_1 = require("zod");
exports.PromptVariableSchema = zod_1.z.object({
    name: zod_1.z.string(),
    required: zod_1.z.boolean(),
    defaultValue: zod_1.z.string().optional(),
});
exports.PromptStructureSchema = zod_1.z.object({
    intent: zod_1.z.string().optional(),
    audience: zod_1.z.string().optional(),
    constraints: zod_1.z.array(zod_1.z.string()),
    outputFormat: zod_1.z.string().optional(),
    examples: zod_1.z.array(zod_1.z.string()),
    variables: zod_1.z.array(exports.PromptVariableSchema),
});
