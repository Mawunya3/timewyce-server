import { z } from "zod";

export const AgentRunInputSchema = z.object({
  intent: z.enum(["create", "modify", "summarize", "cancel"]),
  range: z.enum(["past", "today", "week"]).optional(),
  text: z.string().optional(),
  eventId: z.string().optional(),
  changes: z.record(z.any()).optional(),
  context: z.record(z.any()).optional(),
}).strict();
