import { Router } from "express";
import * as Agent from "../controllers/agent.controller";

export const agentRouter = Router();
agentRouter.get("/", Agent.info);
