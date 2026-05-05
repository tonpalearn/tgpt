import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini.server";
import { listSuppliers } from "@/lib/db/queries";
import { findCitations } from "@/lib/boi-knowledge";
import { findCitationsVector, findSuppliersVector } from "@/lib/vector-search";
import type { Supplier, SupplierCategory } from "@/lib/db/types";

// ─── Types ───────────────────────────────────────────────────────────
type ParsedQuery = {
  category: SupplierCategory | null;
  product: string;
  quantity?: string;
  region?: string;
  certifications?: string[];
  language: "th" | "en";
};

type MatchedSupplier = {
  id: string;
  name: string;
  tier: string;
  patrick_circle: boolean;
  score: number;
  capacity: string;
  certs: string[];
  matchReason: string;
  confidence: number;
};

type CascadeNode = {
  id: string;
  layer: number;
  label: string;
  detail: string;
  icon: string;
  color: "amber" | "sky" | "emerald" | "rose";
  parent?: string;
};

// ─── Static fallback suppliers if Supabase not configured ─────────────
const FALLBACK_SUPPLIERS: Supplier[] = [
  {
    id: "sup-001",
    name: "สวนทุเรียนคุณวิชัย",
    name_th: "สวนทุเรียนคุณวิชัย",
    category: "agriculture",
    region: "จันทบุรี",
    description: "Premium Monthong durian — 120 tons/yr capacity, 3+ years UAE export experience",
    description_th: null,
    tier: "Elite",
    patrick_circle: true,
    verified: true,
    verified_at: new Date().toISOString(),
    performance_score: 96,
    review_count: 18,
    review_avg: 4.9,
    past_deals_count: 14,
    past_gmv_usd: 1120000,
    certifications: ["GAP", "GlobalG.A.P.", "FDA"],
    tags: ["durian", "monthong", "premium"],
    hero_image_prompt: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "sup-007",
    name: "Premium Orchard Group",
    name_th: "พรีเมี่ยมออร์ชาร์ด",
    category: "agriculture",
    region: "ระยอง",
    description: "Multi-fruit grower — 80 tons/yr, Singapore + HK exports",
    description_th: null,
    tier: "Pro",
    patrick_circle: false,
    verified: true,
    verified_at: new Date().toISOString(),
    performance_score: 82,
    review_count: 11,
    review_avg: 4.7,
    past_deals_count: 8,
    past_gmv_usd: 540000,
    certifications: ["GAP", "FDA"],
    tags: ["fruit", "tropical"],
    hero_image_prompt: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "sup-012",
    name: "Eastern Thai Fruit Co-op",
    name_th: "สหกรณ์ผลไม้ตะวันออก",
    category: "agriculture",
    region: "ตราด",
    description: "Co-operative — 200 tons/yr aggregated capacity, price competitive",
    description_th: null,
    tier: "Trusted",
    patrick_circle: false,
    verified: true,
    verified_at: new Date().toISOString(),
    performance_score: 67,
    review_count: 6,
    review_avg: 4.5,
    past_deals_count: 4,
    past_gmv_usd: 195000,
    certifications: ["GAP"],
    tags: ["fruit", "co-op"],
    hero_image_prompt: null,
    created_at: new Date().toISOString(),
  },
];

// ─── Parse query with Gemini (or heuristic fallback) ──────────────────
async function parseQuery(query: string): Promise<{ parsed: ParsedQuery; latencyMs: number; isMock: boolean }> {
  const systemPrompt = `You are a query parser for a Thai supply marketplace. Extract structured data from user query.
Return ONLY valid JSON matching this TypeScript type:
{
  "category": "agriculture" | "craft" | "manufacturing" | "seafood" | "textile" | "beverage" | "wellness" | null,
  "product": string,
  "quantity": string,
  "region": string,
  "certifications": string[],
  "language": "th" | "en"
}
Be precise. Use Thai supply category taxonomy. If unsure of category, use null.`;

  try {
    const result = await callGemini({
      systemPrompt,
      userPrompt: query,
      jsonMode: true,
      maxOutputTokens: 400,
    });
    const parsed = JSON.parse(result.text) as ParsedQuery;
    return { parsed, latencyMs: result.latencyMs, isMock: result.isMock };
  } catch {
    // Heuristic fallback
    const q = query.toLowerCase();
    const parsed: ParsedQuery = {
      category: q.includes("durian") || q.includes("rice") || q.includes("ทุเรียน") || q.includes("ข้าว") ? "agriculture"
              : q.includes("shrimp") || q.includes("กุ้ง") ? "seafood"
              : q.includes("silk") || q.includes("ไหม") ? "textile"
              : q.includes("tea") || q.includes("coffee") || q.includes("ชา") || q.includes("กาแฟ") ? "beverage"
              : q.includes("herbal") || q.includes("wellness") || q.includes("สมุนไพร") ? "wellness"
              : "agriculture",
      product: query.slice(0, 100),
      language: /[ก-๙]/.test(query) ? "th" : "en",
    };
    return { parsed, latencyMs: 0, isMock: true };
  }
}

// ─── Score suppliers against parsed query ─────────────────────────────
function scoreSuppliers(suppliers: Supplier[], parsed: ParsedQuery, query: string): MatchedSupplier[] {
  const q = query.toLowerCase();
  const scored = suppliers
    .filter(s => parsed.category === null || s.category === parsed.category)
    .map(s => {
      // Score components
      let score = s.performance_score; // base 0-100
      if (s.patrick_circle) score += 15;
      // tag match bonus
      const tagMatch = s.tags.some(t => q.includes(t.toLowerCase()));
      if (tagMatch) score += 20;
      // verified bonus
      if (s.verified) score += 5;

      // confidence: normalize to 0-1
      const confidence = Math.min(score / 140, 0.98);

      // generate match reason
      const reasons: string[] = [];
      if (s.patrick_circle) reasons.push("Patrick's Circle verified");
      if (s.past_deals_count >= 10) reasons.push(`${s.past_deals_count} ดีลที่ปิดสำเร็จ`);
      if (tagMatch) reasons.push("ตรงกับสินค้าที่ต้องการ");
      if (s.certifications.length >= 2) reasons.push(`Cert ครบ: ${s.certifications.slice(0,2).join(" + ")}`);
      if (reasons.length === 0) reasons.push(`Performance score ${s.performance_score}`);

      // estimate capacity from past GMV
      const capacityEst = s.past_gmv_usd > 800000 ? "100-150 ตัน/ปี"
                       : s.past_gmv_usd > 400000 ? "60-100 ตัน/ปี"
                       : s.past_gmv_usd > 150000 ? "30-60 ตัน/ปี"
                       : "10-30 ตัน/ปี";

      return {
        id: s.id,
        name: s.name_th || s.name,
        tier: s.patrick_circle ? "Patrick's Circle" : s.tier,
        patrick_circle: s.patrick_circle,
        score,
        capacity: capacityEst,
        certs: s.certifications,
        matchReason: reasons.join(" · "),
        confidence,
      } satisfies MatchedSupplier;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored;
}

// ─── Generate cascading demand using Gemini ───────────────────────────
async function generateCascade(query: string, parsed: ParsedQuery, citations: ReturnType<typeof findCitations>): Promise<{ cascade: CascadeNode[]; reasoning: string; latencyMs: number; isMock: boolean }> {
  const systemPrompt = `You are an expert Thai supply economist. Given a Thai-export demand query, generate:
1. A 2-paragraph reasoning for why the matched suppliers fit (cite the BOI/Customs sources provided)
2. A cascading demand tree (4 layers showing sub-economy that THIS deal triggers)

Respond in JSON:
{
  "reasoning": "2 paragraphs in Thai with citations like [BOI 2024] inline",
  "cascade": [
    {"id":"L1","layer":1,"label":"...","detail":"...","icon":"emoji","color":"amber"},
    {"id":"L2-1","layer":2,"label":"...","detail":"...","icon":"emoji","color":"sky","parent":"L1"},
    ...
  ]
}

Layers:
- Layer 1 (color amber): The primary buyer demand
- Layer 2 (color sky): Direct services needed (logistics, insurance, finance, certification)
- Layer 3 (color emerald): Skills + specialized labor
- Layer 4 (color rose): Education + training that arises

Make 1 node for L1, 2-3 nodes for L2, 2-3 for L3, 1-2 for L4. Be SPECIFIC to the query (location, quantity, market).`;

  const userPrompt = `Query: "${query}"
Parsed: ${JSON.stringify(parsed)}
Citations available: ${citations.map(c => `[${c.source}: ${c.title}]`).join(", ")}`;

  try {
    const result = await callGemini({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      maxOutputTokens: 1500,
    });
    const data = JSON.parse(result.text) as { reasoning: string; cascade: CascadeNode[] };
    return { cascade: data.cascade, reasoning: data.reasoning, latencyMs: result.latencyMs, isMock: result.isMock };
  } catch {
    // Fallback cascade
    const fallback: CascadeNode[] = [
      { id: "L1", layer: 1, label: "Primary Buyer Demand", detail: query.slice(0, 80), icon: "🌍", color: "amber" },
      { id: "L2-1", layer: 2, label: "Logistics + Cold Chain", detail: "Export forwarder, reefer container, customs broker", icon: "📦", color: "sky", parent: "L1" },
      { id: "L2-2", layer: 2, label: "Trade Finance + Insurance", detail: "L/C, marine cargo insurance, FX hedge", icon: "🛡️", color: "sky", parent: "L1" },
      { id: "L3-1", layer: 3, label: "Bilingual Export Coordinator", detail: "TH-EN/AR bilingual coordinator on-site", icon: "👨‍💼", color: "emerald", parent: "L2-1" },
      { id: "L3-2", layer: 3, label: "Quality Inspector", detail: "On-farm/factory quality + cert compliance check", icon: "🔍", color: "emerald", parent: "L2-1" },
      { id: "L4-1", layer: 4, label: "Vocational Training", detail: "Local vocational school capacity building", icon: "🏫", color: "rose", parent: "L3-1" },
    ];
    const reasoning = `Match พบจาก ${citations.length > 0 ? `[${citations[0]?.source} ${citations[0]?.year}]` : "performance score"} — supplier ที่ verified ทั้งหมดมี capacity และ cert ที่ตรงกับ query\n\nDeal นี้ trigger sub-economy ที่ platform monetize เพิ่มได้ใน Layer 2-4 (logistics, training, recurring services)`;
    return { cascade: fallback, reasoning, latencyMs: 0, isMock: true };
  }
}

// ─── POST /api/match ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // Stage 1: Parse with Gemini
    const { parsed, latencyMs: parseLatency, isMock: parseMock } = await parseQuery(query);

    // Stage 2: Get suppliers (Supabase or fallback)
    let suppliers: Supplier[];
    let supplierSource: "supabase" | "static";
    try {
      suppliers = await listSuppliers();
      supplierSource = "supabase";
    } catch {
      suppliers = FALLBACK_SUPPLIERS;
      supplierSource = "static";
    }

    // Stage 3: Score + match suppliers
    const matched = scoreSuppliers(suppliers, parsed, query);

    // Stage 4: Find citations — vector search first, keyword fallback
    const [citations, vectorSupplierHints] = await Promise.all([
      findCitationsVector(query, 3),
      findSuppliersVector(query, 5),
    ]);
    const usingVectorCitations = citations.some(c => "similarity" in c);

    // Boost supplier scores if vector search found semantic matches
    if (vectorSupplierHints.length > 0) {
      const hintMap = new Map(vectorSupplierHints.map(h => [h.supplier_id, h.similarity]));
      matched.forEach(m => {
        const boost = hintMap.get(m.id);
        if (boost !== undefined) {
          m.score += Math.round(boost * 25); // up to +25 pts for vector relevance
          m.confidence = Math.min(m.confidence + boost * 0.1, 0.99);
          if (!m.matchReason.includes("Vector")) {
            m.matchReason = `Vector match ${(boost * 100).toFixed(0)}% · ` + m.matchReason;
          }
        }
      });
      matched.sort((a, b) => b.score - a.score);
    }

    // Stage 5: Generate reasoning + cascade with Gemini
    const { cascade, reasoning, latencyMs: cascadeLatency, isMock: cascadeMock } = await generateCascade(query, parsed, citations);

    return NextResponse.json({
      query,
      parsed,
      matched,
      citations,
      reasoning,
      cascade,
      meta: {
        totalMs: Date.now() - start,
        parseLatencyMs: parseLatency,
        cascadeLatencyMs: cascadeLatency,
        supplierSource,
        supplierCount: suppliers.length,
        usingMockGemini: parseMock || cascadeMock,
        usingVectorSearch: usingVectorCitations,
        vectorSupplierHints: vectorSupplierHints.length,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
