import type { Supplier } from "./db/types";

/**
 * Commission rate calculator — based on supplier's Performance Score
 * and Patrick's Circle membership. NOT a credit score (intentionally
 * avoids the term and the underlying regulation surface).
 *
 * Lower rate = better deal for the supplier (rewards trusted partners).
 */
export interface CommissionTier {
  label: string;
  label_th: string;
  rate: number;        // 0.030 = 3.0%
  min_score: number;
  badge_color: string; // tailwind class
}

export const COMMISSION_TIERS: CommissionTier[] = [
  { label: "Patrick's Circle", label_th: "วงในของ Patrick", rate: 0.030, min_score: 0, badge_color: "bg-emerald-100 text-emerald-800" },
  { label: "Top Performer",    label_th: "ผลงานยอดเยี่ยม",   rate: 0.035, min_score: 90, badge_color: "bg-sky-100 text-sky-800" },
  { label: "Reliable",         label_th: "น่าเชื่อถือ",         rate: 0.040, min_score: 75, badge_color: "bg-amber-100 text-amber-800" },
  { label: "Building",         label_th: "กำลังสร้างผลงาน",   rate: 0.045, min_score: 60, badge_color: "bg-orange-100 text-orange-800" },
  { label: "New Partner",      label_th: "พาร์ทเนอร์ใหม่",   rate: 0.050, min_score: 0,  badge_color: "bg-stone-100 text-stone-700" },
];

export function getCommissionTier(supplier: Pick<Supplier, "patrick_circle" | "performance_score">): CommissionTier {
  if (supplier.patrick_circle) return COMMISSION_TIERS[0];
  if (supplier.performance_score >= 90) return COMMISSION_TIERS[1];
  if (supplier.performance_score >= 75) return COMMISSION_TIERS[2];
  if (supplier.performance_score >= 60) return COMMISSION_TIERS[3];
  return COMMISSION_TIERS[4];
}

export function calculateCommission(amount_usd: number, supplier: Pick<Supplier, "patrick_circle" | "performance_score">) {
  const tier = getCommissionTier(supplier);
  return {
    tier,
    rate: tier.rate,
    amount_usd: Math.round(amount_usd * tier.rate * 100) / 100,
  };
}

export function formatRate(rate: number) {
  return `${(rate * 100).toFixed(1)}%`;
}
