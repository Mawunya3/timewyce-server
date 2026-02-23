import { Request, Response } from "express";
import { env } from "../utils/env";
import { supabase } from "../db/supabase";



export async function healthAuth(_req: Request, res: Response) {
  res.json({
    ok: true,
    message: "Auth routes ready (Supabase handles login client-side).",
    status: "healthy",
    service: "jewel-scheduler-backend",
    timeISO: new Date().toISOString(),
  });
}

export async function googleUrl(req: Request, res: Response) {
  try {
    // optional: pass through a deep link for the app to return to
    // e.g. myapp://auth-callback
    const appRedirect = typeof req.query.app_redirect === "string" ? req.query.app_redirect : undefined;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: env.googleRedirect,
        // state is returned back to your callback; useful to carry app deep link safely
        ...(appRedirect ? { queryParams: { state: encodeURIComponent(appRedirect) } } : {}),
      },
    });

    if (error) return res.status(400).json({ ok: false, error: error.message });
    return res.json({ ok: true, url: data.url });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Server error" });
  }
}

export async function googleCallback(req: Request, res: Response) {
  try {
    const code = typeof req.query.code === "string" ? req.query.code : undefined;
    if (!code) return res.status(400).send("Missing code");

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return res.status(400).send(error.message);

    // If you passed app deep-link in state, redirect back to it with tokens.
    // NOTE: putting access tokens in URL has security tradeoffs. Prefer returning
    // only a short-lived "exchange token" you store server-side if you want more safety.
    const appRedirectRaw = typeof req.query.state === "string" ? decodeURIComponent(req.query.state) : undefined;

    if (appRedirectRaw) {
      const u = new URL(appRedirectRaw);
      u.searchParams.set("access_token", data.session?.access_token ?? "");
      u.searchParams.set("refresh_token", data.session?.refresh_token ?? "");
      u.searchParams.set("expires_in", String(data.session?.expires_in ?? ""));
      return res.redirect(u.toString());
    }

       return res.json({
      ok: true,
      user: data.user,
      session: data.session,
    });
  } catch (e: any) {
    return res.status(500).send(e?.message ?? "Server error");
  }
}

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, phone, metadata } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "email and password are required" });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      phone,
      options: metadata ? { data: metadata } : undefined,
    });

    if (error) return res.status(400).json({ ok: false, error: error.message });

    return res.json({
      ok: true,
      user: data.user,
      session: data.session, // may be null if email confirmation is required
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Server error" });
  }
}

export async function signin(req: Request, res: Response) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: "email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ ok: false, error: error.message });

    return res.json({
      ok: true,
      user: data.user,
      session: data.session,
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Server error" });
  }
}

export async function signout(req: Request, res: Response) {
  try {
    // This signs out the "server-side" client (stateless-ish here).
    // In practice: mobile clients usually just discard the token.
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ ok: false, error: error.message });

    return res.json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Server error" });
  }
}
