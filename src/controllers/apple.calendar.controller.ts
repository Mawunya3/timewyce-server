import { Request, Response } from "express";

/**
 * Stub. Hook in Apple Calendar integration later.
 */
export async function status(_req: Request, res: Response) {
  res.json({ ok: true, integration: "apple_calendar", status: "stub" });
}
