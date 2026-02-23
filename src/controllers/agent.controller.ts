import { Request, Response } from "express";
import { JEWEL_SCHEDULER_PROMPT } from "../config/prompts/jewelScheduler.prompt";

export async function info(_req: Request, res: Response) {
  res.json({
    key: "jewel_scheduler_concierge",
    name: "Jewel Scheduler Concierge",
    version: "1",
    promptIncluded: true,
    note: "This endpoint exists for agent discovery. Use /agents to store prompt in DB if desired.",
    promptPreview: JEWEL_SCHEDULER_PROMPT.slice(0, 220) + "...",
  });
}
