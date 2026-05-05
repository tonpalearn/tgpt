import "server-only";
import { supabase, isSupabaseConfigured } from "./client";
import type { Supplier, Buyer, Demand, Deal, DealEvent } from "./types";

class NotConfigured extends Error {
  constructor() {
    super("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  }
}

function client() {
  if (!supabase) throw new NotConfigured();
  return supabase;
}

export async function listSuppliers(): Promise<Supplier[]> {
  const { data, error } = await client()
    .from("suppliers")
    .select("*")
    .order("performance_score", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getSupplier(id: string): Promise<Supplier | null> {
  const { data, error } = await client().from("suppliers").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listBuyers(): Promise<Buyer[]> {
  const { data, error } = await client()
    .from("buyers")
    .select("*")
    .order("performance_score", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getBuyer(id: string): Promise<Buyer | null> {
  const { data, error } = await client().from("buyers").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listDemands(opts?: { status?: string }): Promise<Demand[]> {
  let q = client().from("demands").select("*").order("created_at", { ascending: false });
  if (opts?.status) q = q.eq("status", opts.status);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function listDeals(opts?: { status?: string }): Promise<Deal[]> {
  let q = client().from("deals").select("*").order("opened_at", { ascending: false });
  if (opts?.status) q = q.eq("status", opts.status);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getDeal(id: string): Promise<Deal | null> {
  const { data, error } = await client().from("deals").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function getDealEvents(dealId: string): Promise<DealEvent[]> {
  const { data, error } = await client()
    .from("deal_events")
    .select("*")
    .eq("deal_id", dealId)
    .order("occurred_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ─── Search query logging (best-effort, never throws) ────────────────────
export type SearchLogInput = {
  query_text: string;
  side?: "demand" | "supply";
  parsed_category?: string | null;
  parsed_product?: string;
  parsed_destination?: string;
  parsed_quantity?: string;
  language?: string;
  matched_count: number;
  top_confidence?: number | null;
  no_match: boolean;
  meta?: Record<string, unknown>;
};

export async function logSearch(input: SearchLogInput): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("search_queries").insert({
      query_text: input.query_text,
      side: input.side ?? "demand",
      parsed_category: input.parsed_category ?? null,
      parsed_product: input.parsed_product ?? null,
      parsed_destination: input.parsed_destination ?? null,
      parsed_quantity: input.parsed_quantity ?? null,
      language: input.language ?? null,
      matched_count: input.matched_count,
      top_confidence: input.top_confidence ?? null,
      no_match: input.no_match,
      meta: input.meta ?? {},
    });
  } catch {
    // silent — table may not exist yet, never break user request
  }
}

export type AcquisitionTarget = {
  parsed_category: string | null;
  parsed_product: string | null;
  parsed_destination: string | null;
  search_count: number;
  no_match_count: number;
  avg_top_confidence: number | null;
  last_searched: string;
  sample_queries: string[];
};

export async function getAcquisitionTargets(limit = 20): Promise<AcquisitionTarget[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("acquisition_targets")
      .select("*")
      .limit(limit);
    if (error) return [];
    return (data as AcquisitionTarget[]) ?? [];
  } catch {
    return [];
  }
}

export { isSupabaseConfigured };
