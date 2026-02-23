import { createClient } from "@supabase/supabase-js";
import { env } from "../utils/env";

const URL = env.supUrl!;
const ANON_KEY = env.supAnon!;

console.log(URL);
console.log(ANON_KEY);

// Use ANON key for normal auth flows exposed to the public internet.
// Service role must never be used for public login/signup endpoints.
export const supabase = createClient(URL, ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});