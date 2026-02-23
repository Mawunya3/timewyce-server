import { Request, Response } from "express";
import { runScheduler } from "../services/agentRunner.service";
import { prisma } from "../db/prisma";
import { confirmRun } from "../services/confirmation.service";

export async function run(req: Request, res: Response) {
  const userId = req.user!.id;
  const { intent, range, text, eventId, changes, context } = req.body;

  const { runId, output } = await runScheduler(userId, { intent, range, text, eventId, changes, context });
  res.status(201).json({ runId, output });
}

export async function get(req: Request, res: Response) {
  const userId = req.user!.id;
  const run = await prisma.agentRun.findFirst({ where: { id: req.params.id, userId } });
  if (!run) return res.status(404).json({ message: "AgentRun not found" });
  res.json({ run });
}

export async function confirm(req: Request, res: Response) {
  const userId = req.user!.id;
  const run = await prisma.agentRun.findFirst({ where: { id: req.params.id, userId } });
  if (!run) return res.status(404).json({ message: "AgentRun not found" });

  await confirmRun(run.id, req.body.confirmationToken);
  res.json({ ok: true, status: "confirmed" });
}
