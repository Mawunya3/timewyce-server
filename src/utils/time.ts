/**
 * Lightweight time helpers. Keep it simple to reduce dependency sprawl.
 * All APIs accept/return ISO strings.
 */

export function nowISO(): string {
  return new Date().toISOString();
}

export function addMinutes(iso: string, minutes: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

export function clampRange(fromISO: string, toISO: string) {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    throw new Error("Invalid ISO date range");
  }
  if (to <= from) throw new Error("toISO must be after fromISO");
  return { fromISO: from.toISOString(), toISO: to.toISOString() };
}
