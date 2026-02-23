# Timewyce Server
# (Node.js + Express + Supabase + Prisma)

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

  `# ─── Server ────────────────────────────────────────────────────────────────────`
- `PORT` -> `36363`
- `NODE_ENV` -> `development`
- `LOG_LEVEL` ->`debug`

  `# ─── Database (Prisma + Supabase PostgreSQL) ───────────────────────────────────`
  `# Get from: Supabase > Project Settings > Database > Connection string (URI)`
- `DATABASE_URL` ->  -> your Supabase Postgres connection string
- `DATABASE_DIRECT_URL` -> direct url

  `# ─── Supabase ──────────────────────────────────────────────────────────────────`
  `# Get from: Supabase > Project Settings > API`
- `SUPABASE_URL` -> `https://<superbase_id>.supabase.co`
- `SUPABASE_ANON_KEY` -> supabase annon key
- `SUPABASE_SERVICE_ROLE_KEY` -> Supabase service role key

- `SUPABASE_JWKS_URL` -> `https://<superbase_id>.supabase.co/auth/v1/.well-known/jwks.json`

  `# ─── Anthropic Claude ──────────────────────────────────────────────────────────`
- `# Get from: https://console.anthropic.com`
- `ANTHROPIC_API_KEY` -> `sk-...`

  `# ─── Confirmation Token ────────────────────────────────────────────────────────`
- `CONFIRMATION_TOKEN_SECRET` -> Confirmation token
- `CONFIRMATION_TOKEN_TTL_MINUTES` -> `30`

  `# ─── JWT (legacy JS layer) ─────────────────────────────────────────────────────`
- `JWT_SECRET` -> Jwt token here
- `JWT_EXPIRES_IN` -> `7d`
- `REFRESH_TOKEN_SECRET` -> Refresh token
- `REFRESH_TOKEN_EXPIRES_IN`-> `30d`

  `# ─── Rate Limiting ────────────────────────────────────────────────────────────`
- `RATE_LIMIT_WINDOW_MS` -> `60000`
- `RATE_LIMIT_MAX` -> `60`

   `# ─── Google Calendar  and auth ────────────────────────────────────`
- `GOOGLE_CLIENT_ID`  -> Google client id
- `GOOGLE_CLIENT_SECRET` -> Google client secret
- `GOOGLE_REDIRECT_URI` -> `<API_here>/google/callback`

   `# ─── JWT ──────────────────────────────────────────────────────────────────────────`
- `JWT_AUDIENCE` -> Audience here
- `JWT_ISSUER` -> `https://<project-ref>.supabase.co/auth/v1/`
- `
- `API_PREFIX` -> `api`

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
