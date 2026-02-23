import { Request, Response } from "express";
import * as History from "../services/history.service";

export async function list(req: Request, res: Response) {
  const userId = req.user!.id;
  const { fromISO, toISO, limit } = req.query as any;
  const logs = await History.listHistory(userId, fromISO, toISO, Number(limit ?? 50));
  res.json({ logs });
}
