import { Router } from "express";
import * as AgentRuns from "../controllers/agentRuns.controller";
import { validateBody } from "../middleware/validate";
import { AgentRunInputSchema } from "../schemas/agent.schema";
import { ConfirmAgentRunBody } from "../schemas/agentRuns.schema";

export const agentRunsRouter = Router();

agentRunsRouter.post("/", validateBody(AgentRunInputSchema), AgentRuns.run);
agentRunsRouter.get("/:id", AgentRuns.get);
agentRunsRouter.post("/:id/confirm", validateBody(ConfirmAgentRunBody), AgentRuns.confirm);
