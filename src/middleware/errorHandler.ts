import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { formatZodError } from "../zod/formatZodError";
import { logger } from "../utils/logger";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json(formatZodError(err));
  }

  const status = Number(err?.status) || 500;
  const message = err?.message ?? "Server error";

  if (status >= 500) logger.error({ err }, "Unhandled error");
  res.status(status).json({ message });
}
