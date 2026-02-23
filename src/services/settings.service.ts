import { prisma } from "../db/prisma";

export async function getSettings(userId: string) {
  const s = await prisma.setting.findUnique({ where: { userId } });
  if (s) return s;
  return prisma.setting.create({ data: { userId } });
}

export async function updateSettings(userId: string, patch: { timezone?: string; preferences?: any }) {
  await getSettings(userId);
  return prisma.setting.update({
    where: { userId },
    data: {
      ...(patch.timezone ? { timezone: patch.timezone } : {}),
      ...(patch.preferences ? { preferences: patch.preferences } : {}),
    },
  });
}
