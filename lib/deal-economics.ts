/**
 * Deal Economics Calculator
 *
 * Realistic per-category cost templates based on Thai export data:
 *  - BOI 2024 export prices (FOB)
 *  - กรมศุลกากร HS code values
 *  - Industry benchmarks for cold chain, freight, certification
 *
 * Computes 3-sided P&L: Supplier · Platform · Buyer
 * Plus optimal deal suggestion that maximizes all parties.
 */

import type { Supplier, SupplierCategory } from "./db/types";

export type CostLine = { label: string; amount: number; note?: string };
export type Verdict = "excellent" | "fair" | "marginal";

export type DealEconomics = {
  dealValue: {
    product: string;
    quantity: number;
    unit: string;
    pricePerUnitFOB: number; // USD
    totalFOB_USD: number;
    totalFOB_THB: number;
    incoterm: "FOB" | "CIF" | "DAP";
    fxRate: number;
  };
  supply: {
    revenueUSD: number;
    costs: CostLine[];
    totalCostUSD: number;
    netProfitUSD: number;
    marginPct: number;
    verdict: Verdict;
    rationale: string;
  };
  platform: {
    commission: CostLine;
    referrals: CostLine[];
    subscription: CostLine | null;
    totalRevenueUSD: number;
    monetizedLayers: number;
  };
  buyer: {
    fobCostUSD: number;
    additionalCosts: CostLine[];
    landedCostUSD: number;
    expectedResellUSD: number;
    grossProfitUSD: number;
    marginPct: number;
    verdict: Verdict;
    rationale: string;
  };
  context: {
    marketBenchmark: string;
    seasonality: string;
    risks: string[];
    opportunities: string[];
  };
  suggestion: {
    headline: string;
    adjustments: { area: string; from: string; to: string; reason: string }[];
    winSupply: string;
    winPlatform: string;
    winBuyer: string;
  };
};

// ── Category economic templates ──────────────────────────────────────────
type CategoryTemplate = {
  unit: string;
  fobPriceRange: [number, number]; // USD per unit
  cogsPct: number;                  // production cost as % of FOB
  packagingPctFOB: number;
  localLogisticsPct: number;
  inspectionPct: number;
  certPct: number;
  freightToBuyer: { sea: number; air?: number }; // USD per unit
  insurancePct: number; // % of FOB value
  importDuty: (destination: string) => number; // % rate
  destCustoms: number; // USD per unit
  destColdChain: number; // USD per unit
  destLastMile: number; // USD per unit
  resellMultiplier: { low: number; high: number }; // FOB → retail
  defaultQty: number;
};

const TEMPLATES: Record<SupplierCategory, CategoryTemplate> = {
  agriculture: {
    unit: "kg",
    fobPriceRange: [4.5, 6.0],
    cogsPct: 0.50,
    packagingPctFOB: 0.06,
    localLogisticsPct: 0.04,
    inspectionPct: 0.015,
    certPct: 0.02,
    freightToBuyer: { sea: 0.50 },
    insurancePct: 0.003,
    importDuty: (dest) => {
      if (/uae|ดูไบ|dubai|gcc|saudi/i.test(dest)) return 0;
      if (/china|จีน/i.test(dest)) return 0; // RCEP 0% for fresh fruit
      if (/japan|ญี่ปุ่น/i.test(dest)) return 0.06;
      if (/eu|europe|ยุโรป/i.test(dest)) return 0.085;
      return 0.05;
    },
    destCustoms: 0.10,
    destColdChain: 0.30,
    destLastMile: 0.40,
    resellMultiplier: { low: 3.0, high: 5.0 }, // luxury markets like Dubai
    defaultQty: 50000, // 50 tons in kg
  },
  seafood: {
    unit: "kg",
    fobPriceRange: [8.5, 12.0],
    cogsPct: 0.55,
    packagingPctFOB: 0.05,
    localLogisticsPct: 0.04,
    inspectionPct: 0.02,
    certPct: 0.025,
    freightToBuyer: { sea: 0.85 },
    insurancePct: 0.005,
    importDuty: (dest) => {
      if (/japan|ญี่ปุ่น/i.test(dest)) return 0;
      if (/usa|us|america/i.test(dest)) return 0;
      if (/eu|europe/i.test(dest)) return 0.12;
      return 0.08;
    },
    destCustoms: 0.20,
    destColdChain: 0.45,
    destLastMile: 0.50,
    resellMultiplier: { low: 2.2, high: 3.5 },
    defaultQty: 100000,
  },
  textile: {
    unit: "meter",
    fobPriceRange: [85, 220],
    cogsPct: 0.40,
    packagingPctFOB: 0.03,
    localLogisticsPct: 0.02,
    inspectionPct: 0.01,
    certPct: 0.015,
    freightToBuyer: { sea: 0.20, air: 1.50 },
    insurancePct: 0.004,
    importDuty: (dest) => {
      if (/eu|europe/i.test(dest)) return 0.08;
      if (/usa|us/i.test(dest)) return 0.07;
      return 0.05;
    },
    destCustoms: 0.50,
    destColdChain: 0,
    destLastMile: 1.0,
    resellMultiplier: { low: 4.0, high: 8.0 }, // luxury fashion
    defaultQty: 1000,
  },
  craft: {
    unit: "piece",
    fobPriceRange: [25, 180],
    cogsPct: 0.35,
    packagingPctFOB: 0.08,
    localLogisticsPct: 0.04,
    inspectionPct: 0.01,
    certPct: 0.02,
    freightToBuyer: { sea: 1.50, air: 8.0 },
    insurancePct: 0.005,
    importDuty: (dest) => {
      if (/eu|europe/i.test(dest)) return 0.05;
      return 0.03;
    },
    destCustoms: 1.0,
    destColdChain: 0,
    destLastMile: 2.0,
    resellMultiplier: { low: 3.5, high: 6.0 },
    defaultQty: 500,
  },
  beverage: {
    unit: "kg",
    fobPriceRange: [22, 45],
    cogsPct: 0.42,
    packagingPctFOB: 0.07,
    localLogisticsPct: 0.03,
    inspectionPct: 0.015,
    certPct: 0.025,
    freightToBuyer: { sea: 0.40 },
    insurancePct: 0.003,
    importDuty: (dest) => {
      if (/usa|us/i.test(dest)) return 0;
      if (/eu|europe/i.test(dest)) return 0.075;
      return 0.04;
    },
    destCustoms: 0.30,
    destColdChain: 0.10,
    destLastMile: 0.50,
    resellMultiplier: { low: 4.0, high: 7.0 }, // specialty coffee 3rd-wave
    defaultQty: 5000,
  },
  wellness: {
    unit: "kg",
    fobPriceRange: [35, 120],
    cogsPct: 0.30,
    packagingPctFOB: 0.10,
    localLogisticsPct: 0.03,
    inspectionPct: 0.02,
    certPct: 0.04,
    freightToBuyer: { sea: 0.50, air: 4.0 },
    insurancePct: 0.005,
    importDuty: (dest) => {
      if (/japan|ญี่ปุ่น/i.test(dest)) return 0.045;
      if (/eu|europe/i.test(dest)) return 0.06;
      return 0.05;
    },
    destCustoms: 0.80,
    destColdChain: 0.20,
    destLastMile: 1.0,
    resellMultiplier: { low: 4.5, high: 8.0 },
    defaultQty: 2000,
  },
  manufacturing: {
    unit: "unit",
    fobPriceRange: [180, 850],
    cogsPct: 0.62,
    packagingPctFOB: 0.04,
    localLogisticsPct: 0.025,
    inspectionPct: 0.01,
    certPct: 0.018,
    freightToBuyer: { sea: 8.0 },
    insurancePct: 0.004,
    importDuty: (dest) => {
      if (/usa|us/i.test(dest)) return 0.025;
      if (/eu|europe/i.test(dest)) return 0.04;
      return 0.05;
    },
    destCustoms: 5.0,
    destColdChain: 0,
    destLastMile: 12.0,
    resellMultiplier: { low: 1.6, high: 2.4 }, // B2B markup smaller
    defaultQty: 200,
  },
};

// ── Helpers ────────────────────────────────────────────────────────────
const FX_USD_THB = 35.5; // approx 2026

function detectDestination(query: string): string {
  const q = query.toLowerCase();
  if (/ดูไบ|dubai/i.test(q)) return "Dubai (UAE)";
  if (/uae|gcc/i.test(q)) return "UAE / GCC";
  if (/saudi|ซาอุ/i.test(q)) return "Saudi Arabia";
  if (/japan|ญี่ปุ่น/i.test(q)) return "Japan";
  if (/eu|europe|ยุโรป|germany|france/i.test(q)) return "EU";
  if (/usa|america|us /i.test(q)) return "USA";
  if (/china|จีน/i.test(q)) return "China";
  if (/singapore|สิงคโปร์/i.test(q)) return "Singapore";
  if (/hong kong|ฮ่องกง/i.test(q)) return "Hong Kong";
  return "International";
}

function detectQuantity(query: string, defaultQty: number): number {
  // Try to extract from "50 ตัน", "100 tons", "200 kg"
  const tonMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:tons?|ตัน)/i);
  if (tonMatch) return parseFloat(tonMatch[1]) * 1000;
  const kgMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilogram|กิโล)/i);
  if (kgMatch) return parseFloat(kgMatch[1]);
  const meterMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:meter|เมตร|m\b)/i);
  if (meterMatch) return parseFloat(meterMatch[1]);
  const pieceMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:pieces?|ชิ้น|ใบ)/i);
  if (pieceMatch) return parseFloat(pieceMatch[1]);
  return defaultQty;
}

function verdict(marginPct: number, isLuxury: boolean): { v: Verdict; reason: string } {
  const threshold = isLuxury ? { excellent: 0.30, fair: 0.18 } : { excellent: 0.22, fair: 0.12 };
  if (marginPct >= threshold.excellent) return { v: "excellent", reason: `Margin ${(marginPct * 100).toFixed(1)}% สูงกว่า benchmark ${(threshold.excellent * 100).toFixed(0)}%` };
  if (marginPct >= threshold.fair) return { v: "fair", reason: `Margin ${(marginPct * 100).toFixed(1)}% อยู่ในระดับ acceptable` };
  return { v: "marginal", reason: `Margin ${(marginPct * 100).toFixed(1)}% ต่ำกว่า benchmark — เจรจาเงื่อนไขใหม่` };
}

function pickFOBPrice(template: CategoryTemplate, supplier: Supplier, query: string): number {
  // Patrick's Circle / Elite get higher price (they have brand premium)
  if (supplier.patrick_circle || supplier.tier === "Elite") return template.fobPriceRange[1];
  if (supplier.tier === "Pro") return (template.fobPriceRange[0] + template.fobPriceRange[1]) / 2;
  return template.fobPriceRange[0];
}

// ── Main calculator ─────────────────────────────────────────────────────
export function calculateDealEconomics(
  query: string,
  supplier: Supplier,
  parsedProduct?: string
): DealEconomics {
  const category = supplier.category;
  const tpl = TEMPLATES[category];
  const product = parsedProduct ?? supplier.tags[0] ?? supplier.name;
  const destination = detectDestination(query);
  const quantity = detectQuantity(query, tpl.defaultQty);

  const fobPriceUSD = pickFOBPrice(tpl, supplier, query);
  const totalFOB = fobPriceUSD * quantity;

  // ── SUPPLY SIDE P&L ──
  const cogs = totalFOB * tpl.cogsPct;
  const packaging = totalFOB * tpl.packagingPctFOB;
  const localLog = totalFOB * tpl.localLogisticsPct;
  const inspection = totalFOB * tpl.inspectionPct;
  const cert = totalFOB * tpl.certPct;
  const platformCommissionPct = 0.05; // 5% commission
  const platformCommission = totalFOB * platformCommissionPct;

  const supplyCosts: CostLine[] = [
    { label: "ต้นทุนผลิต (COGS)", amount: cogs, note: `${(tpl.cogsPct * 100).toFixed(0)}% ของ FOB` },
    { label: "Packaging + Materials", amount: packaging, note: `${(tpl.packagingPctFOB * 100).toFixed(1)}% ของ FOB` },
    { label: "Local Logistics → Port", amount: localLog, note: "ขนส่งสวน/โรงงาน → Laem Chabang/Hatyai" },
    { label: "Quality Inspection", amount: inspection, note: "ตรวจสอบคุณภาพก่อนส่ง" },
    { label: "Export Certification", amount: cert, note: "GAP / GlobalG.A.P. / Halal / etc." },
    { label: "ThailandGPT Commission", amount: platformCommission, note: `${(platformCommissionPct * 100).toFixed(0)}% commission` },
  ];

  const totalSupplyCost = supplyCosts.reduce((s, c) => s + c.amount, 0);
  const supplyNet = totalFOB - totalSupplyCost;
  const supplyMarginPct = supplyNet / totalFOB;
  const isLuxury = supplier.patrick_circle || supplier.tier === "Elite";
  const supplyVerdict = verdict(supplyMarginPct, isLuxury);

  // ── PLATFORM REVENUE ──
  const referrals: CostLine[] = [
    { label: "Cold Chain Logistics Referral", amount: totalFOB * 0.008, note: "0.8% × deal value" },
    { label: "Trade Finance Referral", amount: totalFOB * 0.005, note: "0.5% × L/C value" },
    { label: "Certification Referral", amount: 1500, note: "Flat fee per cert intro" },
    { label: "Quality Inspection Referral", amount: quantity * 0.003, note: "$0.003/unit inspected" },
  ];
  if (/uae|dubai|saudi|gcc|halal/i.test(query)) {
    referrals.push({ label: "Halal Cert Referral", amount: 2000, note: "CICOT certification intro" });
  }
  if (/japan|haccp/i.test(query)) {
    referrals.push({ label: "HACCP Audit Referral", amount: 3500, note: "DOF-approved auditor intro" });
  }

  const subscription: CostLine | null = supplier.patrick_circle
    ? { label: "Patrick's Circle Subscription", amount: 1000, note: "Premium tier monthly fee" }
    : null;

  const totalReferralRevenue = referrals.reduce((s, r) => s + r.amount, 0);
  const totalPlatformRevenue = platformCommission + totalReferralRevenue + (subscription?.amount ?? 0);
  const monetizedLayers = 1 + referrals.length + (subscription ? 1 : 0);

  // ── BUYER SIDE ──
  const dutyRate = tpl.importDuty(destination);
  const seaFreight = tpl.freightToBuyer.sea * quantity;
  const insurance = totalFOB * tpl.insurancePct;
  const duty = (totalFOB + seaFreight) * dutyRate;
  const customsBuyer = tpl.destCustoms * quantity;
  const coldChainDest = tpl.destColdChain * quantity;
  const lastMile = tpl.destLastMile * quantity;

  const buyerCosts: CostLine[] = [
    { label: `Sea Freight → ${destination}`, amount: seaFreight, note: `$${tpl.freightToBuyer.sea.toFixed(2)}/${tpl.unit}` },
    { label: "Marine Cargo Insurance", amount: insurance, note: `${(tpl.insurancePct * 100).toFixed(2)}% × FOB+Freight` },
    { label: `Import Duty (${(dutyRate * 100).toFixed(1)}%)`, amount: duty, note: dutyRate === 0 ? "Free trade agreement" : "destination tariff" },
    { label: "Destination Customs Clearance", amount: customsBuyer, note: "broker + filing fees" },
  ];
  if (coldChainDest > 0) buyerCosts.push({ label: "Cold Chain at Destination", amount: coldChainDest, note: "warehouse + reefer truck" });
  buyerCosts.push({ label: "Last-Mile Delivery", amount: lastMile, note: "to retail/distributor" });

  const totalBuyerAddCost = buyerCosts.reduce((s, c) => s + c.amount, 0);
  const landedCost = totalFOB + totalBuyerAddCost;

  // Expected resell — use mid of multiplier range
  const resellMult = (tpl.resellMultiplier.low + tpl.resellMultiplier.high) / 2;
  const expectedResell = totalFOB * resellMult;
  const buyerProfit = expectedResell - landedCost;
  const buyerMarginPct = buyerProfit / expectedResell;
  const buyerVerdict = verdict(buyerMarginPct, isLuxury);

  // ── CONTEXT ──
  const seasonality = category === "agriculture" ?
    /durian|ทุเรียน/i.test(query) ? "Peak: เม.ย. - ก.ค. (Q3 อยู่ในฤดูกาล)" : "Year-round with seasonal peaks"
    : "Year-round demand · ไม่ผูกฤดูกาล";

  const risks: string[] = [];
  if (category === "agriculture") risks.push("Weather risk (drought / flood) ก่อน harvest");
  if (category === "seafood") risks.push("Cold chain breach = total loss · ต้องมี backup reefer");
  if (dutyRate > 0.05) risks.push(`High import duty ${(dutyRate * 100).toFixed(1)}% — กระทบ buyer margin`);
  if (!supplier.patrick_circle) risks.push("ไม่ใช่ Patrick's Circle — ควรเพิ่ม buffer 10% ในการ negotiate");
  risks.push("FX risk USD/THB — แนะนำ hedge หรือ partial L/C");

  const opportunities: string[] = [];
  if (isLuxury) opportunities.push(`Premium positioning — รับ FOB price สูงสุดที่ $${tpl.fobPriceRange[1]}/${tpl.unit}`);
  if (/uae|dubai/i.test(query)) opportunities.push("UAE Halal premium = +15-25% over conventional");
  if (totalFOB > 200000) opportunities.push("Deal size ใหญ่พอที่จะเจรจา volume discount จาก freight forwarder");

  const marketBenchmark = `Retail in ${destination}: ~$${(expectedResell / quantity).toFixed(2)}/${tpl.unit} (${resellMult.toFixed(1)}x FOB)`;

  // ── OPTIMAL DEAL SUGGESTION ──
  const adjustments: { area: string; from: string; to: string; reason: string }[] = [];

  // If supplier margin < fair → recommend higher price
  if (supplyMarginPct < (isLuxury ? 0.18 : 0.12)) {
    const newPrice = fobPriceUSD * 1.08;
    adjustments.push({
      area: "ราคา FOB",
      from: `$${fobPriceUSD.toFixed(2)}/${tpl.unit}`,
      to: `$${newPrice.toFixed(2)}/${tpl.unit} (+8%)`,
      reason: "เพิ่มราคา 8% — supplier margin ขยับเข้า fair zone, buyer ยังคุ้ม",
    });
  }

  // If buyer margin > excellent → could negotiate better split
  if (buyerMarginPct > 0.40 && supplyMarginPct < 0.25) {
    adjustments.push({
      area: "Profit Split",
      from: `Supplier ${(supplyMarginPct * 100).toFixed(0)}% / Buyer ${(buyerMarginPct * 100).toFixed(0)}%`,
      to: "Re-negotiate FOB price up 5-10%",
      reason: "Buyer margin สูงมาก — supplier ควรได้ส่วนแบ่งเพิ่ม Patrick negotiate ได้",
    });
  }

  // Volume optimization
  if (quantity < tpl.defaultQty * 0.5) {
    adjustments.push({
      area: "Quantity",
      from: `${quantity.toLocaleString()} ${tpl.unit}`,
      to: `${(tpl.defaultQty).toLocaleString()} ${tpl.unit} (full container)`,
      reason: "Full container = ลด freight/unit 25-40% · ทุกฝ่ายได้ประโยชน์",
    });
  }

  // Incoterm optimization
  if (totalFOB > 100000) {
    adjustments.push({
      area: "Incoterm",
      from: "FOB Bangkok",
      to: "CIF Destination Port",
      reason: "Supplier เพิ่ม margin 2-3% (จัดการ freight เอง) · buyer ลด complexity",
    });
  }

  // Payment terms
  adjustments.push({
    area: "Payment Terms",
    from: "T/T 100% advance",
    to: "L/C at sight 70% + 30% on delivery",
    reason: "Reduce buyer cash risk · supplier มี bank guarantee · ทุกฝ่าย safer",
  });

  const headline = adjustments.length > 0
    ? `ปรับ ${adjustments.length} จุด เพื่อ win-win-win — เพิ่ม revenue ทุกฝ่าย ${(supplyMarginPct < 0.18 ? "5-12%" : "3-8%")}`
    : "ดีลปัจจุบันสมดุลแล้ว — recommend close ตามเงื่อนไขเดิม";

  const winSupply = supplyMarginPct < 0.20
    ? `Margin ขยับจาก ${(supplyMarginPct * 100).toFixed(0)}% → ~${((supplyMarginPct + 0.06) * 100).toFixed(0)}%`
    : `Lock margin ${(supplyMarginPct * 100).toFixed(0)}% + recurring deals`;
  const winPlatform = `Commission $${platformCommission.toFixed(0)} + ${monetizedLayers - 1} service referrals = $${totalPlatformRevenue.toFixed(0)} per deal`;
  const winBuyer = buyerMarginPct > 0.30
    ? `Margin ${(buyerMarginPct * 100).toFixed(0)}% — premium quality lock-in supply chain`
    : `Reliable supply + Patrick verification = ลด supplier risk = predictable resell`;

  return {
    dealValue: {
      product,
      quantity,
      unit: tpl.unit,
      pricePerUnitFOB: fobPriceUSD,
      totalFOB_USD: totalFOB,
      totalFOB_THB: totalFOB * FX_USD_THB,
      incoterm: "FOB",
      fxRate: FX_USD_THB,
    },
    supply: {
      revenueUSD: totalFOB,
      costs: supplyCosts,
      totalCostUSD: totalSupplyCost,
      netProfitUSD: supplyNet,
      marginPct: supplyMarginPct,
      verdict: supplyVerdict.v,
      rationale: supplyVerdict.reason,
    },
    platform: {
      commission: { label: `Platform Commission (${(platformCommissionPct * 100).toFixed(0)}%)`, amount: platformCommission },
      referrals,
      subscription,
      totalRevenueUSD: totalPlatformRevenue,
      monetizedLayers,
    },
    buyer: {
      fobCostUSD: totalFOB,
      additionalCosts: buyerCosts,
      landedCostUSD: landedCost,
      expectedResellUSD: expectedResell,
      grossProfitUSD: buyerProfit,
      marginPct: buyerMarginPct,
      verdict: buyerVerdict.v,
      rationale: buyerVerdict.reason,
    },
    context: {
      marketBenchmark,
      seasonality,
      risks,
      opportunities,
    },
    suggestion: {
      headline,
      adjustments,
      winSupply,
      winPlatform,
      winBuyer,
    },
  };
}
