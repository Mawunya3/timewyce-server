import { Request, Response } from "express";

function nowIso() {
  return new Date().toISOString();
}

export async function status(req: Request, res: Response) {
  // TODO: Load user's integration record from DB
  // const integration = await prisma.integration.findUnique({ where: { userId_provider: ... } })

  return res.json({
    ok: true,
    integration: "google_calendar",
    connected: false,      // integration?.connected ?? false
    email: null,           // integration?.email ?? null
    lastSyncedAt: null,    // integration?.lastSyncedAt?.toISOString() ?? null
    scopes: [],            // integration?.scopes ?? []
    error: null,           // integration?.lastError ?? null
  });
}

export async function connectUrl(req: Request, res: Response) {
  // UI might send where to return after connect
  const { app_redirect } = req.query as { app_redirect?: string };

  // TODO: Generate OAuth URL (Google) with redirect back to your server callback
  // return res.json({ ok: true, url });

  return res.json({
    ok: true,
    url: null,
    warning: "stub: implement OAuth connectUrl",
    app_redirect: app_redirect ?? null,
  });
}

export async function sync(req: Request, res: Response) {
  // UI may send a range. Provide defaults.
  const { timeMin, timeMax } = (req.body ?? {}) as { timeMin?: string; timeMax?: string };

  const defaultMin = new Date();
  defaultMin.setDate(1);
  defaultMin.setHours(0, 0, 0, 0);

  const defaultMax = new Date(defaultMin);
  defaultMax.setMonth(defaultMax.getMonth() + 1);

  const range = {
    timeMin: timeMin ?? defaultMin.toISOString(),
    timeMax: timeMax ?? defaultMax.toISOString(),
  };

  // TODO:
  // 1) Load user's Google tokens from DB
  // 2) Fetch events from Google Calendar API
  // 3) Upsert into your DB
  // 4) Return counts for UI

  return res.json({
    ok: true,
    integration: "google_calendar",
    syncedAt: nowIso(),
    range,
    counts: { fetched: 0, upserted: 0, deleted: 0 },
    warning: "stub",
  });
}

export async function listEvents(req: Request, res: Response) {
  const { timeMin, timeMax, cursor, limit } = req.query as Record<string, string>;

  const take = Math.min(Number(limit ?? 50), 200);

  // TODO: Query your DB for events for this user within [timeMin, timeMax]
  // const items = await prisma.calendarEvent.findMany({ ... })

  return res.json({
    ok: true,
    items: [],
    nextCursor: null,
    meta: {
      timeMin: timeMin ?? null,
      timeMax: timeMax ?? null,
      cursor: cursor ?? null,
      limit: take,
    },
  });
}