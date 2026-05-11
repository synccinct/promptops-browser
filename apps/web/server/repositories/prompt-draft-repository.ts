import { createClient } from "../../lib/db/supabase-server";

export interface PromptDraft {
  id: string;
  session_id: string;
  raw_text: string;
  normalized_text: string;
  created_at?: string;
}

export async function saveDraft(draft: PromptDraft): Promise<PromptDraft> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_drafts")
    .insert(draft)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save draft: ${error.message}`);
  }

  return data as PromptDraft;
}

export async function getDraftById(id: string): Promise<PromptDraft | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_drafts")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch draft: ${error.message}`);
  }

  return data as PromptDraft;
}
