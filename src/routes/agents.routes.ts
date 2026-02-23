import { Router } from "express";
import * as Agents from "../controllers/agents.controller";
import { validateBody } from "../middleware/validate";
import { UpsertAgentBody } from "../schemas/agents.schema";

export const agentsRouter = Router();

agentsRouter.get("/", Agents.list);
agentsRouter.post("/", validateBody(UpsertAgentBody), Agents.upsert);
agentsRouter.post("/seed/jewel-scheduler", Agents.seedJewelScheduler);
