import { Request, Response } from "express";
import * as Events from "../services/events.service";

export async function list(req: Request, res: Response) {
  const userId = req.user!.id;
  const { fromISO, toISO } = req.query as any;
  const events = await Events.listEvents(userId, fromISO, toISO);
  res.json({ events });
}

export async function get(req: Request, res: Response) {
  const userId = req.user!.id;
  const e = await Events.getEvent(userId, req.params.id);
  res.json({ event: e });
}

export async function create(req: Request, res: Response) {
  const userId = req.user!.id;
  const { title, startTimeISO, endTimeISO, metadata } = req.body;
  const e = await Events.createEvent(userId, title, startTimeISO, endTimeISO, metadata);
  res.status(201).json({ event: e });
}

export async function update(req: Request, res: Response) {
  const userId = req.user!.id;
  const e = await Events.updateEvent(userId, req.params.id, req.body);
  res.json({ event: e });
}

export async function cancel(req: Request, res: Response) {
  const userId = req.user!.id;
  const e = await Events.cancelEvent(userId, req.params.id, req.body.reason ?? "user requested");
  res.json({ event: e });
}
