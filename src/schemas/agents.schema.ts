import { z } from "zod";

export const UpsertAgentBody = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  version: z.string().optional(),
  prompt: z.string().min(1),
}).strict();
