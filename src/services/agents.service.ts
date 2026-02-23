import { prisma } from "../db/prisma";

export async function listAgents() {
  return prisma.agent.findMany({ orderBy: { updatedAt: "desc" } });
}

export async function upsertAgent(input: { key: string; name: string; prompt: string; version?: string }) {
  return prisma.agent.upsert({
    where: { key: input.key },
    create: { key: input.key, name: input.name, prompt: input.prompt, version: input.version ?? "1" },
    update: { name: input.name, prompt: input.prompt, version: input.version ?? "1" },
  });
}

export async function getAgentByKey(key: string) {
  const a = await prisma.agent.findUnique({ where: { key } });
  if (!a) throw Object.assign(new Error("Agent not found"), { status: 404 });
  return a;
}
