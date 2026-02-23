import { Router } from "express";
import { authRouter } from "./auth.routes";
import { eventsRouter } from "./events.routes";
import { settingsRouter } from "./settings.routes";
import { historyRouter } from "./history.routes";
import { analyticsRouter } from "./analytics.routes";
import { authRequired } from "../middleware/authRequired";
import { agentsRouter } from "./agents.routes";
import { agentRouter } from "./agent.routes";
import { agentRunsRouter } from "./agentRuns.routes";
import { appleCalendarRouter } from "./apple.calendar.routes";
import { googleCalendarRouter } from "./google.calendar.routes";
import { meRouter } from "./profile.routes";

export function registerRoutes(api: Router) {
  api.use("/auth", authRouter);
  api.use("/events", authRequired, eventsRouter);
  api.use("/settings", authRequired, settingsRouter);
  api.use("/history", authRequired, historyRouter);
  api.use("/analytics", authRequired, analyticsRouter);
  api.use("/agents", authRequired, agentsRouter);
  api.use("/agent", authRequired, agentRouter);
  api.use("/me", authRequired, meRouter);
  api.use("/agent-runs", authRequired, agentRunsRouter);
  api.use("/apple-calendar", authRequired, appleCalendarRouter);
  api.use("/google-calendar", authRequired, googleCalendarRouter);
}
