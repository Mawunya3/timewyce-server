import crypto from "crypto";
import { prisma } from "../db/prisma";

export function generateToken(length = 24) {
  return crypto.randomBytes(length).toString("hex");
}

export async function attachConfirmation(runId: string, token: string) {
  return prisma.agentRun.update({
    where: { id: runId },
    data: { needsConfirmation: true, confirmationToken: token, status: "pending_confirmation" },
  });
}

export async function confirmRun(runId: string, token: string) {
  const run = await prisma.agentRun.findUnique({ where: { id: runId } });
  if (!run) throw Object.assign(new Error("AgentRun not found"), { status: 404 });
  if (!run.confirmationToken || run.confirmationToken !== token) {
    throw Object.assign(new Error("Invalid confirmation token"), { status: 401 });
  }
  return prisma.agentRun.update({
    where: { id: runId },
    data: { status: "confirmed" },
  });
}
