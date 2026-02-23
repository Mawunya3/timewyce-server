import { z } from "zod";

export const LoginSchema = z.object({
  // In this backend, login is usually handled client-side via Supabase.
  // This exists to keep route parity if you want server-side exchange.
  email: z.string().email(),
  password: z.string().min(6),
});
