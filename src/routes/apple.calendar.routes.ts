import { Router } from "express";
import * as Apple from "../controllers/apple.calendar.controller";

export const appleCalendarRouter = Router();
appleCalendarRouter.get("/status", Apple.status);
