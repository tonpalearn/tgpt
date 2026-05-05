import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/client";
import { embedText } from "@/lib/gemini.server";
import { BOI_KNOWLEDGE } from "@/lib/boi-knowledge";

// Simple bearer token guard — set ADMIN_SECRET in env to protect this route
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true; // no secret set → open (dev only)
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${secret}`;
}

type IngestResult = {
  id: string;
  status: "embedded" | "skipped_no_key" | "error";
  similarity?: number;
};

/**
 * POST /api/admin/boi-ingest
 * Seeds BOI_KNOWLEDGE documents into Supabase boi_documents with real embeddings.
 * Upserts — safe to re-run for refreshes.
 *
 * Optional body: { ids: string[] } to re-embed specific documents only.
 *
 * Authorization: Bearer <ADMIN_SECRET>
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  let filterIds: string[] | null = null;
  try {
    const body = await req.json().catch(() => ({}));
    if (body.ids && Array.isArray(body.ids)) filterIds = body.ids as string[];
  } catch { /* ignore */ }

  const docs = filterIds
    ? BOI_KNOWLEDGE.filter((_, i) => filterIds!.includes(`boi-${i}`))
    : BOI_KNOWLEDGE;

  const results: IngestResult[] = [];
  const start = Date.now();

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const docId = `boi-${BOI_KNOWLEDGE.indexOf(doc)}`;

    // Text to embed: title + snippet + relevant_for tags
    const textToEmbed = `${doc.title}. ${doc.snippet} Keywords: ${doc.relevant_for.join(", ")}`;

    const embedding = await embedText(textToEmbed);

    if (!embedding) {
      results.push({ id: docId, status: "skipped_no_key" });
      continue;
    }

    const { error } = await supabase.from("boi_documents").upsert({
      id: docId,
      source: doc.source,
      title: doc.title,
      snippet: doc.snippet,
      url: doc.url,
      hs_code: doc.hs_code ?? null,
      year: doc.year ?? null,
      relevant_for: doc.relevant_for,
      embedding,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      results.push({ id: docId, status: "error" });
      console.error(`[boi-ingest] Failed to upsert ${docId}:`, error.message);
    } else {
      results.push({ id: docId, status: "embedded" });
    }

    // Small delay to avoid rate-limiting on embedding API
    if (i < docs.length - 1) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  const summary = {
    total: results.length,
    embedded: results.filter(r => r.status === "embedded").length,
    skipped: results.filter(r => r.status === "skipped_no_key").length,
    errors: results.filter(r => r.status === "error").length,
    elapsedMs: Date.now() - start,
  };

  return NextResponse.json({ summary, results });
}

/**
 * GET /api/admin/boi-ingest
 * Returns current count of embedded documents in Supabase.
 */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabase) {
    return NextResponse.json({
      configured: false,
      message: "Supabase not configured",
      knowledgeBaseSize: BOI_KNOWLEDGE.length,
    });
  }

  const { count, error } = await supabase
    .from("boi_documents")
    .select("id", { count: "exact", head: true });

  return NextResponse.json({
    configured: true,
    embeddedCount: error ? null : count,
    knowledgeBaseSize: BOI_KNOWLEDGE.length,
    pendingEmbedding: error ? null : BOI_KNOWLEDGE.length - (count ?? 0),
    error: error?.message ?? null,
  });
}
