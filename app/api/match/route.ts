import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini.server";
import { listSuppliers, logSearch } from "@/lib/db/queries";
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
  serviceDomain?: string; // for opportunity detection
};

type Opportunity = {
  id: string;
  domain: string;
  label: string;
  detail: string;
  icon: string;
  urgency: "critical" | "high" | "medium";
  patrickAction: string; // what Patrick should do
  estimatedDealSize?: string;
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
      category:
          /durian|rice|ทุเรียน|ข้าว|fruit|ผลไม้|mango|มะม่วง|rubber|ยาง/i.test(q) ? "agriculture"
        : /shrimp|prawn|กุ้ง|fish|tuna|seafood|ปลา|ทะเล/i.test(q) ? "seafood"
        : /silk|ไหม|fabric|textile|ผ้า|cotton|linen/i.test(q) ? "textile"
        : /tea|coffee|ชา|กาแฟ|beverage|เครื่องดื่ม/i.test(q) ? "beverage"
        : /herbal|wellness|สมุนไพร|essential.?oil|massage|spa/i.test(q) ? "wellness"
        : /craft|handicraft|ceramic|เซรามิค|celadon|สังคโลก|pottery|wood|carving|หัตถกรรม|otop/i.test(q) ? "craft"
        : /manufactur|automotive|electronics|machinery|industrial|chip|semiconductor/i.test(q) ? "manufacturing"
        : null,
      product: query.slice(0, 100),
      language: /[ก-๙]/.test(query) ? "th" : "en",
    };
    return { parsed, latencyMs: 0, isMock: true };
  }
}

// ─── Match thresholds ─────────────────────────────────────────────────
const MIN_CONFIDENCE = 0.55;

// Bilingual / synonym expansion — bridges Thai-English + product synonyms
// Until pgvector embeddings cover all suppliers, this catches obvious misses
const SYNONYMS: Record<string, string[]> = {
  shrimp: ["กุ้ง", "prawn"],
  กุ้ง: ["shrimp", "prawn"],
  prawn: ["shrimp", "กุ้ง"],
  durian: ["ทุเรียน", "monthong", "หมอนทอง"],
  ทุเรียน: ["durian", "monthong"],
  rice: ["ข้าว", "jasmine", "hom mali", "หอมมะลิ"],
  ข้าว: ["rice", "jasmine"],
  silk: ["ไหม", "thai silk", "มัดหมี่"],
  ไหม: ["silk", "thai-silk"],
  coffee: ["กาแฟ", "single-origin", "doi-chaang", "ดอยช้าง"],
  กาแฟ: ["coffee", "single-origin", "ดอยช้าง"],
  tea: ["ชา", "oolong", "matcha"],
  ชา: ["tea", "oolong"],
  herbal: ["สมุนไพร", "wellness", "thai-traditional"],
  สมุนไพร: ["herbal", "wellness"],
  ceramic: ["เซรามิค", "celadon", "porcelain", "สังคโลก"],
  เซรามิค: ["ceramic", "celadon"],
  rubber: ["ยาง", "latex", "rss", "tsr"],
  ยาง: ["rubber", "latex"],
  fabric: ["ผ้า", "textile"],
  ผ้า: ["fabric", "textile"],
};

function expandQuery(q: string): string {
  const lc = q.toLowerCase();
  const expansions = new Set<string>([lc]);
  for (const [key, syns] of Object.entries(SYNONYMS)) {
    if (lc.includes(key.toLowerCase())) {
      syns.forEach(s => expansions.add(s.toLowerCase()));
    }
  }
  return Array.from(expansions).join(" ");
}

type ScoredSupplier = MatchedSupplier & {
  hasTagMatch: boolean;
  hasCategoryMatch: boolean;
};

// ─── Score suppliers against parsed query ─────────────────────────────
function scoreSuppliers(suppliers: Supplier[], parsed: ParsedQuery, query: string): ScoredSupplier[] {
  const q = expandQuery(query); // expand synonyms (shrimp ↔ กุ้ง ↔ prawn etc.)
  const scored = suppliers
    .filter(s => parsed.category === null || s.category === parsed.category)
    .map(s => {
      const hasCategoryMatch = parsed.category !== null && s.category === parsed.category;

      // Score components
      let score = s.performance_score; // base 0-100
      if (s.patrick_circle) score += 15;

      // Product match: bidirectional check
      // Direction A: any supplier tag/keyword in query (handles Thai compound words)
      // Direction B: any query token in supplier text (handles English + descriptions)
      const supplierKeywords = [
        ...s.tags,
        s.name,
        s.name_th ?? "",
        ...(s.description ?? "").split(/[\s,.\-_/()]+/).filter(w => w.length > 3),
        ...(s.description_th ?? "").split(/[\s,.\-_/()]+/).filter(w => w.length > 1),
      ].filter(Boolean).map(k => k.toLowerCase());

      const haystack = supplierKeywords.join(" ");
      const queryTokens = q.split(/[\s,.\-_/()]+/).filter(t => t.length > 2);

      // Direction A: supplier keyword found in query
      const dirAMatches = supplierKeywords.filter(k => k.length > 2 && q.includes(k));
      // Direction B: query token found in supplier haystack
      const dirBMatches = queryTokens.filter(t => haystack.includes(t));

      const totalMatches = new Set([...dirAMatches, ...dirBMatches]).size;
      const tagMatch = totalMatches > 0;
      if (tagMatch) score += 20 + Math.min(totalMatches * 3, 15);
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
        hasTagMatch: tagMatch,
        hasCategoryMatch,
      } satisfies ScoredSupplier;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // keep top 5 candidates for filtering

  return scored;
}

// Apply strict threshold — return only suppliers that genuinely match
function filterStrongMatches(
  scored: ScoredSupplier[],
  vectorHints: { supplier_id: string; similarity: number }[]
): { strong: MatchedSupplier[]; weak: MatchedSupplier[] } {
  const vectorMap = new Map(vectorHints.map(h => [h.supplier_id, h.similarity]));

  const strong: MatchedSupplier[] = [];
  const weak: MatchedSupplier[] = [];

  for (const s of scored) {
    const vectorSim = vectorMap.get(s.id) ?? 0;
    const hasVectorBoost = vectorSim >= 0.45;

    // STRICT: must have actual product/tag match OR strong semantic similarity
    // patrick_circle + category alone is NOT enough — that's just "any Patrick supplier"
    const passesQualitative = s.hasTagMatch || hasVectorBoost;
    const passesQuantitative = s.confidence >= MIN_CONFIDENCE;

    // Strip helper props before returning
    const clean: MatchedSupplier = {
      id: s.id,
      name: s.name,
      tier: s.tier,
      patrick_circle: s.patrick_circle,
      score: s.score,
      capacity: s.capacity,
      certs: s.certs,
      matchReason: s.matchReason,
      confidence: s.confidence,
    };

    if (passesQualitative && passesQuantitative) {
      strong.push(clean);
    } else {
      weak.push(clean);
    }
  }

  return { strong: strong.slice(0, 3), weak: weak.slice(0, 3) };
}

// ─── Smart cascade templates (query-specific, not generic) ────────────
function buildSmartCascade(query: string, parsed: ParsedQuery): CascadeNode[] {
  const q = query.toLowerCase();
  const qty = parsed.quantity ?? "ปริมาณตามสัญญา";
  const dest = q.includes("ดูไบ") || q.includes("dubai") ? "ดูไบ / UAE"
             : q.includes("japan") || q.includes("ญี่ปุ่น") ? "ญี่ปุ่น"
             : q.includes("eu") || q.includes("europe") || q.includes("ยุโรป") ? "EU"
             : q.includes("us") || q.includes("usa") || q.includes("america") ? "USA"
             : q.includes("china") || q.includes("จีน") ? "จีน"
             : q.includes("singapore") || q.includes("สิงคโปร์") ? "สิงคโปร์"
             : q.includes("hong kong") || q.includes("ฮ่องกง") ? "ฮ่องกง"
             : q.includes("saudi") || q.includes("ซาอุ") ? "ซาอุดีอาระเบีย"
             : "ตลาดต่างประเทศ";
  const isMiddleEast = ["ดูไบ", "uae", "saudi", "gcc", "qatar", "kuwait", "riyadh"].some(k => q.includes(k));
  const isJapan = q.includes("japan") || q.includes("ญี่ปุ่น");
  const isEU = q.includes("eu") || q.includes("europe") || q.includes("ยุโรป") || q.includes("germany") || q.includes("france");

  const cat = parsed.category;
  const product = parsed.product.slice(0, 40);

  // ── Agriculture / Fresh Produce ──────────────────────────────────────
  if (cat === "agriculture") {
    const isDurian = q.includes("durian") || q.includes("ทุเรียน");
    const isRice = q.includes("rice") || q.includes("ข้าว");
    const isRubber = q.includes("rubber") || q.includes("ยาง");

    if (isDurian) {
      return [
        { id: "L1", layer: 1, label: `ทุเรียน Monthong ${qty} → ${dest}`, detail: `Buyer ต้องการส่งมอบก่อน Q3 — ราคา premium $18-24/kg retail`, icon: "🥭", color: "amber", serviceDomain: "primary" },
        { id: "L2-1", layer: 2, label: "Cold Chain reefer → Laem Chabang", detail: "Container reefer 12°C, forwarder ประสบการณ์ UAE/ME, port slot Laem Chabang", icon: "🚢", color: "sky", parent: "L1", serviceDomain: "cold_chain" },
        { id: "L2-2", layer: 2, label: isMiddleEast ? "Halal + GACC Certification" : "GAP/GlobalG.A.P. Cert", detail: isMiddleEast ? "CICOT Halal cert + GACC registration ต้องมีก่อน ship" : "GlobalG.A.P. + Thai FDA cert required for export", icon: "✅", color: "sky", parent: "L1", serviceDomain: "certification" },
        { id: "L2-3", layer: 2, label: "Trade Finance L/C + FX Hedge", detail: `L/C จาก ${dest} bank, marine cargo insurance, USD/THB hedge ป้องกัน FX risk`, icon: "🏦", color: "sky", parent: "L1", serviceDomain: "trade_finance" },
        { id: "L3-1", layer: 3, label: `Bilingual Coordinator TH-${isMiddleEast ? "AR/EN" : isJapan ? "JP" : "EN"}`, detail: "Coordinator ประสานงาน buyer ฝั่ง export, เจรจา Phyto cert + ศุลกากร", icon: "👨‍💼", color: "emerald", parent: "L2-1", serviceDomain: "export_coordinator" },
        { id: "L3-2", layer: 3, label: "On-Farm Quality Inspector", detail: "ตรวจ ripeness, reject rate < 5%, grade A/B sorting ก่อน pack", icon: "🔍", color: "emerald", parent: "L2-2", serviceDomain: "quality_inspector" },
        { id: "L4-1", layer: 4, label: "Cold Chain Handling Training", detail: "Packing house worker training: temperature zone, bruise prevention, sticker grade", icon: "🎓", color: "rose", parent: "L3-1", serviceDomain: "vocational_training" },
        { id: "L4-2", layer: 4, label: "GAP Farmer Upskill Program", detail: "DOA GAP certification course สำหรับ supplier ที่ยังไม่ผ่าน — prerequisite ก่อน export", icon: "🌱", color: "rose", parent: "L3-2", serviceDomain: "agri_training" },
      ];
    }

    if (isRice) {
      return [
        { id: "L1", layer: 1, label: `Hom Mali / Jasmine Rice ${qty} → ${dest}`, detail: `Premium grade ${isEU ? "EU Organic certified" : "export grade"}, avg price $${isEU ? "1,250" : "820"}/ton`, icon: "🌾", color: "amber", serviceDomain: "primary" },
        { id: "L2-1", layer: 2, label: "Rice Mill + Bulk Shipping", detail: "Certified mill (ISO 22000), bulk carrier / FCL container, Chachoengsao loading", icon: "🏭", color: "sky", parent: "L1", serviceDomain: "processing_logistics" },
        { id: "L2-2", layer: 2, label: isEU ? "EU Organic + Residue Testing" : "Thai FDA + Phytosanitary", detail: isEU ? "EU Organic 2018/848 compliance, pesticide residue lab test required" : "Thai FDA food cert + กรมวิชาการเกษตร phyto cert", icon: "🧪", color: "sky", parent: "L1", serviceDomain: "certification" },
        { id: "L2-3", layer: 2, label: "Commodity Trade Finance", detail: "Pre-shipment finance, สัญญาซื้อขายล่วงหน้า, FX hedge against USD/THB", icon: "💰", color: "sky", parent: "L1", serviceDomain: "trade_finance" },
        { id: "L3-1", layer: 3, label: "Grain Quality Grader", detail: "Milling yield test, whiteness grade, moisture check — ต้องมี ISO lab", icon: "⚖️", color: "emerald", parent: "L2-1", serviceDomain: "quality_inspector" },
        { id: "L3-2", layer: 3, label: isEU ? "Organic Cert Consultant" : "Export Documentation Specialist", detail: isEU ? "ช่วย farmer group apply EU Organic cert 18-24 เดือน" : "รับผิดชอบ Certificate of Origin + Phyto + invoice set", icon: "📋", color: "emerald", parent: "L2-2", serviceDomain: "export_coordinator" },
        { id: "L4-1", layer: 4, label: "Organic Farming Transition Course", detail: "กรมวิชาการเกษตร + เกษตรอินทรีย์ — สำหรับ farmer ที่ต้องการ cert ใหม่", icon: "🌿", color: "rose", parent: "L3-2", serviceDomain: "agri_training" },
      ];
    }

    if (isRubber) {
      return [
        { id: "L1", layer: 1, label: `Natural Rubber ${qty} → ${dest}`, detail: "RSS3/TSR20 grade, FOB Hatyai/Songkhla, avg $1.53/kg", icon: "🌳", color: "amber", serviceDomain: "primary" },
        { id: "L2-1", layer: 2, label: "Rubber Grading + Bulk Logistics", detail: "RRIT-certified grader, bulk ship Hatyai port, container FCL/LCL option", icon: "🚛", color: "sky", parent: "L1", serviceDomain: "processing_logistics" },
        { id: "L2-2", layer: 2, label: "Commodity Futures Hedge", detail: "TOCOM / SICOM hedge, USD payment via SCB/Kasikorn trade desk", icon: "📈", color: "sky", parent: "L1", serviceDomain: "trade_finance" },
        { id: "L3-1", layer: 3, label: "Rubber Grader / Quality Tester", detail: "Plasticity Retention Index (PRI), DRC content, dirt content lab test", icon: "🔬", color: "emerald", parent: "L2-1", serviceDomain: "quality_inspector" },
        { id: "L4-1", layer: 4, label: "Tapping Efficiency Training", detail: "ORRAF program — เพิ่ม yield 15-20%, ลด tapping panel damage", icon: "🎓", color: "rose", parent: "L3-1", serviceDomain: "agri_training" },
      ];
    }

    // Generic fresh produce
    return [
      { id: "L1", layer: 1, label: `${product} ${qty} → ${dest}`, detail: "Fresh produce export — premium market segment", icon: "🌿", color: "amber", serviceDomain: "primary" },
      { id: "L2-1", layer: 2, label: "Cold Chain + Export Logistics", detail: `Reefer container ${isMiddleEast ? "12°C" : "-1°C"}, forwarder, phyto cert, Laem Chabang port`, icon: "🚢", color: "sky", parent: "L1", serviceDomain: "cold_chain" },
      { id: "L2-2", layer: 2, label: isMiddleEast ? "Halal + Export Cert" : "GAP + Export Certification", detail: isMiddleEast ? "CICOT Halal + GACC/Thai FDA cert required" : "GlobalG.A.P. / GAP-Plus cert + phytosanitary inspection", icon: "✅", color: "sky", parent: "L1", serviceDomain: "certification" },
      { id: "L2-3", layer: 2, label: "Trade Finance + Insurance", detail: "L/C, marine insurance, currency hedge USD/THB", icon: "🏦", color: "sky", parent: "L1", serviceDomain: "trade_finance" },
      { id: "L3-1", layer: 3, label: "Quality Inspector + Sorter", detail: "On-farm / packing house inspection, grade A/B selection, reject < 3%", icon: "🔍", color: "emerald", parent: "L2-1", serviceDomain: "quality_inspector" },
      { id: "L3-2", layer: 3, label: "Bilingual Export Coordinator", detail: `TH-${isMiddleEast ? "AR" : isJapan ? "JP" : "EN"} coordinator, buyer communication, document set`, icon: "👨‍💼", color: "emerald", parent: "L2-2", serviceDomain: "export_coordinator" },
      { id: "L4-1", layer: 4, label: "Packing & Cold Chain Training", detail: "ฝึกอบรมทีม packing house — temperature control, bruise reduction, grading standard", icon: "🎓", color: "rose", parent: "L3-1", serviceDomain: "vocational_training" },
    ];
  }

  // ── Seafood ──────────────────────────────────────────────────────────
  if (cat === "seafood") {
    const isShrimp = q.includes("shrimp") || q.includes("กุ้ง");
    return [
      { id: "L1", layer: 1, label: `${isShrimp ? "Frozen Shrimp" : "Premium Seafood"} ${qty} → ${dest}`, detail: `${isJapan ? "Penaeus vannamei white shrimp — ¥3,200/kg wholesale" : "HACCP-certified frozen, -18°C cold chain required"}`, icon: "🦐", color: "amber", serviceDomain: "primary" },
      { id: "L2-1", layer: 2, label: "Frozen Cold Chain -18°C", detail: "DOF-licensed freezer vessel/facility, reefer container, freight forwarder specializing seafood", icon: "❄️", color: "sky", parent: "L1", serviceDomain: "cold_chain" },
      { id: "L2-2", layer: 2, label: isJapan ? "HACCP + Antibiotic-Free Test" : isEU ? "EU Reg 853/2004 + HACCP" : "HACCP + Thai FDA Cert", detail: isJapan ? "DOF facility approval, ractopamine/antibiotic-free testing, JAS traceability" : isEU ? "EU-approved establishment list, 853/2004 compliance, official vet cert" : "HACCP GMP + Thai FDA export license for seafood", icon: "🧫", color: "sky", parent: "L1", serviceDomain: "haccp_cert" },
      { id: "L2-3", layer: 2, label: "Trade Finance + Insurance", detail: "L/C at sight, marine cargo insurance -18°C clause, USD/JPY or USD/EUR hedge", icon: "💰", color: "sky", parent: "L1", serviceDomain: "trade_finance" },
      { id: "L3-1", layer: 3, label: "HACCP Coordinator / QC Officer", detail: "Manage CCP records, corrective actions, lab sample coordination, audit-ready", icon: "🔬", color: "emerald", parent: "L2-2", serviceDomain: "quality_inspector" },
      { id: "L3-2", layer: 3, label: isJapan ? "Japanese Language Coordinator" : "Export Documentation Officer", detail: isJapan ? "TH-JP ล่าม + เอกสาร health certificate ตาม Japanese Import Standards" : "Health certificate, COO, invoice, packing list set", icon: "📋", color: "emerald", parent: "L2-1", serviceDomain: "export_coordinator" },
      { id: "L4-1", layer: 4, label: "HACCP Practitioner Certification", detail: "ฝึกอบรม HACCP level 2 สำหรับ line supervisor — DOF approved curriculum", icon: "🎓", color: "rose", parent: "L3-1", serviceDomain: "vocational_training" },
    ];
  }

  // ── Textile / Silk ───────────────────────────────────────────────────
  if (cat === "textile") {
    const isSilk = q.includes("silk") || q.includes("ไหม");
    return [
      { id: "L1", layer: 1, label: `${isSilk ? "Thai Silk GI" : "Premium Textile"} ${qty} → ${dest}`, detail: isSilk ? "GI-certified Pak Thong Chai / Surin silk — luxury hospitality segment $80-300K/property" : "Technical textile or premium apparel — EU/USA buyers", icon: "🧵", color: "amber", serviceDomain: "primary" },
      { id: "L2-1", layer: 2, label: "Luxury Freight + White Glove Packaging", detail: "Air freight or specialized courier, custom packaging, textile handling protocol", icon: "📦", color: "sky", parent: "L1", serviceDomain: "luxury_logistics" },
      { id: "L2-2", layer: 2, label: isSilk ? "GI Certificate + OTOP Authentication" : "OEKO-TEX / Sustainability Cert", detail: isSilk ? "กรมทรัพย์สินทางปัญญา GI cert + OTOP authentication card per bolt" : "OEKO-TEX 100 or GOTS certification for EU/USA buyers", icon: "🏆", color: "sky", parent: "L1", serviceDomain: "certification" },
      { id: "L2-3", layer: 2, label: "Brand + IP Protection", detail: "Trademark registration target market, IP protection against counterfeit", icon: "⚖️", color: "sky", parent: "L1", serviceDomain: "legal_ip" },
      { id: "L3-1", layer: 3, label: "Textile Designer / Brand Liaison", detail: "ออกแบบ custom pattern ตาม buyer spec, coordinate บ้านทอ กับ buyer's design team", icon: "🎨", color: "emerald", parent: "L2-1", serviceDomain: "design_coordinator" },
      { id: "L3-2", layer: 3, label: "Master Weaver (Heritage Artisan)", detail: "ช่างทอมีประสบการณ์ GI-grade, สามารถผลิต custom width + pattern", icon: "🪡", color: "emerald", parent: "L2-2", serviceDomain: "artisan_skill" },
      { id: "L4-1", layer: 4, label: "Traditional Weaving Preservation Program", detail: "อนุรักษ์ทักษะทอผ้าโบราณ + ถ่ายทอดรุ่นใหม่ — funding from BOI / Cultural Ministry", icon: "🎓", color: "rose", parent: "L3-2", serviceDomain: "heritage_training" },
    ];
  }

  // ── Beverage ─────────────────────────────────────────────────────────
  if (cat === "beverage") {
    const isCoffee = q.includes("coffee") || q.includes("กาแฟ");
    return [
      { id: "L1", layer: 1, label: `${isCoffee ? "Single-Origin Coffee" : "Thai Specialty Tea"} ${qty} → ${dest}`, detail: isCoffee ? "Doi Chaang / Doi Tung SCA 80+ — $28-42/kg green bean wholesale" : "Thai premium tea — organic certified, specialty segment growing", icon: isCoffee ? "☕" : "🍵", color: "amber", serviceDomain: "primary" },
      { id: "L2-1", layer: 2, label: "Specialty Coffee Export Logistics", detail: "GrainPro bag / vacuum pack, air/sea freight, 3PL with temperature-controlled warehouse", icon: "📦", color: "sky", parent: "L1", serviceDomain: "specialty_logistics" },
      { id: "L2-2", layer: 2, label: isCoffee ? "SCA / Cup of Excellence Positioning" : "Organic + Fair Trade Cert", detail: isCoffee ? "SCA grading, COE competition entry — drives premium price command" : "USDA Organic / EU Organic / Fair Trade cert for premium market", icon: "🏅", color: "sky", parent: "L1", serviceDomain: "certification" },
      { id: "L3-1", layer: 3, label: isCoffee ? "Q Grader / Roast Consultant" : "Tea Taster / Blender", detail: isCoffee ? "Q-certified grader — score lot 80+, work with roaster partner in target market" : "Certified tea taster, blend for target market palate", icon: "👅", color: "emerald", parent: "L2-1", serviceDomain: "specialist_skill" },
      { id: "L3-2", layer: 3, label: "Export + Customs Specialist", detail: "HS code 0901 / 0902 filing, FDA food facility registration, origin certificate", icon: "📋", color: "emerald", parent: "L2-2", serviceDomain: "export_coordinator" },
      { id: "L4-1", layer: 4, label: "Highland Farmer Specialty Training", detail: "Post-harvest processing workshop — wet/dry process, fermentation, sorting tier", icon: "🌱", color: "rose", parent: "L3-1", serviceDomain: "agri_training" },
    ];
  }

  // ── Wellness / Herbal ────────────────────────────────────────────────
  if (cat === "wellness") {
    return [
      { id: "L1", layer: 1, label: `Thai Herbal / Wellness Product ${qty} → ${dest}`, detail: "Nutraceutical / essential oil / herbal supplement — $312M export market +22% YoY", icon: "🌿", color: "amber", serviceDomain: "primary" },
      { id: "L2-1", layer: 2, label: "GMP / cGMP Facility + Lab", detail: "Thai FDA GMP license, ISO 22000, third-party stability testing lab", icon: "🏭", color: "sky", parent: "L1", serviceDomain: "gmp_facility" },
      { id: "L2-2", layer: 2, label: isMiddleEast ? "Halal Pharma Cert" : isJapan ? "Japan Import Compliance" : "FDA / EFSA Compliance", detail: isMiddleEast ? "CICOT Halal + UAE ESMA registration for supplement" : isJapan ? "JFSL-compliant, Japanese label, notification to MHLW" : "DSHEA compliance (USA) or EFSA novel food notification (EU)", icon: "📜", color: "sky", parent: "L1", serviceDomain: "certification" },
      { id: "L3-1", layer: 3, label: "Regulatory Affairs Specialist", detail: "ยื่น FDA import notification ปลายทาง, label compliance, HS 1211 / 3004 classification", icon: "⚖️", color: "emerald", parent: "L2-2", serviceDomain: "regulatory_specialist" },
      { id: "L3-2", layer: 3, label: "Formulation Chemist", detail: "Standardize active compound content, extract ratio, shelf-life validation", icon: "🔬", color: "emerald", parent: "L2-1", serviceDomain: "specialist_skill" },
      { id: "L4-1", layer: 4, label: "Thai Traditional Medicine Practitioner Training", detail: "TTM practitioner certification — Thai FDA licensing pathway for herbal practitioners", icon: "🎓", color: "rose", parent: "L3-1", serviceDomain: "vocational_training" },
    ];
  }

  // ── Manufacturing ────────────────────────────────────────────────────
  if (cat === "manufacturing") {
    return [
      { id: "L1", layer: 1, label: `Manufacturing Supply ${qty} → ${dest}`, detail: "Industrial / B2B supply — EEC zone, BOI incentive eligible", icon: "🏭", color: "amber", serviceDomain: "primary" },
      { id: "L2-1", layer: 2, label: "International Freight + 3PL", detail: "Sea freight FCL, incoterms DAP/DDP, 3PL warehouse ปลายทาง, track & trace", icon: "🚢", color: "sky", parent: "L1", serviceDomain: "logistics" },
      { id: "L2-2", layer: 2, label: "ISO / CE / Safety Certification", detail: "ISO 9001, CE marking (EU), UL listing (USA), or local market cert", icon: "📋", color: "sky", parent: "L1", serviceDomain: "certification" },
      { id: "L2-3", layer: 2, label: "Trade Finance + Supply Chain Finance", detail: "Buyer credit, factoring, supply chain finance program via Bangkok Bank / KBank", icon: "💰", color: "sky", parent: "L1", serviceDomain: "trade_finance" },
      { id: "L3-1", layer: 3, label: "QA / QC Engineer", detail: "SPC, defect rate monitoring, FMEA, 8D problem solving — B2B buyer audit ready", icon: "⚙️", color: "emerald", parent: "L2-2", serviceDomain: "quality_inspector" },
      { id: "L3-2", layer: 3, label: "Bilingual Technical Sales", detail: "วิศวกรการขาย TH-EN, demo ผลิตภัณฑ์, จัดทำ technical proposal ภาษาอังกฤษ", icon: "💼", color: "emerald", parent: "L2-1", serviceDomain: "export_coordinator" },
      { id: "L4-1", layer: 4, label: "Vocational Technical Upskill", detail: "CNC operator, PLC programming, welding cert — support EEC workforce demand", icon: "🎓", color: "rose", parent: "L3-1", serviceDomain: "vocational_training" },
    ];
  }

  // ── Craft / OTOP ────────────────────────────────────────────────────
  if (cat === "craft") {
    return [
      { id: "L1", layer: 1, label: `Thai Craft / Heritage Product ${qty} → ${dest}`, detail: "Handmade certified, OTOP-eligible — EU/USA boutique + luxury retail buyer", icon: "🏺", color: "amber", serviceDomain: "primary" },
      { id: "L2-1", layer: 2, label: "Specialty Art Freight + Insurance", detail: "Fine art shipping, custom crating, all-risk marine insurance, climate-controlled", icon: "📦", color: "sky", parent: "L1", serviceDomain: "luxury_logistics" },
      { id: "L2-2", layer: 2, label: "OTOP + Fair Trade Certification", detail: "กรมพัฒนาชุมชน OTOP cert, Fair Trade Thailand — builds premium price story", icon: "🏆", color: "sky", parent: "L1", serviceDomain: "certification" },
      { id: "L3-1", layer: 3, label: "E-Commerce + Marketplace Specialist", detail: "Amazon Handmade, Etsy, Not On The High Street — listing optimization, photography", icon: "🛒", color: "emerald", parent: "L2-1", serviceDomain: "ecommerce" },
      { id: "L3-2", layer: 3, label: "Heritage Master Artisan", detail: "ช่างฝีมือระดับครู — quality benchmark, prototype approval, train junior artisans", icon: "🪡", color: "emerald", parent: "L2-2", serviceDomain: "artisan_skill" },
      { id: "L4-1", layer: 4, label: "Artisan Apprenticeship Program", detail: "ถ่ายทอดทักษะสู่คนรุ่นใหม่ — BOI + Cultural Ministry heritage grant eligible", icon: "🎓", color: "rose", parent: "L3-2", serviceDomain: "heritage_training" },
    ];
  }

  // ── Generic fallback (still query-aware) ────────────────────────────
  return [
    { id: "L1", layer: 1, label: `${product} ${qty} → ${dest}`, detail: "Thai premium supply — verified source, export-ready", icon: "🌍", color: "amber", serviceDomain: "primary" },
    { id: "L2-1", layer: 2, label: "Export Logistics + Customs", detail: "Freight forwarder, customs broker, appropriate incoterms, port clearance", icon: "🚢", color: "sky", parent: "L1", serviceDomain: "logistics" },
    { id: "L2-2", layer: 2, label: isMiddleEast ? "Halal Certification" : "Export Certification", detail: isMiddleEast ? "CICOT Halal cert + destination country import registration" : "Thai FDA / relevant export cert + phytosanitary / health cert", icon: "✅", color: "sky", parent: "L1", serviceDomain: "certification" },
    { id: "L2-3", layer: 2, label: "Trade Finance + Insurance", detail: "L/C, export credit guarantee (EXIM Bank), marine insurance, currency hedge", icon: "🏦", color: "sky", parent: "L1", serviceDomain: "trade_finance" },
    { id: "L3-1", layer: 3, label: "Quality Inspector", detail: "Independent inspection at source + loading — reduce buyer dispute risk", icon: "🔍", color: "emerald", parent: "L2-1", serviceDomain: "quality_inspector" },
    { id: "L3-2", layer: 3, label: "Bilingual Export Coordinator", detail: `TH-${isMiddleEast ? "AR/EN" : isJapan ? "JP" : "EN"} coordinator — buyer relationship + document management`, icon: "👨‍💼", color: "emerald", parent: "L2-2", serviceDomain: "export_coordinator" },
    { id: "L4-1", layer: 4, label: "Export Business Training", detail: "DITP / EXIM Bank export readiness program สำหรับ SME supplier", icon: "🎓", color: "rose", parent: "L3-1", serviceDomain: "vocational_training" },
  ];
}

// ─── Detect supply gaps → Patrick Opportunities ────────────────────────
function detectOpportunities(
  cascade: CascadeNode[],
  suppliers: Supplier[],
  parsed: ParsedQuery,
  matched: MatchedSupplier[]
): Opportunity[] {
  const opportunities: Opportunity[] = [];
  const supplierCategories = new Set(suppliers.map(s => s.category));

  // Service domains that map to real supplier categories we cover
  const coveredDomains = new Set<string>();
  if (supplierCategories.has("agriculture")) coveredDomains.add("primary");
  if (supplierCategories.has("seafood")) coveredDomains.add("primary");
  if (supplierCategories.has("textile")) coveredDomains.add("primary");
  if (supplierCategories.has("craft")) coveredDomains.add("primary");
  if (supplierCategories.has("beverage")) coveredDomains.add("primary");
  if (supplierCategories.has("wellness")) coveredDomains.add("primary");
  if (supplierCategories.has("manufacturing")) coveredDomains.add("primary");

  // Service nodes (L2-L4) are NEVER covered by current supplier DB → all are gaps
  const serviceNodes = cascade.filter(n => n.layer >= 2 && n.serviceDomain && n.serviceDomain !== "primary");

  // Domain → opportunity specs
  const domainSpecs: Record<string, { urgency: Opportunity["urgency"]; patrickAction: string; estimatedDealSize?: string }> = {
    cold_chain:           { urgency: "critical", patrickAction: "หา Freight Forwarder / Cold Chain 3PL ที่เชี่ยวชาญ ME/Japan route — recurring revenue per shipment", estimatedDealSize: "฿80-200K/container" },
    certification:        { urgency: "critical", patrickAction: "เชื่อม Certification Body (CICOT Halal / GlobalG.A.P. / FDA TH) — รับ commission per cert application", estimatedDealSize: "฿15-60K/cert" },
    trade_finance:        { urgency: "high",     patrickAction: "ประสาน Trade Finance desk: Bangkok Bank, KBank, EXIM Bank — รับ referral fee", estimatedDealSize: "฿50-150K/deal" },
    haccp_cert:           { urgency: "critical", patrickAction: "หา HACCP consultant / DOF-approved auditor สำหรับ seafood facility", estimatedDealSize: "฿40-120K/audit" },
    quality_inspector:    { urgency: "high",     patrickAction: "รับ Quality Inspector freelance network เข้า Platform — ค่าบริการ per visit", estimatedDealSize: "฿8-25K/inspection" },
    export_coordinator:   { urgency: "high",     patrickAction: "หา Bilingual Export Coordinator (TH-AR/EN/JP) — เข้าร่วม Platform เป็น service provider", estimatedDealSize: "฿30-80K/shipment" },
    processing_logistics: { urgency: "high",     patrickAction: "เชื่อม Rice Mill / Processing facility ที่ export-certified — expand supplier DB", estimatedDealSize: "฿200-500K/contract" },
    luxury_logistics:     { urgency: "medium",   patrickAction: "หา Fine Art / Luxury Freight specialist ที่ handle silk/craft — niche but recurring", estimatedDealSize: "฿20-80K/shipment" },
    legal_ip:             { urgency: "medium",   patrickAction: "เชื่อม IP Law firm ที่เชี่ยวชาญ trademark ตลาด ME/EU — per-country registration fee", estimatedDealSize: "฿50-200K/country" },
    vocational_training:  { urgency: "medium",   patrickAction: "Partner กับ vocational school / training center — recurring training contract", estimatedDealSize: "฿20-60K/program" },
    agri_training:        { urgency: "medium",   patrickAction: "เชื่อม DOA / agricultural college ที่ให้ GAP certification training — grant eligible", estimatedDealSize: "฿15-45K/batch" },
    specialist_skill:     { urgency: "high",     patrickAction: "หา Q Grader / Master Taster / Specialist ที่ freelance — rare skill, premium rate", estimatedDealSize: "฿20-60K/contract" },
    regulatory_specialist:{ urgency: "high",     patrickAction: "เชื่อม Regulatory Affairs consultant ที่รู้ FDA ทั้ง TH + ปลายทาง — high value service", estimatedDealSize: "฿80-250K/registration" },
    ecommerce:            { urgency: "medium",   patrickAction: "หา E-commerce specialist (Amazon Handmade / Etsy) — revenue share model", estimatedDealSize: "฿15-40K/setup" },
    gmp_facility:         { urgency: "critical", patrickAction: "หา GMP-licensed contract manufacturer สำหรับ herbal/wellness — ขาดมากในระบบ", estimatedDealSize: "฿200-800K/batch" },
    artisan_skill:        { urgency: "medium",   patrickAction: "สร้าง Heritage Artisan Network — unique supply ที่ Platform เท่านั้นมี", estimatedDealSize: "฿50-200K/order" },
    heritage_training:    { urgency: "medium",   patrickAction: "Partner กับ Cultural Ministry / SACICT — grant funding available", estimatedDealSize: "฿30-100K/program" },
    design_coordinator:   { urgency: "medium",   patrickAction: "หา Textile Designer ที่ทำงาน with luxury brand — high margin service", estimatedDealSize: "฿40-150K/project" },
    logistics:            { urgency: "high",     patrickAction: "เชื่อม Freight Forwarder ที่ reliable สำหรับ Thailand export — volume referral", estimatedDealSize: "฿30-100K/shipment" },
    specialty_logistics:  { urgency: "medium",   patrickAction: "หา 3PL ที่ handle specialty food / coffee export — temperature control required", estimatedDealSize: "฿20-60K/shipment" },
  };

  // Primary supply gap — if matched count < 2 or no high-confidence match
  const hasStrongMatch = matched.length > 0 && matched[0].confidence >= 0.7;
  if (!hasStrongMatch && parsed.category) {
    opportunities.push({
      id: "opp-supply-gap",
      domain: "supply_gap",
      label: `Supply Gap: ${parsed.product.slice(0, 50)}`,
      detail: `ไม่พบ supplier ที่ confidence สูงพอสำหรับ "${parsed.product.slice(0, 40)}" — ${parsed.category} category ต้องการ connection เพิ่ม`,
      icon: "⚠️",
      urgency: "critical",
      patrickAction: `หา ${parsed.category} supplier เพิ่มที่มี export experience — เพิ่มเข้า Platform ได้ทันที`,
      estimatedDealSize: "Deal size ขึ้นอยู่กับ query quantity",
    });
  }

  // Service gaps from cascade
  const seenDomains = new Set<string>();
  for (const node of serviceNodes) {
    const domain = node.serviceDomain!;
    if (seenDomains.has(domain)) continue;
    if (coveredDomains.has(domain)) continue;
    seenDomains.add(domain);

    const spec = domainSpecs[domain];
    if (!spec) continue;

    opportunities.push({
      id: `opp-${domain}`,
      domain,
      label: node.label,
      detail: node.detail,
      icon: node.icon,
      urgency: spec.urgency,
      patrickAction: spec.patrickAction,
      estimatedDealSize: spec.estimatedDealSize,
    });
  }

  // Sort: critical → high → medium
  const urgencyOrder = { critical: 0, high: 1, medium: 2 };
  return opportunities.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
}

// ─── Generate cascading demand using Gemini ───────────────────────────
async function generateCascade(
  query: string,
  parsed: ParsedQuery,
  citations: ReturnType<typeof findCitations>
): Promise<{ cascade: CascadeNode[]; reasoning: string; latencyMs: number; isMock: boolean }> {
  const systemPrompt = `You are an expert Thai supply economist. Given a Thai-export demand query, generate:
1. A 2-paragraph reasoning citing BOI/Customs sources
2. A cascading demand tree (4 layers) specific to this exact deal

Respond in JSON only:
{
  "reasoning": "2 Thai paragraphs with inline citations like [BOI 2024]",
  "cascade": [
    {"id":"L1","layer":1,"label":"...","detail":"...","icon":"emoji","color":"amber","serviceDomain":"primary"},
    {"id":"L2-1","layer":2,"label":"...","detail":"...","icon":"emoji","color":"sky","parent":"L1","serviceDomain":"cold_chain"},
    ...
  ]
}

Layers:
- Layer 1 (amber): The specific buyer demand with product/quantity/market
- Layer 2 (sky): Exact services needed — use serviceDomain values: cold_chain, certification, trade_finance, haccp_cert, luxury_logistics, gmp_facility
- Layer 3 (emerald): Specific skills/roles — serviceDomain: quality_inspector, export_coordinator, specialist_skill, regulatory_specialist
- Layer 4 (rose): Training/education — serviceDomain: vocational_training, agri_training, heritage_training

CRITICAL: Be 100% specific to the query. Use exact product names, quantities, destination city, market requirements.
Never use generic labels like "Primary Buyer Demand" — use real specifics.`;

  const userPrompt = `Query: "${query}"
Category: ${parsed.category}, Product: ${parsed.product}, Quantity: ${parsed.quantity ?? "unspecified"}, Destination: detect from query
Citations: ${citations.map(c => `[${c.source} ${c.year}: ${c.title}]`).join("; ")}`;

  try {
    const result = await callGemini({
      systemPrompt,
      userPrompt,
      jsonMode: true,
      maxOutputTokens: 1800,
    });
    const data = JSON.parse(result.text) as { reasoning: string; cascade: CascadeNode[] };
    if (!data.cascade || data.cascade.length < 4) throw new Error("cascade too short");
    return { cascade: data.cascade, reasoning: data.reasoning, latencyMs: result.latencyMs, isMock: false };
  } catch {
    // Smart fallback — query-aware cascade (not hardcoded)
    const cascade = buildSmartCascade(query, parsed);
    const cite = citations[0];
    const reasoning = `จากข้อมูล${cite ? ` [${cite.source} ${cite.year ?? ""}] "${cite.title}"` : "ใน Platform"} — ${parsed.product.slice(0, 60)} เป็นสินค้าที่มี demand ชัดเจนในตลาด${parsed.region ?? "ต่างประเทศ"} supplier ที่ผ่านการ verify ใน Platform มี performance score และ certification ที่ตรงกับ requirement ของ deal นี้\n\nDeal นี้ trigger sub-economy 4 layer — ตั้งแต่ logistics, certification, trade finance (L2) → skilled coordinator, inspector (L3) → training program (L4) Platform สามารถ monetize ทุก layer ผ่าน referral + subscription`;
    return { cascade, reasoning, latencyMs: 0, isMock: true };
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

    // Stage 3: Score candidates (top 5)
    const scored = scoreSuppliers(suppliers, parsed, query);

    // Stage 4: Find citations — vector search first, keyword fallback
    const [citations, vectorSupplierHints] = await Promise.all([
      findCitationsVector(query, 3),
      findSuppliersVector(query, 5),
    ]);
    const usingVectorCitations = citations.some(c => "similarity" in c);

    // Apply vector boost to scored candidates
    if (vectorSupplierHints.length > 0) {
      const hintMap = new Map(vectorSupplierHints.map(h => [h.supplier_id, h.similarity]));
      scored.forEach(m => {
        const boost = hintMap.get(m.id);
        if (boost !== undefined) {
          m.score += Math.round(boost * 25);
          m.confidence = Math.min(m.confidence + boost * 0.1, 0.99);
          if (!m.matchReason.includes("Vector")) {
            m.matchReason = `Vector match ${(boost * 100).toFixed(0)}% · ` + m.matchReason;
          }
        }
      });
      scored.sort((a, b) => b.score - a.score);
    }

    // Apply STRICT THRESHOLD — separate strong vs weak matches
    const { strong: matched, weak: weakMatches } = filterStrongMatches(scored, vectorSupplierHints);
    const noMatch = matched.length === 0;
    const topConfidence = scored[0]?.confidence ?? 0;

    // Build human-readable noMatchReason
    let noMatchReason: string | null = null;
    if (noMatch) {
      if (scored.length === 0) {
        noMatchReason = parsed.category
          ? `ไม่พบ supplier ใน category "${parsed.category}" ที่ตรงกับ query นี้`
          : "ไม่พบ supplier ที่ตรงกับ query นี้ใน Platform";
      } else {
        noMatchReason = `เจอ supplier ใกล้เคียง ${scored.length} รายแต่ confidence สูงสุด ${(topConfidence * 100).toFixed(0)}% — ต่ำกว่า threshold ${(MIN_CONFIDENCE * 100).toFixed(0)}% (ไม่ตรง product/tag จริง)`;
      }
    }

    // Stage 5: Generate reasoning + cascade with Gemini (smart fallback if quota exceeded)
    const { cascade, reasoning, latencyMs: cascadeLatency, isMock: cascadeMock } = await generateCascade(query, parsed, citations);

    // Stage 6: Detect supply gaps → Patrick Opportunities
    const opportunities = detectOpportunities(cascade, suppliers, parsed, matched);

    // Stage 7: Log search for acquisition intelligence (best-effort, async, non-blocking)
    void logSearch({
      query_text: query,
      side: "demand",
      parsed_category: parsed.category,
      parsed_product: parsed.product?.slice(0, 200),
      parsed_destination: parsed.region,
      parsed_quantity: parsed.quantity,
      language: parsed.language,
      matched_count: matched.length,
      top_confidence: topConfidence,
      no_match: noMatch,
      meta: {
        weak_match_count: weakMatches.length,
        used_vector: usingVectorCitations,
        vector_hints: vectorSupplierHints.length,
      },
    });

    return NextResponse.json({
      query,
      parsed,
      matched,
      weakMatches,
      noMatch,
      noMatchReason,
      citations,
      reasoning,
      cascade,
      opportunities,
      meta: {
        totalMs: Date.now() - start,
        parseLatencyMs: parseLatency,
        cascadeLatencyMs: cascadeLatency,
        supplierSource,
        supplierCount: suppliers.length,
        usingMockGemini: parseMock || cascadeMock,
        usingVectorSearch: usingVectorCitations,
        vectorSupplierHints: vectorSupplierHints.length,
        opportunityCount: opportunities.length,
        topConfidence,
        threshold: MIN_CONFIDENCE,
        searchLogged: true,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
