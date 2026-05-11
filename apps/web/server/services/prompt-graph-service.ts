// Scaffolded for Phase 1

import { PromptGraph } from "@optiprompt/prompt-graph";

export const promptGraphEngine = new PromptGraph();

export async function evaluatePrompt(context: any) {
  return promptGraphEngine.run(context);
}
