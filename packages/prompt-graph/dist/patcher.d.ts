import type { PromptPatch } from "@optiprompt/schemas";
export declare class Patcher {
    generatePatch(originalText: string, newText: string): PromptPatch;
}
