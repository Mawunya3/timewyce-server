import { z } from "zod";

export const UpdateSettingsBody = z.object({
  timezone: z.string().min(1).optional(),
  preferences: z.record(z.any()).optional(),
}).strict();
