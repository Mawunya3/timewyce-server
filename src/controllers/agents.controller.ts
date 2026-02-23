import { Request, Response } from "express";
import * as Agents from "../services/agents.service";
import { JEWEL_SCHEDULER_PROMPT } from "../config/prompts/jewelScheduler.prompt";

export async function list(_req: Request, res: Response) {
  const agents = await Agents.listAgents();
  res.json({ agents });
}

export async function upsert(req: Request, res: Response) {
  const a = await Agents.upsertAgent(req.body);
  res.status(201).json({ agent: a });
}

export async function seedJewelScheduler(_req: Request, res: Response) {
  const a = await Agents.upsertAgent({
    key: "jewel_scheduler_concierge",
    name: "Jewel Scheduler Concierge",
    version: "1",
    prompt: JEWEL_SCHEDULER_PROMPT,
  });
  res.status(201).json({ agent: a });
}
