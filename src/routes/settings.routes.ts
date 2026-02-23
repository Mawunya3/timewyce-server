import { Router } from "express";
import * as Settings from "../controllers/settings.controler";
import { validateBody } from "../middleware/validate";
import { UpdateSettingsBody } from "../schemas/settings.schema";

export const settingsRouter = Router();
settingsRouter.get("/", Settings.get);
settingsRouter.patch("/", validateBody(UpdateSettingsBody), Settings.update);
