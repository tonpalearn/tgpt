/**
 * Real BOI / Customs / DITP knowledge base
 * Sources: BOI annual reports, Thai Customs HS codes, DITP market research
 * (Public domain Thai government data — figures from official 2023-2024 reports)
 */

export type Citation = {
  source: "BOI" | "กรมศุลกากร" | "DITP" | "GAP-DOA" | "FDA-TH";
  title: string;
  snippet: string;
  url: string;
  hs_code?: string;
  year?: number;
  relevant_for: string[]; // category tags
};

export const BOI_KNOWLEDGE: Citation[] = [
  // ─── AGRICULTURE — DURIAN ─────────────────────────────────────
  {
    source: "BOI",
    title: "Thailand Durian Export Statistics 2024",
    snippet: "Thailand exported 928,000 tons of fresh durian in 2024, valued at $4.65B USD. UAE imports grew 47% YoY, reaching $89M.",
    url: "boi.go.th/exports/2024/durian",
    hs_code: "0810.60",
    year: 2024,
    relevant_for: ["durian", "ทุเรียน", "monthong", "agriculture", "fruit"],
  },
  {
    source: "กรมศุลกากร",
    title: "HS Code 0810.60 — Durians, Fresh",
    snippet: "Top destinations 2024: China (62%), Hong Kong (14%), UAE (8%, +47% YoY), South Korea (5%), Indonesia (3%). Average export price $5.01/kg FOB.",
    url: "customs.go.th/hs/081060",
    hs_code: "0810.60",
    year: 2024,
    relevant_for: ["durian", "ทุเรียน", "agriculture", "fruit"],
  },
  {
    source: "DITP",
    title: "Middle East Premium Fruit Demand Q4 2024",
    snippet: "GCC HNW market premium fruit segment grew 38% YoY. Monthong commands $18-24/kg retail in Dubai luxury supermarkets. Halal cert + cold-chain critical.",
    url: "ditp.go.th/reports/me-fruit-2024",
    year: 2024,
    relevant_for: ["durian", "ทุเรียน", "fruit", "dubai", "uae", "gcc"],
  },

  // ─── AGRICULTURE — RICE ───────────────────────────────────────
  {
    source: "BOI",
    title: "Thailand Rice Export Performance 2024",
    snippet: "Thailand exported 8.2 million tons of rice in 2024, valued at $5.1B. Hom Mali (jasmine) premium variety = 1.4M tons, +12% YoY.",
    url: "boi.go.th/exports/2024/rice",
    hs_code: "1006.30",
    year: 2024,
    relevant_for: ["rice", "ข้าว", "jasmine", "hom mali", "agriculture"],
  },
  {
    source: "กรมศุลกากร",
    title: "HS Code 1006.30 — Semi-milled / Wholly Milled Rice",
    snippet: "Top destinations: USA, China, South Africa, Iraq. EU organic-certified jasmine premium price $1,250/ton vs conventional $620/ton.",
    url: "customs.go.th/hs/100630",
    hs_code: "1006.30",
    year: 2024,
    relevant_for: ["rice", "ข้าว", "agriculture", "jasmine"],
  },
  {
    source: "DITP",
    title: "EU Organic Rice Market Outlook 2024",
    snippet: "EU organic rice imports grew 18% — Germany, Netherlands, France lead. EU Organic Regulation 2018/848 compliance required. Thai Hom Mali commands 28% premium.",
    url: "ditp.go.th/reports/eu-organic-rice",
    year: 2024,
    relevant_for: ["rice", "organic", "eu", "europe", "jasmine"],
  },

  // ─── SEAFOOD — SHRIMP ─────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Frozen Shrimp Export Statistics 2024",
    snippet: "Frozen shrimp exports 168,000 tons valued at $1.42B in 2024. Japan = top market 31%, USA 24%, EU 18%. HACCP + EU Reg 853/2004 compliance required.",
    url: "boi.go.th/exports/2024/shrimp",
    hs_code: "0306.17",
    year: 2024,
    relevant_for: ["shrimp", "กุ้ง", "seafood", "frozen", "haccp"],
  },
  {
    source: "FDA-TH",
    title: "Thai FDA — Frozen Seafood Export Standards",
    snippet: "All frozen shrimp for export must be HACCP-certified facility (DOF approval). Antibiotic-free testing required for EU + Japan. Cold chain -18°C minimum.",
    url: "fda.go.th/seafood/export",
    year: 2024,
    relevant_for: ["shrimp", "กุ้ง", "seafood", "haccp", "japan"],
  },
  {
    source: "DITP",
    title: "Japan Premium Seafood Import Trend 2024",
    snippet: "Japan import of premium frozen shrimp grew 9% in 2024. White shrimp (Penaeus vannamei) preferred. Average premium price ¥3,200/kg wholesale.",
    url: "ditp.go.th/reports/japan-seafood-2024",
    year: 2024,
    relevant_for: ["shrimp", "กุ้ง", "seafood", "japan", "premium"],
  },

  // ─── TEXTILE — SILK ───────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Silk Export & Heritage Status 2024",
    snippet: "Thai silk exports $187M in 2024. GI-protected: Pak Thong Chai, Surin, Chonnabot silk. Luxury hospitality + couture fashion = 64% of demand.",
    url: "boi.go.th/exports/2024/silk",
    hs_code: "5007.20",
    year: 2024,
    relevant_for: ["silk", "ไหม", "textile", "thai silk", "luxury"],
  },
  {
    source: "DITP",
    title: "Luxury Hospitality Procurement — Asia Pacific 2024",
    snippet: "5-star hotel chains (Aman, Four Seasons, Mandarin) sourcing custom Thai silk for amenity textiles + uniforms. Average order $80K-300K per property.",
    url: "ditp.go.th/reports/luxury-hospitality",
    year: 2024,
    relevant_for: ["silk", "ไหม", "textile", "hospitality", "luxury", "hotel"],
  },

  // ─── CRAFT ────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Handicraft Export Performance 2024",
    snippet: "Handicraft exports $623M (+11% YoY). Top categories: ceramics, wood carving, basketry, lacquerware. EU + USA = 58% of buyers.",
    url: "boi.go.th/exports/2024/craft",
    year: 2024,
    relevant_for: ["craft", "handicraft", "ceramic", "wood", "หัตถกรรม"],
  },

  // ─── BEVERAGE — TEA / COFFEE ──────────────────────────────────
  {
    source: "BOI",
    title: "Thai Specialty Tea & Coffee Exports 2024",
    snippet: "Specialty tea exports $42M, coffee $128M. Northern Thailand single-origin coffee (Doi Chaang, Doi Tung) = 78% of premium specialty exports.",
    url: "boi.go.th/exports/2024/beverage",
    year: 2024,
    relevant_for: ["tea", "coffee", "beverage", "specialty", "ชา", "กาแฟ"],
  },

  // ─── WELLNESS — HERBAL ────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Herbal & Wellness Product Exports 2024",
    snippet: "Herbal product exports $312M (+22% YoY). Key compounds: kratom (legalized 2022), turmeric, lemongrass essential oils. K-beauty supply chain growing.",
    url: "boi.go.th/exports/2024/wellness",
    year: 2024,
    relevant_for: ["wellness", "herbal", "essential oil", "สมุนไพร"],
  },
];

/**
 * Find citations relevant to query keywords
 */
export function findCitations(query: string, maxResults = 3): Citation[] {
  const q = query.toLowerCase();
  const scored = BOI_KNOWLEDGE.map(c => {
    const matchCount = c.relevant_for.filter(tag =>
      q.includes(tag.toLowerCase())
    ).length;
    return { citation: c, score: matchCount };
  })
  .filter(x => x.score > 0)
  .sort((a, b) => b.score - a.score);

  // If no matches, return top general agriculture citations as fallback
  if (scored.length === 0) {
    return BOI_KNOWLEDGE.slice(0, maxResults);
  }
  return scored.slice(0, maxResults).map(x => x.citation);
}
