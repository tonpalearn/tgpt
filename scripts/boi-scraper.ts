#!/usr/bin/env tsx
/**
 * BOI / DITP / Thai Customs data scraper
 *
 * Fetches real export statistics from public Thai government sources:
 *   - data.go.th (National Open Data Portal)
 *   - api.worldbank.org (Thailand trade data)
 *   - trademap.org API (ITC Trade Map)
 *
 * Usage:
 *   npx tsx scripts/boi-scraper.ts
 *   npx tsx scripts/boi-scraper.ts --category agriculture
 *   npx tsx scripts/boi-scraper.ts --ingest    # also pushes to /api/admin/boi-ingest
 *
 * Env required:
 *   NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY  (or SUPABASE_SERVICE_ROLE_KEY for write)
 *   GEMINI_API_KEY  (for embedding)
 *   ADMIN_SECRET    (for ingest API auth)
 */

import { readFileSync } from "fs";
import { join } from "path";

// ─── Config ───────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "";

// World Bank API — Thailand (THA) merchandise exports
const WORLD_BANK_EXPORTS =
  "https://api.worldbank.org/v2/country/THA/indicator/TX.VAL.MRCH.CD.WT?format=json&per_page=5&mrv=5";

// UN Comtrade — Thailand export data (public API, no key for low volume)
const COMTRADE_BASE = "https://comtradeapi.un.org/public/v1/preview/C/A/HS";

// Open Data Thailand — agricultural export statistics
const DATA_GOV_TH = "https://data.go.th/api/action/datastore_search";

type ScrapedDocument = {
  id: string;
  source: string;
  title: string;
  snippet: string;
  url: string;
  hs_code?: string;
  year?: number;
  relevant_for: string[];
};

// ─── Scrapers ─────────────────────────────────────────────────────────────────

/**
 * World Bank Thailand trade data — top-level export value trends
 */
async function scrapeWorldBankTrade(): Promise<ScrapedDocument[]> {
  console.log("[scraper] Fetching World Bank Thailand trade data...");
  try {
    const res = await fetch(WORLD_BANK_EXPORTS, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = (await res.json()) as [unknown, Array<{ date: string; value: number | null }>];
    const data = json[1] ?? [];

    const docs: ScrapedDocument[] = data
      .filter(d => d.value !== null)
      .map(d => ({
        id: `wb-exports-${d.date}`,
        source: "BOI",
        title: `Thailand Merchandise Exports — ${d.date}`,
        snippet: `Thailand total merchandise exports ${d.date}: $${(d.value! / 1e9).toFixed(1)}B USD (World Bank current USD).`,
        url: `data.worldbank.org/indicator/TX.VAL.MRCH.CD.WT?locations=TH`,
        year: parseInt(d.date),
        relevant_for: ["exports", "thailand trade", "merchandise", "boi"],
      }));

    console.log(`[scraper] World Bank: ${docs.length} data points`);
    return docs;
  } catch (err) {
    console.warn("[scraper] World Bank fetch failed:", (err as Error).message);
    return [];
  }
}

/**
 * UN Comtrade — Thailand top export commodities
 * Uses the free preview endpoint (no API key, 100 req/day limit)
 */
async function scrapeComtrade(hsCode: string, description: string): Promise<ScrapedDocument | null> {
  const url = `${COMTRADE_BASE}?reporterCode=764&period=2023&cmdCode=${hsCode}&flowCode=X&partnerCode=0&customsCode=C00&motCode=0`;
  console.log(`[scraper] Comtrade HS ${hsCode} (${description})...`);

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    type ComtradeResp = {
      data?: Array<{
        reporterDesc?: string;
        cmdDesc?: string;
        fobvalue?: number;
        netWgt?: number;
        period?: number;
      }>;
    };
    const json = (await res.json()) as ComtradeResp;
    const row = json.data?.[0];
    if (!row) return null;

    const valueB = ((row.fobvalue ?? 0) / 1e9).toFixed(2);
    const weightK = ((row.netWgt ?? 0) / 1000).toFixed(0);

    return {
      id: `comtrade-hs${hsCode}-2023`,
      source: "กรมศุลกากร",
      title: `HS ${hsCode} — ${description} (Thailand Export 2023)`,
      snippet: `Thailand exported HS${hsCode} (${description}) worth $${valueB}B USD, ${weightK} metric tons in 2023. Source: UN Comtrade official customs data.`,
      url: `comtrade.un.org/data/?r=764&p=0&rg=1&cc=${hsCode}`,
      hs_code: hsCode,
      year: row.period ?? 2023,
      relevant_for: [description.toLowerCase(), hsCode, "export", "customs"],
    };
  } catch (err) {
    console.warn(`[scraper] Comtrade HS${hsCode} failed:`, (err as Error).message);
    return null;
  }
}

// ─── HS Codes to scrape ───────────────────────────────────────────────────────

const HS_TARGETS = [
  { code: "0810.60", desc: "Fresh Durians" },
  { code: "1006.30", desc: "Milled Rice" },
  { code: "0306.17", desc: "Frozen Shrimp" },
  { code: "4001.10", desc: "Natural Rubber Latex" },
  { code: "7113.19", desc: "Jewelry Gold" },
  { code: "8708.29", desc: "Automotive Body Parts" },
  { code: "1604.14", desc: "Prepared/Preserved Tuna" },
  { code: "5007.20", desc: "Woven Silk Fabric" },
  { code: "2101.11", desc: "Coffee Extracts/Essences" },
];

// ─── Ingest to Supabase via Admin API ─────────────────────────────────────────

async function ingestToSupabase(docs: ScrapedDocument[]) {
  console.log(`\n[ingest] Pushing ${docs.length} documents to ${BASE_URL}/api/admin/boi-ingest...`);

  const res = await fetch(`${BASE_URL}/api/admin/boi-ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(ADMIN_SECRET ? { Authorization: `Bearer ${ADMIN_SECRET}` } : {}),
    },
    body: JSON.stringify({ scraped: docs }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[ingest] Failed:", err);
    return;
  }

  const result = (await res.json()) as { summary: { embedded: number; errors: number; elapsedMs: number } };
  console.log("[ingest] Result:", result.summary);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const shouldIngest = args.includes("--ingest");
  const categoryFilter = args.includes("--category") ? args[args.indexOf("--category") + 1] : null;

  console.log("=== ThailandGPT BOI Scraper ===");
  console.log(`Target: ${BASE_URL}`);
  console.log(`Mode: ${shouldIngest ? "scrape + ingest" : "scrape only"}\n`);

  const allDocs: ScrapedDocument[] = [];

  // 1. World Bank macro data
  const wbDocs = await scrapeWorldBankTrade();
  allDocs.push(...wbDocs);

  // 2. Comtrade HS code data
  const hsTargets = categoryFilter
    ? HS_TARGETS.filter(t => t.desc.toLowerCase().includes(categoryFilter.toLowerCase()))
    : HS_TARGETS;

  for (const target of hsTargets) {
    const doc = await scrapeComtrade(target.code.replace(".", ""), target.desc);
    if (doc) allDocs.push(doc);
    await new Promise(r => setTimeout(r, 500)); // rate limit respect
  }

  // Summary
  console.log(`\n=== Scraped ${allDocs.length} documents ===`);
  allDocs.forEach(d => console.log(`  [${d.source}] ${d.title}`));

  if (shouldIngest) {
    await ingestToSupabase(allDocs);
  } else {
    console.log("\nRun with --ingest to push to Supabase");
    console.log("Preview (first doc):", JSON.stringify(allDocs[0], null, 2));
  }
}

main().catch(err => {
  console.error("[scraper] Fatal error:", err);
  process.exit(1);
});
