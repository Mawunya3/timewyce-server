import { Router } from "express";
import * as History from "../controllers/history.controller";
import { validateQuery } from "../middleware/validate";
import { ListHistoryQuery } from "../schemas/history.schema";

export const historyRouter = Router();
historyRouter.get("/", validateQuery(ListHistoryQuery), History.list);
