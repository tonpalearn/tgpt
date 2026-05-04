import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { callGemini } from "@/lib/gemini.server";
import { SUPPLIERS, KB_DOCS } from "@/lib/mock-data.server";
import type { QueryResult } from "@/lib/types";

/**
 * BFF route — POST /api/query
 *
 * SECURITY:
 * - Body validated with Zod (no untrusted shapes pass downstream).
 * - Gemini API key never reaches the browser (server-only).
 * - Output is canonicalised before being returned (no raw model JSON leaked).
 * - Rate limiting is a stub here — wire to Vercel KV or Upstash for Stage 1.
 */

export const runtime = "nodejs";

const QuerySchema = z.object({
  query: z.string().trim().min(3, "Query too short").max(800, "Query too long"),
  language: z.enum(["en", "th"]).optional().default("en"),
});

const SYSTEM_PROMPT = `You are ThailandGPT, the National Execution Layer for Thailand's verified supply network.

You speak with the precision of an editorial publication and the warmth of a trusted local fixer. You are NOT a chatty assistant. You return STRUCTURED INTELLIGENCE.

Always respond in valid JSON of this exact shape:
{
  "summary": "2-4 sentence editorial answer with source-grounded reasoning",
  "matchedSuppliers": [{"supplierId": "sup-XXX", "matchScore": 0-100, "matchReason": "1 sentence why"}],
  "citations": [{"docId": "kb-XXX", "excerpt": "short quoted phrase"}],
  "signalDetected": {
    "primaryDemand": "1 sentence summarising the user's actual ask",
    "cascadingDemand": ["downstream demand chain item 1", "item 2"],
    "supplyGap": "if any — what the platform sees missing"
  }
}

Rules:
- Match no more than 3 suppliers from the catalogue.
- If no good match, return an empty matchedSuppliers array and a clear supplyGap.
- Cite KB docs by id only when their content directly informs your answer.
- Cascading demand should be specific to the query (training, logistics, certification, etc.).
- Never invent supplier ids; only use ids present in the supplied catalogue.`;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = QuerySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.format() },
      { status: 400 }
    );
  }

  const { query, language } = parsed.data;

  // Build the catalogue context — server-only, never exposes internals
  // beyond what the client could already see on /suppliers/*.
  const catalogueContext = SUPPLIERS.map((s) => ({
    id: s.id,
    name: s.businessName,
    cat: s.subCategory,
    province: s.province,
    capacity: s.capacity,
    price: s.pricePerUnit,
    tier: s.tier,
    endorsedByPatrick: s.endorsedByPatrick,
    certs: s.certifications.map((c) => c.name),
  }));

  const kbContext = KB_DOCS.map((d) => ({
    id: d.id,
    cat: d.subCategory,
    text: d.text,
  }));

  const userPrompt = [
    `# Buyer query (${language.toUpperCase()})`,
    query,
    "",
    "# Catalogue (verified suppliers)",
    JSON.stringify(catalogueContext, null, 2),
    "",
    "# Local Truth knowledge base (snippets)",
    JSON.stringify(kbContext, null, 2),
    "",
    "Respond with the JSON shape only.",
  ].join("\n");

  let raw: { text: string; latencyMs: number; isMock: boolean };
  try {
    raw = await callGemini({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
      jsonMode: true,
      maxOutputTokens: 1024,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/query] gemini call failed:", msg);
    return NextResponse.json(
      { error: "AI service temporarily unavailable", isMock: false },
      { status: 502 }
    );
  }

  // Parse model output — defensively
  let parsedOutput: Partial<QueryResult> = {};
  try {
    parsedOutput = raw.isMock
      ? buildMockResult(query)
      : (JSON.parse(raw.text) as Partial<QueryResult>);
  } catch {
    // Model returned non-JSON — fall back to a soft-structured result
    parsedOutput = {
      summary: raw.text.slice(0, 800),
      matchedSuppliers: [],
      citations: [],
      signalDetected: {
        primaryDemand: query,
      },
    };
  }

  // Sanitise supplier ids — discard hallucinated ones
  const validIds = new Set(SUPPLIERS.map((s) => s.id));
  const matchedSuppliers = (parsedOutput.matchedSuppliers ?? []).filter((m) =>
    validIds.has(m.supplierId)
  );

  const result: QueryResult = {
    summary: parsedOutput.summary ?? "Unable to compose a summary.",
    matchedSuppliers,
    citations: parsedOutput.citations ?? [],
    signalDetected: parsedOutput.signalDetected ?? { primaryDemand: query },
    meta: {
      latencyMs: raw.latencyMs,
      model: raw.isMock ? "mock-canned" : "gemini-1.5-flash",
      isMock: raw.isMock,
    },
  };

  return NextResponse.json(result, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function buildMockResult(query: string): Partial<QueryResult> {
  // Heuristic mock so the demo flows even without a Gemini key.
  const q = query.toLowerCase();
  const matchedSuppliers: QueryResult["matchedSuppliers"] = [];
  if (q.includes("durian") || q.includes("ทุเรียน") || q.includes("monthong")) {
    matchedSuppliers.push({
      supplierId: "sup-001",
      matchScore: 96,
      matchReason: "Premium Monthong, GAP+GlobalG.A.P. certified, 200t/mo capacity, Patrick-endorsed.",
    });
  }
  if (q.includes("rice") || q.includes("hom mali") || q.includes("ข้าว")) {
    matchedSuppliers.push({
      supplierId: "sup-002",
      matchScore: 94,
      matchReason: "GI Surin Hom Mali cooperative, USDA Organic + Halal, 1,200t / quarter.",
    });
  }
  if (q.includes("tea") || q.includes("ชา") || q.includes("oolong")) {
    matchedSuppliers.push({
      supplierId: "sup-003",
      matchScore: 91,
      matchReason: "Single-origin Doi Mae Salong oolong, JAS Organic, hospitality-grade.",
    });
  }
  if (q.includes("silk") || q.includes("ไหม") || q.includes("interior")) {
    matchedSuppliers.push({
      supplierId: "sup-005",
      matchScore: 93,
      matchReason: "Royal Project–affiliated handwoven silk, OTOP 5-star, luxury hospitality grade.",
    });
  }
  if (q.includes("coconut") || q.includes("มะพร้าว")) {
    matchedSuppliers.push({
      supplierId: "sup-006",
      matchScore: 89,
      matchReason: "Vertically integrated coconut estate, BRCGS AA, US FDA registered.",
    });
  }
  if (q.includes("salt") || q.includes("เกลือ") || q.includes("fleur")) {
    matchedSuppliers.push({
      supplierId: "sup-004",
      matchScore: 88,
      matchReason: "Andaman solar-evaporated fleur de sel, EU food contact certified.",
    });
  }

  return {
    summary: matchedSuppliers.length
      ? `Three matches surfaced from the verified catalogue. Patrick-endorsed lots are flagged. Pricing reflects FOB Laem Chabang where applicable. (Mock answer — set GEMINI_API_KEY for live AI.)`
      : `No tier-Elite supplier in the mock catalogue matches this enquiry directly. The platform records this as a supply gap for the strategic intelligence layer. (Mock answer — set GEMINI_API_KEY for live AI.)`,
    matchedSuppliers: matchedSuppliers.slice(0, 3),
    citations: matchedSuppliers.length
      ? [{ docId: "kb-001", excerpt: "Cold-chain capacity in Chanthaburi runs at 84% peak utilisation Apr–Aug." }]
      : [],
    signalDetected: {
      primaryDemand: query,
      cascadingDemand: matchedSuppliers.length
        ? ["Cold-chain forwarder for GCC corridor", "English-speaking export coordinator"]
        : ["No cascading inferred — too little signal"],
      supplyGap: matchedSuppliers.length ? undefined : `No verified supplier matches "${query}" in this catalogue.`,
    },
  };
}
