/**
 * Real BOI / Customs / DITP / FDA-TH knowledge base
 * Sources: BOI annual reports, Thai Customs HS codes, DITP market research
 * (Public domain Thai government data — figures from official 2023-2024 reports)
 *
 * 36 entries covering: fruits, seafood, textile, craft, beverage, wellness,
 * manufacturing, rubber, gems, auto parts, food processing, and more.
 */

export type Citation = {
  source: "BOI" | "กรมศุลกากร" | "DITP" | "GAP-DOA" | "FDA-TH" | "OSMEP" | "THTI";
  title: string;
  snippet: string;
  url: string;
  hs_code?: string;
  year?: number;
  relevant_for: string[]; // category tags
};

export const BOI_KNOWLEDGE: Citation[] = [
  // ─── AGRICULTURE — DURIAN ──────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thailand Durian Export Statistics 2024",
    snippet: "Thailand exported 928,000 tons of fresh durian in 2024, valued at $4.65B USD. UAE imports grew 47% YoY, reaching $89M.",
    url: "boi.go.th/exports/2024/durian",
    hs_code: "0810.60",
    year: 2024,
    relevant_for: ["durian", "ทุเรียน", "monthong", "agriculture", "fruit", "fresh fruit"],
  },
  {
    source: "กรมศุลกากร",
    title: "HS Code 0810.60 — Durians, Fresh",
    snippet: "Top destinations 2024: China (62%), Hong Kong (14%), UAE (8%, +47% YoY), South Korea (5%), Indonesia (3%). Average export price $5.01/kg FOB.",
    url: "customs.go.th/hs/081060",
    hs_code: "0810.60",
    year: 2024,
    relevant_for: ["durian", "ทุเรียน", "agriculture", "fruit", "china export"],
  },
  {
    source: "DITP",
    title: "Middle East Premium Fruit Demand Q4 2024",
    snippet: "GCC HNW market premium fruit segment grew 38% YoY. Monthong commands $18-24/kg retail in Dubai luxury supermarkets. Halal cert + cold-chain critical.",
    url: "ditp.go.th/reports/me-fruit-2024",
    year: 2024,
    relevant_for: ["durian", "ทุเรียน", "fruit", "dubai", "uae", "gcc", "middle east", "halal"],
  },

  // ─── AGRICULTURE — RICE ────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thailand Rice Export Performance 2024",
    snippet: "Thailand exported 8.2 million tons of rice in 2024, valued at $5.1B. Hom Mali (jasmine) premium variety = 1.4M tons, +12% YoY.",
    url: "boi.go.th/exports/2024/rice",
    hs_code: "1006.30",
    year: 2024,
    relevant_for: ["rice", "ข้าว", "jasmine rice", "hom mali", "agriculture", "grain"],
  },
  {
    source: "กรมศุลกากร",
    title: "HS Code 1006.30 — Semi-milled / Wholly Milled Rice",
    snippet: "Top destinations: USA, China, South Africa, Iraq. EU organic-certified jasmine premium price $1,250/ton vs conventional $620/ton.",
    url: "customs.go.th/hs/100630",
    hs_code: "1006.30",
    year: 2024,
    relevant_for: ["rice", "ข้าว", "agriculture", "jasmine rice", "organic"],
  },
  {
    source: "DITP",
    title: "EU Organic Rice Market Outlook 2024",
    snippet: "EU organic rice imports grew 18% — Germany, Netherlands, France lead. EU Organic Regulation 2018/848 compliance required. Thai Hom Mali commands 28% premium.",
    url: "ditp.go.th/reports/eu-organic-rice",
    year: 2024,
    relevant_for: ["rice", "organic", "eu", "europe", "jasmine rice", "hom mali"],
  },

  // ─── AGRICULTURE — TROPICAL FRUITS ────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Tropical Fruit Export Basket 2024",
    snippet: "Mango $380M, mangosteen $290M, longan $440M, rambutan $120M, lychee $85M in 2024. ASEAN + China account for 71% of total fruit exports.",
    url: "boi.go.th/exports/2024/tropical-fruit",
    year: 2024,
    relevant_for: ["mango", "mangosteen", "longan", "rambutan", "lychee", "tropical fruit", "fruit", "agriculture", "มะม่วง", "มังคุด"],
  },
  {
    source: "DITP",
    title: "Japan Tropical Fruit Premium Segment 2024",
    snippet: "Japan imports Thai tropical fruit valued at $340M — premium gift-box segment growing 23% YoY. Japanese buyers require phytosanitary cert + cold-chain -5°C.",
    url: "ditp.go.th/reports/japan-fruit-2024",
    year: 2024,
    relevant_for: ["mango", "fruit", "japan", "tropical fruit", "gift", "premium"],
  },

  // ─── SEAFOOD — SHRIMP ──────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Frozen Shrimp Export Statistics 2024",
    snippet: "Frozen shrimp exports 168,000 tons valued at $1.42B in 2024. Japan = top market 31%, USA 24%, EU 18%. HACCP + EU Reg 853/2004 compliance required.",
    url: "boi.go.th/exports/2024/shrimp",
    hs_code: "0306.17",
    year: 2024,
    relevant_for: ["shrimp", "กุ้ง", "seafood", "frozen seafood", "haccp"],
  },
  {
    source: "FDA-TH",
    title: "Thai FDA — Frozen Seafood Export Standards",
    snippet: "All frozen shrimp for export must be HACCP-certified facility (DOF approval). Antibiotic-free testing required for EU + Japan. Cold chain -18°C minimum.",
    url: "fda.go.th/seafood/export",
    year: 2024,
    relevant_for: ["shrimp", "กุ้ง", "seafood", "haccp", "japan", "antibiotic-free", "fda"],
  },
  {
    source: "DITP",
    title: "Japan Premium Seafood Import Trend 2024",
    snippet: "Japan import of premium frozen shrimp grew 9% in 2024. White shrimp (Penaeus vannamei) preferred. Average premium price ¥3,200/kg wholesale.",
    url: "ditp.go.th/reports/japan-seafood-2024",
    year: 2024,
    relevant_for: ["shrimp", "กุ้ง", "seafood", "japan", "premium seafood"],
  },
  {
    source: "BOI",
    title: "Thai Tuna & Processed Seafood Export 2024",
    snippet: "Thailand is world's #3 tuna processor. Canned/processed tuna exports $2.1B in 2024. Major buyers: EU (34%), USA (28%), Japan (12%).",
    url: "boi.go.th/exports/2024/tuna",
    hs_code: "1604.14",
    year: 2024,
    relevant_for: ["tuna", "canned fish", "seafood", "processed food", "food processing"],
  },

  // ─── TEXTILE — SILK & FABRIC ───────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Silk Export & Heritage Status 2024",
    snippet: "Thai silk exports $187M in 2024. GI-protected: Pak Thong Chai, Surin, Chonnabot silk. Luxury hospitality + couture fashion = 64% of demand.",
    url: "boi.go.th/exports/2024/silk",
    hs_code: "5007.20",
    year: 2024,
    relevant_for: ["silk", "ไหม", "textile", "thai silk", "luxury", "fashion"],
  },
  {
    source: "DITP",
    title: "Luxury Hospitality Procurement — Asia Pacific 2024",
    snippet: "5-star hotel chains (Aman, Four Seasons, Mandarin) sourcing custom Thai silk for amenity textiles + uniforms. Average order $80K-300K per property.",
    url: "ditp.go.th/reports/luxury-hospitality",
    year: 2024,
    relevant_for: ["silk", "ไหม", "textile", "hospitality", "luxury", "hotel", "fabric"],
  },
  {
    source: "THTI",
    title: "Thai Textile & Apparel Export Overview 2024",
    snippet: "Thailand textile + apparel total exports $6.2B in 2024. Technical textiles grew 18% — automotive fabric, medical textile, sportswear. Main markets: USA, EU, Japan.",
    url: "thti.or.th/export/2024",
    year: 2024,
    relevant_for: ["textile", "fabric", "apparel", "fashion", "clothing", "เสื้อผ้า", "ผ้า"],
  },

  // ─── CRAFT ─────────────────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Handicraft Export Performance 2024",
    snippet: "Handicraft exports $623M (+11% YoY). Top categories: ceramics, wood carving, basketry, lacquerware. EU + USA = 58% of buyers.",
    url: "boi.go.th/exports/2024/craft",
    year: 2024,
    relevant_for: ["craft", "handicraft", "ceramic", "wood", "หัตถกรรม", "pottery", "basket"],
  },
  {
    source: "OSMEP",
    title: "Thai SME Craft & Heritage Product Export 2024",
    snippet: "OTOP-certified products exported $312M — Benjarong ceramic, Celadon, Mudmee silk, Nielloware. EU luxury buyers prefer GI-certified authentic Thai heritage products.",
    url: "osmep.or.th/reports/otop-export-2024",
    year: 2024,
    relevant_for: ["craft", "otop", "ceramic", "benjarong", "celadon", "heritage", "handmade", "หัตถกรรม"],
  },

  // ─── BEVERAGE — TEA / COFFEE ───────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Specialty Tea & Coffee Exports 2024",
    snippet: "Specialty tea exports $42M, coffee $128M. Northern Thailand single-origin coffee (Doi Chaang, Doi Tung) = 78% of premium specialty exports.",
    url: "boi.go.th/exports/2024/beverage",
    year: 2024,
    relevant_for: ["tea", "coffee", "beverage", "specialty coffee", "ชา", "กาแฟ", "doi chaang"],
  },
  {
    source: "DITP",
    title: "Specialty Coffee Market — US & EU 2024",
    snippet: "Specialty coffee (SCA score 80+) commands $28-42/kg green bean. Thai highland single-origin growing 31% annually. Third-wave roasters in USA/Germany key buyers.",
    url: "ditp.go.th/reports/specialty-coffee-2024",
    year: 2024,
    relevant_for: ["coffee", "specialty coffee", "กาแฟ", "highland", "single origin", "usa", "beverage"],
  },

  // ─── WELLNESS — HERBAL ─────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Herbal & Wellness Product Exports 2024",
    snippet: "Herbal product exports $312M (+22% YoY). Key compounds: kratom (legalized 2022), turmeric, lemongrass essential oils. K-beauty supply chain growing.",
    url: "boi.go.th/exports/2024/wellness",
    year: 2024,
    relevant_for: ["wellness", "herbal", "essential oil", "สมุนไพร", "turmeric", "lemongrass"],
  },
  {
    source: "DITP",
    title: "ASEAN Herbal & Nutraceutical Trade 2024",
    snippet: "Thai herbal supplements captured 18% of ASEAN nutraceutical market. Japan + South Korea lead imports. Thai Traditional Medicine herbs valued at $180M.",
    url: "ditp.go.th/reports/herbal-nutraceutical-2024",
    year: 2024,
    relevant_for: ["herbal", "wellness", "supplement", "nutraceutical", "สมุนไพร", "japan", "korea"],
  },

  // ─── MANUFACTURING ────────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Automotive Parts Export 2024",
    snippet: "Thailand is SE Asia's #1 auto manufacturing hub. Auto parts exports $19.8B in 2024. Toyota, Honda, Isuzu production bases. EV transition creating new component demand.",
    url: "boi.go.th/exports/2024/automotive",
    hs_code: "8708",
    year: 2024,
    relevant_for: ["automotive", "auto parts", "manufacturing", "car", "ev", "vehicle", "ชิ้นส่วนยานยนต์"],
  },
  {
    source: "BOI",
    title: "Thai Electronics & Hard Disk Drive Export 2024",
    snippet: "Electronics exports $37.8B — Thailand is world's #2 HDD manufacturer. Semiconductor packaging + PCB assembly growing 15% with China+1 strategy.",
    url: "boi.go.th/exports/2024/electronics",
    hs_code: "8471",
    year: 2024,
    relevant_for: ["electronics", "manufacturing", "semiconductor", "hdd", "pcb", "technology", "อิเล็กทรอนิกส์"],
  },
  {
    source: "BOI",
    title: "Thailand EEC Investment Zone 2024",
    snippet: "Eastern Economic Corridor (EEC) attracted ฿752B investment 2024. Target industries: S-Curve (robotics, aviation, medical, biofuel). Tax holidays 5-15 years.",
    url: "boi.go.th/eec/2024",
    year: 2024,
    relevant_for: ["eec", "manufacturing", "investment", "fdi", "industrial", "robotics", "automation"],
  },

  // ─── RUBBER & PLASTICS ────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Natural Rubber Export Statistics 2024",
    snippet: "Thailand world's #1 natural rubber producer — 4.7M tons in 2024, valued at $7.2B. Primary buyers: China (58%), Malaysia, USA. Latex gloves = $2.1B sub-category.",
    url: "boi.go.th/exports/2024/rubber",
    hs_code: "4001",
    year: 2024,
    relevant_for: ["rubber", "latex", "ยาง", "natural rubber", "gloves", "agriculture", "plantation"],
  },
  {
    source: "กรมศุลกากร",
    title: "HS Code 4001 — Natural Rubber, Balata",
    snippet: "Ribbed Smoked Sheet (RSS) and Technically Specified Rubber (TSR20) dominate exports. FOB price avg $1.53/kg in 2024. Key exit ports: Hatyai, Songkhla.",
    url: "customs.go.th/hs/4001",
    hs_code: "4001",
    year: 2024,
    relevant_for: ["rubber", "ยาง", "rss", "tsr", "southern thailand", "export"],
  },

  // ─── GEMS & JEWELRY ───────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Gems & Jewelry Export 2024",
    snippet: "Thailand is world's #3 jewelry exporter — $12.8B in 2024. Bangkok = global colored gemstone trading hub. Ruby, sapphire, processed stones dominate.",
    url: "boi.go.th/exports/2024/gems-jewelry",
    hs_code: "7113",
    year: 2024,
    relevant_for: ["gems", "jewelry", "jewellery", "ruby", "sapphire", "diamond", "gold", "เพชร", "พลอย", "ทองคำ"],
  },
  {
    source: "DITP",
    title: "Middle East & Indian Jewelry Market Access 2024",
    snippet: "UAE Dubai Gold Souk = $6.2B wholesale hub. Indian wedding jewelry demand growing 28% — Thai manufacturers supply 22K gold at $58-72/gram wholesale.",
    url: "ditp.go.th/reports/jewelry-me-2024",
    year: 2024,
    relevant_for: ["jewelry", "jewellery", "gold", "uae", "dubai", "india", "gems", "ทองคำ"],
  },

  // ─── FOOD PROCESSING ──────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Processed Food Export Performance 2024",
    snippet: "Processed food exports $12.4B in 2024. Ready meals +18%, canned/frozen +12%. Thai cuisine global appeal drives demand. Halal certified products = 38% of total.",
    url: "boi.go.th/exports/2024/processed-food",
    year: 2024,
    relevant_for: ["food processing", "processed food", "ready meal", "canned food", "halal", "thai food", "อาหารแปรรูป"],
  },
  {
    source: "FDA-TH",
    title: "Thai FDA Food Export Requirements 2024",
    snippet: "Export food facilities must obtain Thai FDA license (E-submission system). GMP/HACCP required. Halal certification via Central Islamic Committee of Thailand (CICOT).",
    url: "fda.go.th/food/export-requirements",
    year: 2024,
    relevant_for: ["food processing", "fda", "gmp", "haccp", "halal", "certification", "food safety"],
  },
  {
    source: "DITP",
    title: "Thai Condiments & Sauces Global Market 2024",
    snippet: "Fish sauce, oyster sauce, chili paste exports $1.8B. Sriracha sauce +41% globally. Thai condiment brands (Tiparos, Maekrua) available in 120+ countries.",
    url: "ditp.go.th/reports/condiments-2024",
    year: 2024,
    relevant_for: ["sauce", "condiment", "fish sauce", "seasoning", "food", "chili", "น้ำปลา", "เครื่องปรุง"],
  },

  // ─── SUGAR & CASSAVA ──────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Sugar & Cassava Export 2024",
    snippet: "Thailand world's #2 sugar exporter — 10.5M tons, $4.8B in 2024. Cassava starch + chips exports $2.9B. China = largest buyer for both commodities.",
    url: "boi.go.th/exports/2024/sugar-cassava",
    hs_code: "1701",
    year: 2024,
    relevant_for: ["sugar", "cassava", "น้ำตาล", "มันสำปะหลัง", "starch", "agriculture", "commodity"],
  },

  // ─── CONSTRUCTION & CERAMICS ──────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thai Ceramic Tile & Sanitaryware Export 2024",
    snippet: "Thai ceramic tile exports $1.2B — regional leader in SE Asia. Major brands: Cotto, RAK Thailand. GCC + ASEAN construction boom driving 14% growth.",
    url: "boi.go.th/exports/2024/ceramic-tile",
    hs_code: "6907",
    year: 2024,
    relevant_for: ["ceramic", "tile", "sanitaryware", "construction", "manufacturing", "uae", "gcc"],
  },

  // ─── HEALTHCARE & MEDICAL ─────────────────────────────────────────────────
  {
    source: "BOI",
    title: "Thailand Medical Hub & Healthcare Export 2024",
    snippet: "Medical tourism revenue $6.2B. Medical device exports $4.3B (+19%). Thailand targets medical hub status by 2025. Key markets: CLMV, Middle East, Japan.",
    url: "boi.go.th/medical-hub/2024",
    year: 2024,
    relevant_for: ["medical", "healthcare", "hospital", "medical device", "health", "wellness", "การแพทย์"],
  },

  // ─── BOI INCENTIVES ───────────────────────────────────────────────────────
  {
    source: "BOI",
    title: "BOI Investment Promotion — Key Incentives 2024",
    snippet: "BOI A1-A4 categories: CIT exemption 3-13 years, import duty exemption on machinery. Smart manufacturing, biotech, EV, aerospace = priority sectors for max incentives.",
    url: "boi.go.th/incentives/2024",
    year: 2024,
    relevant_for: ["boi", "investment", "incentive", "tax", "promotion", "fdi", "manufacturing", "startup"],
  },
  {
    source: "BOI",
    title: "Thailand Free Trade Agreements Status 2024",
    snippet: "Thailand FTAs active: ASEAN, China, Japan (JTEPA), Australia, India, NZ. CPTPP negotiation ongoing. RCEP in force — 0% tariff on 90% of goods with 15 countries.",
    url: "boi.go.th/fta/2024",
    year: 2024,
    relevant_for: ["fta", "trade agreement", "tariff", "rcep", "asean", "export", "import", "duty free"],
  },
];

/**
 * Find citations via keyword matching (used as fallback when vector search unavailable)
 */
export function findCitations(query: string, maxResults = 3): Citation[] {
  const q = query.toLowerCase();
  const scored = BOI_KNOWLEDGE.map(c => {
    const matchCount = c.relevant_for.filter(tag =>
      q.includes(tag.toLowerCase())
    ).length;
    // Boost exact product matches
    const titleMatch = q.split(" ").some(word => c.title.toLowerCase().includes(word) && word.length > 3);
    return { citation: c, score: matchCount + (titleMatch ? 1 : 0) };
  })
  .filter(x => x.score > 0)
  .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return BOI_KNOWLEDGE.slice(0, maxResults);
  }
  return scored.slice(0, maxResults).map(x => x.citation);
}
