import { SuggestionEnvelope } from "@optiprompt/schemas";
import { createClient } from "../../lib/db/supabase-server";

export async function saveSuggestionEnvelope(envelope: SuggestionEnvelope): Promise<void> {
  const supabase = createClient();
  
  // Map the domain model to the DB schema
  const dbRecord = {
    id: envelope.id,
    session_id: envelope.sessionId,
    prompt_draft_id: envelope.promptDraftId,
    // prompt_version_id: envelope.promptVersionId, // Currently not in SuggestionEnvelope schema
    status: envelope.status || "ready",
    scores: envelope.scores,
    cards: envelope.cards,
    variants: envelope.variants,
    trace: envelope.trace || [],
    created_at: envelope.createdAt,
  };

  const { error } = await supabase
    .from("suggestion_envelopes")
    .insert(dbRecord);

  if (error) {
    throw new Error(`Failed to save suggestion envelope: ${error.message}`);
  }
  
  console.log(`[Repository] Saved suggestion envelope ${envelope.id} for session ${envelope.sessionId}`);
}
