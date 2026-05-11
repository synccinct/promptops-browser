import type { PromptPatch } from "@optiprompt/schemas";

export class Patcher {
  generatePatch(originalText: string, newText: string): PromptPatch {
    // Simple patch logic for now: just replace all
    return { replaceText: newText };
  }
}
