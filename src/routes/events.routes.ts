import { Router } from "express";
import * as Events from "../controllers/events.controller";
import { validateBody, validateQuery } from "../middleware/validate";
import { ListEventsQuery, CreateEventBody, UpdateEventBody, CancelEventBody } from "../schemas/events.schema";

export const eventsRouter = Router();

eventsRouter.get("/", validateQuery(ListEventsQuery), Events.list);
eventsRouter.get("/:id", Events.get);
eventsRouter.post("/", validateBody(CreateEventBody), Events.create);
eventsRouter.patch("/:id", validateBody(UpdateEventBody), Events.update);
eventsRouter.post("/:id/cancel", validateBody(CancelEventBody), Events.cancel);
