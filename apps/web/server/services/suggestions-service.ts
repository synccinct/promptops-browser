import { ZodSuggestionEnvelope, SuggestionEnvelopeSchema } from "@optiprompt/schemas";
import { callOpenAIStructured } from "../../lib/openai/structured-output";
import { saveSuggestionEnvelope } from "../repositories/suggestion-envelope-repository";

interface SuggestionRequest {
  sessionId: string;
  draftId: string;
  workspaceId: string;
  modelProfile: string;
  userId: string;
  promptText?: string;
}

export async function generateSuggestions(req: SuggestionRequest): Promise<ZodSuggestionEnvelope> {
  const { sessionId, draftId, promptText } = req;
  const prompt = promptText || "No prompt text provided.";

  // In a real implementation, we would pass this to the Prompt-Graph Engine
  // For Track F, we do a direct call to the structured output model

  const systemPrompt = `You are an expert prompt engineer. Analyze the following prompt and provide suggestions to improve it.
Return a highly structured JSON response strictly adhering to the SuggestionEnvelope JSON schema.`;

  // Use the structured output utility
  const modelResponse = await callOpenAIStructured(systemPrompt, prompt);
  
  // Combine model response with session routing metadata
  const envelope: ZodSuggestionEnvelope = {
    ...modelResponse,
    id: crypto.randomUUID(),
    sessionId,
    promptDraftId: draftId,
    createdAt: new Date().toISOString(),
  };

  // Validate to guarantee strict contracts
  const validated = SuggestionEnvelopeSchema.parse(envelope);

  // Persist
  await saveSuggestionEnvelope(validated);

  return validated;
}
