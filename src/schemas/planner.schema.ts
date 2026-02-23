import { z } from "zod";

export const PlannerOutputSchema = z.object({
  summary: z.string(),
  proposals: z.array(z.any()),
  actionsTaken: z.array(z.any()),
  needsConfirmation: z.boolean(),
  confirmationQuestion: z.string(),
  notesForUI: z.record(z.any()),
});
