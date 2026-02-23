import { prisma } from "../db/prisma";

export async function trackAnalytics(userId: string, type: string, payload: any = {}) {
  return prisma.analyticsEvent.create({ data: { userId, type, payload } });
}
