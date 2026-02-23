import dotenv from "dotenv";
dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const rawPrefix = process.env.API_PREFIX ?? "/api";
const apiPrefix = rawPrefix.startsWith("/") ? rawPrefix : `/${rawPrefix}`;

export const env = {
  nodeEnv: process.env.NODE_ENV,
  PORT: Number(process.env.PORT ?? 36363),
  apiPrefix, // ✅ use the normalized value

  supUrl: process.env.SUPABASE_URL,
  supAnon: process.env.SUPABASE_ANON_KEY,
  supServ: process.env.SUPABASE_SERVICE_ROLE_KEY,
  supJwks: process.env.SUPABASE_JWKS_URL,

  dbUrl: process.env.DATABASE_URL,
  directUrl: process.env.DATABASE_DIRECT_URL,

  jwtIssuer: process.env.JWT_ISSUER,
  jwtAudience: process.env.JWT_AUDIENCE,

  googleRedirect: process.env.GOOGLE_REDIRECT_URI,

} as const;

export function assertEnv() {
  // Minimal set for runtime. Prisma + Supabase auth depends on your deployment flow.
  console.log("NODE_ENV", env.supUrl, env.supAnon, env.supServ, env.supJwks);

  if (!env.dbUrl) required("DATABASE_URL");
}