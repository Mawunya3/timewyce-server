import { z } from "zod";

export const ConfirmAgentRunBody = z.object({
  confirmationToken: z.string().min(6),
}).strict();
