import { prisma } from "../db/prisma";

export async function logHistory(userId: string, action: string, payload: any = {}) {
  return prisma.historyLog.create({ data: { userId, action, payload } });
}

export async function listHistory(userId: string, fromISO?: string, toISO?: string, limit: number = 50) {
  return prisma.historyLog.findMany({
    where: {
      userId,
      ...(fromISO || toISO
        ? {
            createdAt: {
              ...(fromISO ? { gte: new Date(fromISO) } : {}),
              ...(toISO ? { lte: new Date(toISO) } : {}),
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
