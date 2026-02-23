import { Router } from "express";
import * as Google from "../controllers/google.calendar.controller";

export const googleCalendarRouter = Router();

googleCalendarRouter.get("/status", Google.status);
googleCalendarRouter.post("/connect/url", Google.connectUrl);
googleCalendarRouter.post("/sync", Google.sync);
googleCalendarRouter.get("/events", Google.listEvents);