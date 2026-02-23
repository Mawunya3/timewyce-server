import { z } from "zod";

export const ListHistoryQuery = z.object({
  fromISO: z.string().datetime().optional(),
  toISO: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional().default(50),
});
