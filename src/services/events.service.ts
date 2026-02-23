import { prisma } from "../db/prisma";
import { clampRange } from "../utils/time";

export async function listEvents(userId: string, fromISO: string, toISO: string) {
  const r = clampRange(fromISO, toISO);
  return prisma.event.findMany({
    where: { userId, startTime: { gte: new Date(r.fromISO) }, endTime: { lte: new Date(r.toISO) } },
    orderBy: { startTime: "asc" },
  });
}

export async function getEvent(userId: string, eventId: string) {
  const e = await prisma.event.findFirst({ where: { id: eventId, userId } });
  if (!e) throw Object.assign(new Error("Event not found"), { status: 404 });
  return e;
}

export async function createEvent(userId: string, title: string, startTimeISO: string, endTimeISO: string, metadata: any = {}) {
  const start = new Date(startTimeISO);
  const end = new Date(endTimeISO);
  if (end <= start) throw Object.assign(new Error("endTime must be after startTime"), { status: 400 });
  return prisma.event.create({
    data: { userId, title, startTime: start, endTime: end, metadata },
  });
}

export async function updateEvent(userId: string, eventId: string, patch: any) {
  await getEvent(userId, eventId);
  const data: any = {};

  if (patch.title !== undefined) data.title = patch.title;
  if (patch.startTimeISO !== undefined) data.startTime = new Date(patch.startTimeISO);
  if (patch.endTimeISO !== undefined) data.endTime = new Date(patch.endTimeISO);
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.metadata !== undefined) data.metadata = patch.metadata;

  if (data.startTime && data.endTime && data.endTime <= data.startTime) {
    throw Object.assign(new Error("endTime must be after startTime"), { status: 400 });
  }

  return prisma.event.update({ where: { id: eventId }, data });
}

export async function cancelEvent(userId: string, eventId: string, reason: string) {
  const e = await getEvent(userId, eventId);
  const meta = (e.metadata ?? {}) as any;
  return prisma.event.update({
    where: { id: eventId },
    data: {
      status: "cancelled",
      metadata: { ...meta, cancelReason: reason, cancelledAtISO: new Date().toISOString() },
    },
  });
}
