import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../utils/env";

/**
 * Verify Supabase JWT (or any compatible OIDC JWT) using JWKS URL.
 * This keeps your API stateless and avoids storing secrets in app config.
 */
const jwksUrl = env.supJwks ? new URL(env.supJwks) : null;
const jwks = jwksUrl ? createRemoteJWKSet(jwksUrl) : null;

export type VerifiedUser = {
  id: string;
  email?: string;
  role?: string;
  raw: Record<string, unknown>;
};

export async function verifyBearerToken(token: string): Promise<VerifiedUser> {
  if (!jwks) {
    throw new Error("SUPABASE_JWKS_URL not configured. Provide it to verify JWTs.");
  }

  const { payload } = await jwtVerify(token, jwks, {
    audience: env.jwtAudience || undefined,
    issuer: env.jwtIssuer || undefined,
  });

  // Supabase uses 'sub' as user id
  const id = String(payload.sub ?? "");
  if (!id) throw new Error("Invalid token: missing sub");

  return {
    id,
    email: typeof payload.email === "string" ? payload.email : undefined,
    role: typeof payload.role === "string" ? payload.role : undefined,
    raw: payload as unknown as Record<string, unknown>,
  };
}
