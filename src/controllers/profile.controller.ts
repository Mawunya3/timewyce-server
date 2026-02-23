import { Request, Response } from "express";


// fetch profile
export async function profile(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ ok: false, error: "Unauthorized" });
    return res.json({ ok: true, user: req.user });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Server error" });
  }
}

// edit profile
export async function editProfile(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ ok: false, error: "Unauthorized" });
    return res.json({ ok: true, user: req.user });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Server error" });
  }
}