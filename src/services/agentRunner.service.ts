import type { Event } from "@prisma/client";
import { JEWEL_SCHEDULER_PROMPT } from "../config/prompts/jewelScheduler.prompt";
import { listEvents, getEvent, createEvent, updateEvent, cancelEvent } from "./events.service";
import { getSettings } from "./settings.service";
import { logHistory } from "./history.service";
import { trackAnalytics } from "./analytics.service";
import { detectHighStakes, detectOverload } from "./stressPolicy.service";
import { prisma } from "../db/prisma";
import { generateToken, attachConfirmation } from "./confirmation.service";

/**
 * NOTE:
 * This project skeleton does not call an LLM directly.
 * You can plug your model call into `plan()`.
 * For now, we implement a deterministic planner that supports:
 * - summarize (range: today/week/past)
 * - create/modify/cancel via explicit changes object
 *
 * This keeps the backend usable immediately, and you can upgrade to model-based planning later.
 */

export type AgentRequest = {
  user: { id: string; timezone?: string };
  intent: "create" | "modify" | "summarize" | "cancel";
  range?: "past" | "today" | "week";
  text?: string;
  eventId?: string;
  changes?: Record<string, any>;
  context?: Record<string, any>;
};

export type ConciergeOutput = {
  summary: string;
  proposals: any[];
  actionsTaken: any[];
  needsConfirmation: boolean;
  confirmationQuestion: string;
  notesForUI: { highStakesDetected: boolean; overloadDetected: boolean; buffersAdded: number };
};

function rangeToISO(range: "past" | "today" | "week", now = new Date()) {
  const start = new Date(now);
  const end = new Date(now);
  if (range === "today") {
    start.setUTCHours(0, 0, 0, 0);
    end.setUTCHours(23, 59, 59, 999);
  } else if (range === "week") {
    // Next 7 days inclusive
    end.setUTCDate(end.getUTCDate() + 7);
  } else {
    // past 7 days
    start.setUTCDate(start.getUTCDate() - 7);
  }
  return { fromISO: start.toISOString(), toISO: end.toISOString() };
}

export async function runScheduler(userId: string, input: Omit<AgentRequest, "user">): Promise<{ runId: string; output: ConciergeOutput }> {
  const settings = await getSettings(userId);
  const req: AgentRequest = { user: { id: userId, timezone: settings.timezone }, ...input };

  // Create AgentRun record early
  const run = await prisma.agentRun.create({
    data: {
      userId,
      intent: req.intent,
      input: req as any,
      output: {},
      status: "done",
    },
  });

  const output = await planAndMaybeExecute(req);

  await prisma.agentRun.update({
    where: { id: run.id },
    data: { output: output as any, needsConfirmation: output.needsConfirmation, status: output.needsConfirmation ? "pending_confirmation" : "done" },
  });

  // Logs (non-blocking intent)
  await logHistory(userId, "agent.run", { runId: run.id, intent: req.intent });
  await trackAnalytics(userId, "agent_run", { runId: run.id, intent: req.intent });

  // If needs confirmation, attach token
  if (output.needsConfirmation) {
    const token = generateToken(12);
    await attachConfirmation(run.id, token);
    // inject token into output for UI to show (or store and show separately)
    (output as any).confirmationToken = token;
  }

  return { runId: run.id, output };
}

async function planAndMaybeExecute(req: AgentRequest): Promise<ConciergeOutput> {
  const text = req.text ?? "";
  const highStakesDetected = detectHighStakes(text);

  // Summarize flow
  if (req.intent === "summarize") {
    const r = rangeToISO(req.range ?? "today", new Date());
    const events = await listEvents(req.user.id, r.fromISO, r.toISO);
    const overloadDetected = detectOverload(events);

    return {
      summary: summarize(events, req.range ?? "today"),
      proposals: [{ type: "summarize", fromISO: r.fromISO, toISO: r.toISO, reason: "Clarity reduces stress." }],
      actionsTaken: [],
      needsConfirmation: false,
      confirmationQuestion: "",
      notesForUI: { highStakesDetected: false, overloadDetected, buffersAdded: 0 },
    };
  }

  // Create / Modify / Cancel: require explicit times/patch in changes for this skeleton
  const changes = req.changes ?? {};
  const actionsTaken: any[] = [];
  const proposals: any[] = [];
  let buffersAdded = 0;

  // If cancel intent or patch includes status cancelled, require confirmation (always), also for high-stakes.
  const isCancelish = req.intent === "cancel" || changes.status === "cancelled";
  if (isCancelish || highStakesDetected) {
    const eventId = req.eventId || changes.eventId;
    proposals.push({
      type: req.intent === "cancel" ? "cancel" : "modify",
      eventId,
      reason: highStakesDetected ? "High-stakes detected. Confirming prevents accidental disruption." : "Cancels are reversible, but still worth a deliberate click.",
      patch: req.intent === "cancel" ? undefined : changes,
    });

    return {
      summary: highStakesDetected
        ? "I detected a high-stakes item. I’m proposing the change, but I need your explicit confirmation."
        : "I’m ready to apply this change, but I need confirmation first.",
      proposals,
      actionsTaken: [],
      needsConfirmation: true,
      confirmationQuestion: eventId ? "Confirm: apply this change to the selected event?" : "Confirm: which event should I apply this to (provide eventId)?",
      notesForUI: { highStakesDetected, overloadDetected: false, buffersAdded: 0 },
    };
  }

  // Execute up to 3 changes (here typically 1)
  if (req.intent === "create") {
    const { title, startTimeISO, endTimeISO, metadata } = changes as any;
    if (!title || !startTimeISO || !endTimeISO) {
      return {
        summary: "I can create it, but I need a title + start and end time.",
        proposals: [
          { type: "create", title: title ?? "(new activity)", reason: "Clear timing keeps your day calm." },
        ],
        actionsTaken: [],
        needsConfirmation: true,
        confirmationQuestion: "What title, startTimeISO, and endTimeISO should I use?",
        notesForUI: { highStakesDetected: false, overloadDetected: false, buffersAdded: 0 },
      };
    }
    const created = await createEvent(req.user.id, title, startTimeISO, endTimeISO, metadata ?? {});
    actionsTaken.push({ type: "create", eventId: created.id, result: "Created" });
    proposals.push({ type: "create", eventId: created.id, title, fromISO: startTimeISO, toISO: endTimeISO, reason: "Adds structure without overloading you." });
    return {
      summary: `Created: ${title}`,
      proposals,
      actionsTaken,
      needsConfirmation: false,
      confirmationQuestion: "",
      notesForUI: { highStakesDetected: false, overloadDetected: false, buffersAdded },
    };
  }

  if (req.intent === "modify") {
    const eventId = req.eventId || (changes as any).eventId;
    if (!eventId) {
      return {
        summary: "Tell me which event to modify (eventId).",
        proposals: [{ type: "modify", reason: "Picking the right target avoids chaos." }],
        actionsTaken: [],
        needsConfirmation: true,
        confirmationQuestion: "Which eventId should I modify?",
        notesForUI: { highStakesDetected: false, overloadDetected: false, buffersAdded: 0 },
      };
    }
    const updated = await updateEvent(req.user.id, eventId, changes);
    actionsTaken.push({ type: "modify", eventId, result: "Updated" });
    proposals.push({ type: "modify", eventId, title: updated.title, fromISO: updated.startTime.toISOString(), toISO: updated.endTime.toISOString(), reason: "Keeps your plan aligned." });
    return {
      summary: `Updated: ${updated.title}`,
      proposals,
      actionsTaken,
      needsConfirmation: false,
      confirmationQuestion: "",
      notesForUI: { highStakesDetected: false, overloadDetected: false, buffersAdded },
    };
  }

  if (req.intent === "cancel") {
    // Should have returned needsConfirmation earlier; kept here for completeness
    return {
      summary: "Cancel requests require explicit confirmation.",
      proposals: [{ type: "cancel", eventId: req.eventId, reason: "Prevents accidental cancellations." }],
      actionsTaken: [],
      needsConfirmation: true,
      confirmationQuestion: "Confirm cancel?",
      notesForUI: { highStakesDetected, overloadDetected: false, buffersAdded: 0 },
    };
  }

  return {
    summary: "Nothing to do.",
    proposals: [],
    actionsTaken: [],
    needsConfirmation: false,
    confirmationQuestion: "",
    notesForUI: { highStakesDetected: false, overloadDetected: false, buffersAdded: 0 },
  };
}

function summarize(events: Event[], range: string) {
  if (events.length === 0) return `No activities found for ${range}.`;
  const lines = events.map(e => `• ${e.title} (${e.startTime.toISOString()} → ${e.endTime.toISOString()}) [${e.status}]`);
  return `Activities for ${range} (${events.length}):\n` + lines.join("\n");
}

export const PROMPT_REFERENCE = JEWEL_SCHEDULER_PROMPT;
