# Jewel Scheduler Backend (Node.js + Express + Supabase + Prisma)

This is a **complete scaffold** matching your requested file structure, with working REST routes for:
- Events (list/get/create/update/cancel [soft])
- Settings
- History
- Analytics
- Agent runs (a deterministic scheduler runner you can upgrade to an LLM planner)

## 1) Setup

```bash
pnpm install
cp .env.example .env
```

Fill `.env`:
- `DATABASE_URL` -> your Supabase Postgres connection string
- `SUPABASE_JWKS_URL` -> `https://<project-ref>.supabase.co/auth/v1/keys`
- `SUPABASE_URL` and keys (optional, only needed if you later do admin ops)

## 2) Prisma

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

## 3) Run

```bash
pnpm dev
# or
pnpm build && pnpm start
```

Health:
```bash
curl http://localhost:4000/health
```

## 4) Auth

All `/api/*` routes require `Authorization: Bearer <SUPABASE_ACCESS_TOKEN>`.

Example:
```bash
curl -H "Authorization: Bearer $TOKEN" "http://localhost:4000/api/settings"
```

## 5) Core API routes (quick list)

- `GET /api/events?fromISO=...&toISO=...`
- `POST /api/events`
- `PATCH /api/events/:id`
- `POST /api/events/:id/cancel`  (soft cancel)

- `GET /api/settings`
- `PATCH /api/settings`

- `GET /api/history?limit=50`
- `POST /api/analytics`

- `POST /api/agent-runs` (run scheduler flow)
- `POST /api/agent-runs/:id/confirm` (confirm pending run)

## 6) Agent Runner

For now, `agentRunner.service.ts` is deterministic:
- Summaries work immediately.
- Create/modify require explicit `changes` with ISO times.
- Cancel/high-stakes actions return `needsConfirmation=true`.

When you’re ready, replace `planAndMaybeExecute()` with a real model call,
but keep the same output JSON contract so your app stays stable.
