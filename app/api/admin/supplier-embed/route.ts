import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db/client";
import { embedText } from "@/lib/gemini.server";
import { listSuppliers } from "@/lib/db/queries";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

/**
 * POST /api/admin/supplier-embed
 * Generates and stores embeddings for all supplier descriptions in Supabase.
 * Must run after pgvector migration (0002) is applied.
 *
 * Embeds: name + category + region + description + certifications + tags
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }

  const suppliers = await listSuppliers();
  const results: { id: string; status: "embedded" | "skipped" | "error" }[] = [];
  const start = Date.now();

  for (const s of suppliers) {
    const textToEmbed = [
      s.name,
      s.name_th ?? "",
      s.category,
      s.region,
      s.description ?? "",
      s.description_th ?? "",
      ...(s.certifications ?? []),
      ...(s.tags ?? []),
    ].filter(Boolean).join(" | ");

    const embedding = await embedText(textToEmbed);

    if (!embedding) {
      results.push({ id: s.id, status: "skipped" });
      continue;
    }

    const { error } = await supabase.from("supplier_embeddings").upsert({
      supplier_id: s.id,
      embedding,
      embedded_text: textToEmbed.slice(0, 500),
      updated_at: new Date().toISOString(),
    });

    results.push({ id: s.id, status: error ? "error" : "embedded" });
    if (error) console.error(`[supplier-embed] ${s.id}:`, error.message);

    await new Promise(r => setTimeout(r, 100));
  }

  return NextResponse.json({
    summary: {
      total: results.length,
      embedded: results.filter(r => r.status === "embedded").length,
      skipped: results.filter(r => r.status === "skipped").length,
      errors: results.filter(r => r.status === "error").length,
      elapsedMs: Date.now() - start,
    },
    results,
  });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabase) {
    return NextResponse.json({ configured: false });
  }

  const { count: supplierCount } = await supabase
    .from("suppliers").select("id", { count: "exact", head: true });
  const { count: embeddedCount } = await supabase
    .from("supplier_embeddings").select("supplier_id", { count: "exact", head: true });

  return NextResponse.json({
    configured: true,
    totalSuppliers: supplierCount,
    embeddedSuppliers: embeddedCount,
    coverage: supplierCount ? `${Math.round(((embeddedCount ?? 0) / supplierCount) * 100)}%` : "0%",
  });
}
