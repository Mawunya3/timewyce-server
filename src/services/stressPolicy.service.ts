import type { Event } from "@prisma/client";

const HIGH_STAKES_RE = /(doctor|hospital|clinic|exam|interview|flight|visa|court|surgery|immigration|appointment|meeting with boss|deadline)/i;

export function detectHighStakes(text: string): boolean {
  return HIGH_STAKES_RE.test(text);
}

export function computeScheduledMinutes(events: Event[]): number {
  return events.reduce((sum, e) => sum + Math.max(0, (e.endTime.getTime() - e.startTime.getTime()) / 60000), 0);
}

export function detectOverload(events: Event[]): boolean {
  return computeScheduledMinutes(events) >= 360; // >= 6 hours
}

export function proposeBuffer(startISO: string, endISO: string, bufferMin: number) {
  // For now, just returns suggestion. Executor decides if it can shift.
  return { startISO, endISO, bufferMin };
}
