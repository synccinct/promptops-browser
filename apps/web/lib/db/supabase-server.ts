// Scaffolded for Phase 1

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "../env/env";

export function createClient() {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials");
  }

  return createSupabaseClient(supabaseUrl, supabaseKey);
}
