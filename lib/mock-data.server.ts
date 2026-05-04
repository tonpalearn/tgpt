import "server-only";
import type { Supplier, KbDoc, MockDeal } from "./types";

/**
 * Server-only mock data for Stage 0 demo.
 *
 * IMPORTANT: All names, addresses, and details are FICTIONAL.
 * No real Patrick's network data should ever land in this file.
 * Per POC-SPEC.md §0 Scope Boundary.
 */

export const SUPPLIERS: Supplier[] = [
  {
    id: "sup-001",
    businessName: "สวนคุณวิชัย จันทบุรี",
    ownerName: "วิชัย ตันติเวชกุล",
    category: "agriculture",
    subCategory: "ทุเรียนหมอนทอง",
    region: "ภาคตะวันออก",
    province: "จันทบุรี",
    yearsInOperation: 28,
    description:
      "Third-generation durian orchard. Specialises in Monthong premium-grade for export. GAP + GlobalG.A.P. certified. Direct cold-chain to ports. Demo data — fictional supplier.",
    certifications: [
      { name: "GAP (กรมวิชาการเกษตร)", issuer: "Department of Agriculture", validUntil: "2027-03-15" },
      { name: "GlobalG.A.P.", issuer: "GLOBALG.A.P. Secretariat", validUntil: "2026-11-20" },
      { name: "Export License (จส.) — ทุเรียน", issuer: "DOA", validUntil: "2027-01-30" },
    ],
    capacity: "200 tonnes / month (peak season Apr–Aug)",
    pricePerUnit: "USD 4.20–5.80 / kg FOB Laem Chabang",
    tier: "elite",
    starRating: 4.9,
    verifiedAt: "2026-04-18",
    pastDealCount: 47,
    totalGmvUsd: 2_840_000,
    endorsedByPatrick: true,
    heroImagePrompt: "emerald-amber",
    hashtags: ["ทุเรียน", "Monthong", "Export-Ready", "Cold-Chain"],
  },
  {
    id: "sup-002",
    businessName: "Siam Premium Rice Cooperative",
    ownerName: "สมชาย พงษ์ประยูร",
    category: "agriculture",
    subCategory: "Hom Mali Jasmine Rice",
    region: "ภาคตะวันออกเฉียงเหนือ",
    province: "สุรินทร์",
    yearsInOperation: 19,
    description:
      "GI-protected Thai Hom Mali from Surin. Cooperative of 340 smallholder farmers. Organic-certified, traceable to plot. Halal-friendly mill. Demo data — fictional cooperative.",
    certifications: [
      { name: "GI Surin Hom Mali", issuer: "Department of Intellectual Property", validUntil: "2028-12-31" },
      { name: "USDA Organic", issuer: "USDA via Control Union", validUntil: "2026-09-12" },
      { name: "Halal (HCT)", issuer: "Halal Standard Institute Thailand", validUntil: "2026-08-22" },
    ],
    capacity: "1,200 tonnes / quarter",
    pricePerUnit: "USD 1,180–1,420 / tonne FOB",
    tier: "elite",
    starRating: 4.8,
    verifiedAt: "2026-03-29",
    pastDealCount: 31,
    totalGmvUsd: 4_120_000,
    endorsedByPatrick: true,
    heroImagePrompt: "amber-cream",
    hashtags: ["Hom-Mali", "GI-Surin", "Organic", "Halal"],
  },
  {
    id: "sup-003",
    businessName: "Chiang Rai Tea Atelier",
    ownerName: "อนุชา วงศ์กมลกิจ",
    category: "agriculture",
    subCategory: "Single-origin oolong & black tea",
    region: "ภาคเหนือ",
    province: "เชียงราย",
    yearsInOperation: 14,
    description:
      "High-altitude single-origin tea from Doi Mae Salong. Craft processing for hospitality and luxury retail. JAS Organic. Demo data.",
    certifications: [
      { name: "JAS Organic (Japan)", issuer: "Bureau Veritas", validUntil: "2027-02-14" },
      { name: "Rainforest Alliance", issuer: "Rainforest Alliance", validUntil: "2026-10-05" },
    ],
    capacity: "3,500 kg / month",
    pricePerUnit: "USD 28–140 / kg by grade",
    tier: "pro",
    starRating: 4.7,
    verifiedAt: "2026-04-02",
    pastDealCount: 22,
    totalGmvUsd: 680_000,
    endorsedByPatrick: false,
    heroImagePrompt: "emerald-deep",
    hashtags: ["Single-Origin", "Doi-Mae-Salong", "Hospitality"],
  },
  {
    id: "sup-004",
    businessName: "Phuket Sea Salt Refinery",
    ownerName: "ปนัดดา รักดี",
    category: "manufacturing",
    subCategory: "Artisan finishing salt",
    region: "ภาคใต้",
    province: "ภูเก็ต",
    yearsInOperation: 9,
    description:
      "Solar-evaporated Andaman sea salt. Hand-harvested fleur de sel. EU-importer ready. Demo data.",
    certifications: [
      { name: "EU Food Contact Certified", issuer: "Eurofins", validUntil: "2027-06-10" },
      { name: "ISO 22000", issuer: "BSI", validUntil: "2026-12-01" },
    ],
    capacity: "180 tonnes / year (premium grade)",
    pricePerUnit: "USD 8.40–22 / kg",
    tier: "trusted",
    starRating: 4.6,
    verifiedAt: "2026-04-11",
    pastDealCount: 14,
    totalGmvUsd: 215_000,
    endorsedByPatrick: false,
    heroImagePrompt: "cream-amber",
    hashtags: ["Fleur-de-Sel", "Andaman", "Hospitality"],
  },
  {
    id: "sup-005",
    businessName: "Lanna Silk Atelier",
    ownerName: "นันทนา ธีระพงศ์",
    category: "manufacturing",
    subCategory: "Handwoven Thai silk for luxury interiors",
    region: "ภาคเหนือ",
    province: "เชียงใหม่",
    yearsInOperation: 32,
    description:
      "Atelier of 18 master weavers. OTOP 5-star. Suppliers to two named European luxury hospitality groups. Demo data.",
    certifications: [
      { name: "OTOP 5-Star", issuer: "Community Development Department", validUntil: "2027-04-30" },
      { name: "Royal Project Affiliated", issuer: "Royal Project Foundation" },
    ],
    capacity: "Custom orders — 6–14 weeks lead time",
    pricePerUnit: "THB 12,000–48,000 / metre",
    tier: "elite",
    starRating: 5.0,
    verifiedAt: "2026-02-22",
    pastDealCount: 18,
    totalGmvUsd: 1_240_000,
    endorsedByPatrick: true,
    heroImagePrompt: "terracotta-emerald",
    hashtags: ["Handwoven", "Heritage", "Luxury-Interiors"],
  },
  {
    id: "sup-006",
    businessName: "Ratchaburi Coconut Estates",
    ownerName: "ปรีชา จันทร์เพ็ญ",
    category: "agriculture",
    subCategory: "Coconut water & MCT oil",
    region: "ภาคกลาง",
    province: "ราชบุรี",
    yearsInOperation: 11,
    description:
      "Vertically integrated coconut estate. Cold-pressed MCT facility. Aseptic packaging line. Demo data.",
    certifications: [
      { name: "FDA US Registered", issuer: "US FDA", validUntil: "2027-08-08" },
      { name: "BRCGS AA", issuer: "BRCGS", validUntil: "2026-11-30" },
    ],
    capacity: "12M units coconut water / year",
    pricePerUnit: "USD 0.42–0.78 / unit FOB",
    tier: "pro",
    starRating: 4.5,
    verifiedAt: "2026-03-14",
    pastDealCount: 26,
    totalGmvUsd: 1_580_000,
    endorsedByPatrick: false,
    heroImagePrompt: "cream-emerald",
    hashtags: ["Cold-Pressed", "Aseptic", "MCT"],
  },
];

export const KB_DOCS: KbDoc[] = [
  {
    id: "kb-001",
    category: "agriculture",
    subCategory: "ทุเรียน",
    language: "en",
    sourceType: "market",
    source: "Thai Customs Q2 2026 trade data (mock)",
    text: "Thai Monthong durian export FOB Laem Chabang Q2 2026: USD 4.10 — 5.95 / kg. UAE re-export demand up 18% YoY. Cold-chain capacity in Chanthaburi runs at 84% peak utilisation Apr–Aug.",
    freshnessDate: "2026-04-30",
  },
  {
    id: "kb-002",
    category: "agriculture",
    subCategory: "ทุเรียน",
    language: "en",
    sourceType: "expert",
    source: "Field interview, Chanthaburi orchard cooperative, Apr 2026 (mock)",
    text: "Premium Monthong grade for international buyers requires sugar content >32 brix and stem length >3cm. GAP-certified orchards command 12–18% premium. Top three trusted cold-chain forwarders for GCC corridor: redacted in mock.",
    freshnessDate: "2026-04-22",
  },
  {
    id: "kb-003",
    category: "agriculture",
    subCategory: "Hom Mali Rice",
    language: "en",
    sourceType: "law",
    source: "GI Protection Act updates (mock)",
    text: "GI Surin Hom Mali requires geographic origin within 17 designated districts. Mill must be GI-registered. EU import requires phytosanitary certification + bromide residue under 0.01 mg/kg.",
    freshnessDate: "2026-04-12",
  },
  {
    id: "kb-004",
    category: "manufacturing",
    subCategory: "Thai Silk",
    language: "en",
    sourceType: "market",
    source: "Luxury hospitality procurement benchmark 2026 (mock)",
    text: "European luxury hotel groups specify hand-loomed Thai silk for 4–6 month lead times at THB 14,000 — 42,000 / metre. Royal Project affiliation valued as authenticity proof.",
    freshnessDate: "2026-03-28",
  },
  {
    id: "kb-005",
    category: "agriculture",
    subCategory: "Coconut",
    language: "en",
    sourceType: "market",
    source: "Aseptic packaging capacity report (mock)",
    text: "Thai coconut water aseptic packaging capacity has expanded 22% YoY. FOB prices stable at USD 0.40 — 0.85 / unit. Major demand from Middle East and Northern Europe Q3 2026.",
    freshnessDate: "2026-04-15",
  },
];

export const MOCK_DEALS: MockDeal[] = [
  {
    id: "deal-001",
    buyerName: "Demo Buyer A — Dubai Family Office",
    buyerCountry: "AE",
    supplierId: "sup-001",
    status: "negotiating",
    amount: 285_000,
    currency: "USD",
    productDescription: "50 tonnes Monthong premium grade, FOB Laem Chabang, monthly Apr–Jul",
    createdAt: "2026-04-28",
    patrickSignOff: true,
  },
  {
    id: "deal-002",
    buyerName: "Demo Buyer B — Singapore Premium Grocer",
    buyerCountry: "SG",
    supplierId: "sup-002",
    status: "agreed",
    amount: 168_000,
    currency: "USD",
    productDescription: "120 tonnes Hom Mali GI Surin, organic certified, quarterly contract",
    createdAt: "2026-04-25",
    patrickSignOff: false,
  },
  {
    id: "deal-003",
    buyerName: "Demo Buyer C — London Tea House",
    buyerCountry: "GB",
    supplierId: "sup-003",
    status: "verifying",
    amount: 42_000,
    currency: "USD",
    productDescription: "180 kg single-origin oolong, hospitality grade, single shipment",
    createdAt: "2026-05-01",
    patrickSignOff: false,
  },
];

export function getSupplier(id: string): Supplier | undefined {
  return SUPPLIERS.find((s) => s.id === id);
}

export function getDeal(id: string): MockDeal | undefined {
  return MOCK_DEALS.find((d) => d.id === id);
}

export function getKbDocsForCategory(category: string, limit = 5): KbDoc[] {
  return KB_DOCS.filter((d) => d.category === category || d.subCategory.toLowerCase().includes(category.toLowerCase())).slice(0, limit);
}
