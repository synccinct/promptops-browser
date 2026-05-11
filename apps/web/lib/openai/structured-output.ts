import { SuggestionEnvelope } from "@optiprompt/schemas";

// Stub implementation for prompt-graph evaluation
// In reality, this would use the `openai` sdk and pass the SuggestionEnvelopeSchema
export async function callOpenAIStructured(systemPrompt: string, userPrompt: string): Promise<Omit<SuggestionEnvelope, "id" | "sessionId" | "promptDraftId" | "createdAt" | "updatedAt">> {
  console.log("[OpenAI Stub] Generating structured suggestions for:", userPrompt);
  
  // Return a mock output that conforms to the schema
  return {
    status: "ready",
    scores: {
      clarity: 80,
      specificity: 75,
      completeness: 85,
      modelFit: 90,
    },
    cards: [
      {
        id: crypto.randomUUID(),
        kind: "context",
        title: "Add Context",
        message: "You should add more context.",
      }
    ],
    variants: [],
    trace: [],
  };
}
