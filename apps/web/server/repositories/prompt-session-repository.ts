import { createClient } from "../../lib/db/supabase-server";

export interface PromptSession {
  id: string;
  workspace_id?: string | null;
  user_id: string;
  source_site: string;
  tab_url: string;
  conversation_title?: string | null;
  started_at: string;
  last_seen_at: string;
}

export async function upsertSession(session: PromptSession): Promise<PromptSession> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_sessions")
    .upsert(session, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to upsert session: ${error.message}`);
  }

  return data as PromptSession;
}

export async function getSessionById(id: string): Promise<PromptSession | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prompt_sessions")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch session: ${error.message}`);
  }

  return data as PromptSession;
}
