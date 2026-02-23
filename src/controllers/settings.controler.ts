import { Request, Response } from "express";
import * as Settings from "../services/settings.service";

// Keep filename misspelling per your instruction: settings.controler.ts
export async function get(req: Request, res: Response) {
  const userId = req.user!.id;
  const s = await Settings.getSettings(userId);
  res.json({ settings: s });
}

export async function update(req: Request, res: Response) {
  const userId = req.user!.id;
  const s = await Settings.updateSettings(userId, req.body);
  res.json({ settings: s });
}
