import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing — DB calls will fail."
    );
  }
}

export const supabase = url && anonKey ? createClient(url, anonKey, {
  auth: { persistSession: false },
}) : null;

export const supabaseAdmin = url && serviceRoleKey ? createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
}) : null;

export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}
