import { Request, Response } from "express";
import * as Analytics from "../services/analytics.service";

export async function track(req: Request, res: Response) {
  const userId = req.user!.id;
  const { type, payload } = req.body;
  const ev = await Analytics.trackAnalytics(userId, type, payload ?? {});
  res.status(201).json({ analytics: ev });
}
