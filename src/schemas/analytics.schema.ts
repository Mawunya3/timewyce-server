import { z } from "zod";

export const TrackAnalyticsBody = z.object({
  type: z.string().min(1),
  payload: z.record(z.any()).optional().default({}),
});
