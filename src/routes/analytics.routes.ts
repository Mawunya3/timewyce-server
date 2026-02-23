import { Router } from "express";
import * as Analytics from "../controllers/analytics.controller";
import { validateBody } from "../middleware/validate";
import { TrackAnalyticsBody } from "../schemas/analytics.schema";

export const analyticsRouter = Router();
analyticsRouter.post("/", validateBody(TrackAnalyticsBody), Analytics.track);
