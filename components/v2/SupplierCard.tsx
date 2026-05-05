import Link from "next/link";
import type { Supplier } from "@/lib/db/types";
import { getCommissionTier, formatRate } from "@/lib/commission";

const CATEGORY_EMOJI: Record<string, string> = {
  agriculture: "🌾",
  craft: "🎨",
  manufacturing: "🏭",
  seafood: "🐟",
  textile: "🧵",
  beverage: "🍵",
  wellness: "🌿",
};

const CATEGORY_LABEL_TH: Record<string, string> = {
  agriculture: "เกษตร",
  craft: "งานหัตถกรรม",
  manufacturing: "การผลิต",
  seafood: "อาหารทะเล",
  textile: "สิ่งทอ",
  beverage: "เครื่องดื่ม",
  wellness: "สุขภาพ",
};

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  const commission = getCommissionTier(supplier);
  return (
    <Link
      href={`/suppliers/${supplier.id}`}
      className="card card-hover block group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cream-200 flex items-center justify-center text-2xl">
            {CATEGORY_EMOJI[supplier.category] ?? "📦"}
          </div>
          <div>
            <div className="font-semibold text-ink leading-tight group-hover:text-sage-700 transition-colors">
              {supplier.name_th ?? supplier.name}
            </div>
            <div className="text-xs text-ink-muted mt-0.5">
              {CATEGORY_LABEL_TH[supplier.category] ?? supplier.category} · {supplier.region}
            </div>
          </div>
        </div>
        {supplier.verified && (
          <span className="verified-tick" title="ตรวจสอบแล้ว">✓</span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-ink-soft line-clamp-2 leading-relaxed mb-4">
        {supplier.description_th ?? supplier.description}
      </p>

      {/* 4 trust signals row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <Signal label="Tier" value={supplier.tier} highlight={supplier.patrick_circle} />
        <Signal
          label="ผลงาน"
          value={`${supplier.performance_score}`}
          sub="/100"
        />
        <Signal
          label="รีวิว"
          value={supplier.review_avg.toFixed(1)}
          sub={`(${supplier.review_count})`}
        />
        <Signal
          label="ดีล"
          value={`${supplier.past_deals_count}`}
        />
      </div>

      {/* Footer: Patrick badge + commission preview */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <div className="flex items-center gap-2">
          {supplier.patrick_circle && (
            <span className="pill-sage">⭐ วงในของ Patrick</span>
          )}
          <span className={`pill ${commission.badge_color}`}>{commission.label_th}</span>
        </div>
        <span className="text-xs text-ink-muted">
          ค่าธรรมเนียม <span className="font-semibold text-ink">{formatRate(commission.rate)}</span>
        </span>
      </div>
    </Link>
  );
}

function Signal({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-base font-semibold ${highlight ? "text-sage-600" : "text-ink"}`}>
        {value}
        {sub && <span className="text-xs text-ink-muted font-normal">{sub}</span>}
      </div>
      <div className="text-[10px] text-ink-muted uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  );
}
