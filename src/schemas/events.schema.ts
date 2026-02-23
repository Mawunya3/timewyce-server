import { z } from "zod";

export const ListEventsQuery = z.object({
  fromISO: z.string().datetime(),
  toISO: z.string().datetime(),
});

export const CreateEventBody = z.object({
  title: z.string().min(1),
  startTimeISO: z.string().datetime(),
  endTimeISO: z.string().datetime(),
  metadata: z.record(z.any()).optional().default({}),
});

export const UpdateEventBody = z.object({
  title: z.string().min(1).optional(),
  startTimeISO: z.string().datetime().optional(),
  endTimeISO: z.string().datetime().optional(),
  status: z.enum(["scheduled", "cancelled", "completed"]).optional(),
  metadata: z.record(z.any()).optional(),
}).strict();

export const CancelEventBody = z.object({
  reason: z.string().min(1).optional().default("user requested"),
});
