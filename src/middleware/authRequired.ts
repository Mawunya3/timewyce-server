import type { Request, Response, NextFunction } from "express";
import { verifyBearerToken } from "../auth/supabaseAuth";

function extractBearerToken(req: Request) {
  const header = req.headers.authorization ?? "";
  const m = header.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

export async function authRequired(req: Request, res: Response, next: NextFunction) {
  try {
    const token = extractBearerToken(req);
    if (!token) return res.status(401).json({ ok: false, error: "Missing Bearer token" });

    const verified = await verifyBearerToken(token);

    req.accessToken = token;
    req.user = {
      id: verified.id,
      email: verified.email ?? null,
      role: verified.role ?? null,
    };

    return next();
  } catch (err: any) {
    return res.status(401).json({ ok: false, error: "Unauthorized", detail: err?.message ?? String(err) });
  }
}

