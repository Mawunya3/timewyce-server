import { createClient } from "@supabase/supabase-js";
import { env } from "../utils/env";

// Service role client for server-side administrative operations.
// DO NOT expose the service role key to clients.
export const supabaseAdmin = env.supUrl && env.supServ
  ? createClient(env.supUrl, env.supServ, {
      auth: { persistSession: false },
    })
  : null;
