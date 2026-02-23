import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env, assertEnv } from "./utils/env";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/errorHandler";
import { registerRoutes } from "./routes/routes";

export function createServer() {
  assertEnv();

  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));



  const api = express.Router();
  // All API routes require auth by default.
  registerRoutes(api);

  app.use(env.apiPrefix!, api);
  app.use(errorHandler);
  console.log("MOUNTING:", env.apiPrefix); 

  logger.info({ prefix: env.apiPrefix }, "Server ready");
  return app;
}
