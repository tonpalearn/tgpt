import "server-only";

/**
 * Server-only environment validation.
 *
 * SECURITY:
 * - Importing this file from a Client Component throws at build time (`server-only`).
 * - Only NEXT_PUBLIC_* vars are sent to the browser. Everything below is server-only.
 * - Never log full secret values. Only existence/length checks.
 */

interface ServerEnv {
  GEMINI_API_KEY?: string;
  // Future: SUPABASE_SERVICE_ROLE_KEY, etc.
  NODE_ENV: "development" | "production" | "test";
  IS_DEMO: boolean;
}

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const env = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NODE_ENV: (process.env.NODE_ENV as ServerEnv["NODE_ENV"]) ?? "development",
    IS_DEMO: process.env.NEXT_PUBLIC_IS_DEMO !== "false",
  };

  // Soft-validate: missing GEMINI_API_KEY is OK in mock mode but warn once.
  if (!env.GEMINI_API_KEY && env.NODE_ENV !== "production") {
    // Use a single line to avoid noisy logs
    console.warn(
      "[env] GEMINI_API_KEY not set — /api/query will return canned mock responses"
    );
  }

  cached = env;
  return env;
}

export function hasGeminiKey(): boolean {
  return Boolean(getServerEnv().GEMINI_API_KEY?.trim());
}
