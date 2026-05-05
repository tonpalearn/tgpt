import "server-only";
import { supabase } from "./db/client";
import { embedText } from "./gemini.server";
import { findCitations, type Citation } from "./boi-knowledge";

type VectorCitation = Citation & { similarity?: number };

/**
 * Find relevant BOI citations using vector similarity search.
 * Falls back to keyword matching if:
 *  - Supabase not configured
 *  - No Gemini API key (can't embed query)
 *  - boi_documents table is empty
 *  - Any error occurs
 */
export async function findCitationsVector(
  query: string,
  maxResults = 3
): Promise<VectorCitation[]> {
  if (!supabase) return findCitations(query, maxResults);

  try {
    const embedding = await embedText(query);
    if (!embedding) return findCitations(query, maxResults);

    const { data, error } = await supabase.rpc("match_boi_documents", {
      query_embedding: embedding,
      match_threshold: 0.4,
      match_count: maxResults,
    });

    if (error || !data || data.length === 0) {
      return findCitations(query, maxResults);
    }

    return data.map((row: {
      id: string; source: string; title: string; snippet: string;
      url: string; hs_code?: string; year?: number;
      relevant_for: string[]; similarity: number;
    }) => ({
      source: row.source as Citation["source"],
      title: row.title,
      snippet: row.snippet,
      url: row.url,
      hs_code: row.hs_code,
      year: row.year,
      relevant_for: row.relevant_for ?? [],
      similarity: row.similarity,
    }));
  } catch {
    return findCitations(query, maxResults);
  }
}

/**
 * Find relevant suppliers using vector similarity search.
 * Returns array of { supplier_id, similarity } pairs, sorted by similarity desc.
 * Falls back to empty array (caller should use keyword/score-based matching).
 */
export async function findSuppliersVector(
  query: string,
  maxResults = 5
): Promise<{ supplier_id: string; similarity: number }[]> {
  if (!supabase) return [];

  try {
    const embedding = await embedText(query);
    if (!embedding) return [];

    const { data, error } = await supabase.rpc("match_suppliers", {
      query_embedding: embedding,
      match_threshold: 0.3,
      match_count: maxResults,
    });

    if (error || !data) return [];
    return data as { supplier_id: string; similarity: number }[];
  } catch {
    return [];
  }
}
