import { Request, Response, NextFunction } from "express";

/**
 * Optional guard middleware:
 * If an endpoint performs a cancel or high-impact modify, require a confirmation token header.
 * You can wire this into /events/:id/cancel or agent-run confirm endpoints.
 */
export function requireConfirmation(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-confirmation-token"];
  if (!token || typeof token !== "string") {
    return res.status(409).json({
      message: "Confirmation required",
      needsConfirmation: true,
      hint: "Provide x-confirmation-token header from /agent-runs/:id/confirm flow (if enabled).",
    });
  }
  next();
}
