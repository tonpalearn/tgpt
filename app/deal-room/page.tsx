"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";

type CostLine = { label: string; amount: number; note?: string };
type Verdict = "excellent" | "fair" | "marginal";

type DealEconomics = {
  dealValue: {
    product: string;
    quantity: number;
    unit: string;
    pricePerUnitFOB: number;
    totalFOB_USD: number;
    totalFOB_THB: number;
    incoterm: string;
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

type ApiResponse = {
  supplier: {
    id: string;
    name: string;
    tier: string;
    patrick_circle: boolean;
    category: string;
    region: string;
    certifications: string[];
    performance_score: number;
  };
  query: string;
  economics: DealEconomics;
};

function fmtUSD(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}
function fmtTHB(n: number) {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `฿${(n / 1000).toFixed(0)}K`;
  return `฿${n.toFixed(0)}`;
}
function fmtPct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const styles = {
    excellent: "bg-emerald-100 text-emerald-800 border-emerald-300",
    fair: "bg-amber-100 text-amber-800 border-amber-300",
    marginal: "bg-rose-100 text-rose-800 border-rose-300",
  };
  const labels = { excellent: "✅ คุ้มมาก", fair: "🟡 พอใช้", marginal: "⚠️ กระเทย" };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${styles[verdict]}`}>
      {labels[verdict]}
    </span>
  );
}

function PartyCard({
  title, icon, accentColor, revenue, costs, netLabel, netAmount, marginPct, verdict, rationale,
}: {
  title: string;
  icon: string;
  accentColor: string;
  revenue?: { label: string; amount: number };
  costs: CostLine[];
  netLabel: string;
  netAmount: number;
  marginPct?: number;
  verdict?: Verdict;
  rationale?: string;
}) {
  return (
    <div className={`card p-5 border-2 ${accentColor} h-full flex flex-col`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-bold text-lg text-ink">{title}</h3>
        </div>
        {verdict && <VerdictBadge verdict={verdict} />}
      </div>

      {revenue && (
        <div className="mb-3 pb-3 border-b border-stone-200">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-ink-soft">{revenue.label}</span>
            <span className="font-bold text-emerald-700 font-mono">{fmtUSD(revenue.amount)}</span>
          </div>
        </div>
      )}

      <div className="space-y-2 flex-1">
        {costs.map((c, i) => (
          <div key={i} className="flex justify-between items-baseline text-sm">
            <div className="flex-1 min-w-0 pr-2">
              <div className="text-ink truncate">{c.label}</div>
              {c.note && <div className="text-[10px] text-ink-muted leading-tight">{c.note}</div>}
            </div>
            <span className="font-mono text-rose-600 shrink-0">−{fmtUSD(c.amount)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t-2 border-stone-300">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-sm font-semibold text-ink">{netLabel}</span>
          <span className={`font-bold text-xl font-mono ${netAmount >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
            {fmtUSD(netAmount)}
          </span>
        </div>
        {marginPct !== undefined && (
          <div className="text-xs text-ink-muted">
            Margin: <span className="font-mono font-semibold">{fmtPct(marginPct)}</span>
          </div>
        )}
        {rationale && (
          <div className="mt-2 text-[11px] text-ink-soft italic leading-snug">{rationale}</div>
        )}
      </div>
    </div>
  );
}

function DealRoomContent() {
  const params = useSearchParams();
  const supplierId = params.get("supplier") ?? "";
  const query = params.get("query") ?? "";
  const product = params.get("product") ?? undefined;

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supplierId || !query) {
      setError("Missing supplier or query parameter");
      setLoading(false);
      return;
    }
    fetch("/api/deal-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierId, query, product }),
    })
      .then(async r => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error ?? "Failed");
        setData(j);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [supplierId, query, product]);

  if (loading) {
    return (
      <div className="container-soft py-20 text-center">
        <div className="inline-block w-12 h-12 border-4 border-sage-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-ink-muted">กำลังคำนวณ Deal Economics…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container-soft py-20 text-center">
        <h1 className="text-2xl font-bold text-rose-600 mb-2">เกิดข้อผิดพลาด</h1>
        <p className="text-ink-muted mb-6">{error}</p>
        <Link href="/demo" className="btn-secondary">← กลับไป Demo</Link>
      </div>
    );
  }

  const { supplier, economics } = data;
  const e = economics;

  return (
    <div className="container-soft py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Link href="/demo" className="text-xs text-ink-muted hover:text-ink">
            ← กลับไป Demo
          </Link>
          <h1 className="text-3xl font-bold text-ink mt-1">🤝 Deal Room</h1>
          <p className="text-sm text-ink-muted mt-1 italic">{`"${data.query}"`}</p>
        </div>
        <div className="card p-3 bg-sage-50 border border-sage-200 flex items-center gap-3">
          {supplier.patrick_circle && (
            <span className="px-2 py-1 bg-amber-500 text-white rounded-full text-xs font-bold">👑 Patrick&apos;s Circle</span>
          )}
          <div>
            <div className="font-bold text-ink">{supplier.name}</div>
            <div className="text-xs text-ink-muted">{supplier.tier} · {supplier.region} · score {supplier.performance_score}</div>
          </div>
        </div>
      </div>

      {/* Deal Value Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 bg-gradient-to-br from-ink via-sage-900 to-ink text-cream relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative">
          <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">มูลค่าดีล (Total Deal Value)</div>
          <div className="flex items-end gap-6 flex-wrap">
            <div>
              <div className="text-5xl font-bold font-mono text-amber-300">
                {fmtUSD(e.dealValue.totalFOB_USD)}
              </div>
              <div className="text-cream/70 text-sm mt-1">
                ≈ {fmtTHB(e.dealValue.totalFOB_THB)} (FX {e.dealValue.fxRate})
              </div>
            </div>
            <div className="text-cream/80 text-sm space-y-1">
              <div>📦 {e.dealValue.quantity.toLocaleString()} {e.dealValue.unit} × ${e.dealValue.pricePerUnitFOB.toFixed(2)}/{e.dealValue.unit}</div>
              <div>📋 Incoterm: <span className="font-semibold text-amber-300">{e.dealValue.incoterm}</span> Bangkok/Laem Chabang</div>
              <div>🏷️ Product: <span className="font-semibold">{e.dealValue.product}</span></div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3-Sided P&L */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Supply Side */}
        <PartyCard
          title="Supply Side"
          icon="🏭"
          accentColor="border-sage-400 bg-sage-50/50"
          revenue={{ label: "Revenue (FOB)", amount: e.supply.revenueUSD }}
          costs={e.supply.costs}
          netLabel="Net Profit (Supplier)"
          netAmount={e.supply.netProfitUSD}
          marginPct={e.supply.marginPct}
          verdict={e.supply.verdict}
          rationale={e.supply.rationale}
        />

        {/* Platform Fee */}
        <div className="card p-5 border-2 border-amber-400 bg-amber-50/50 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌉</span>
              <h3 className="font-bold text-lg text-ink">ThailandGPT Fee</h3>
            </div>
            <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold">{e.platform.monetizedLayers}-layer</span>
          </div>

          <div className="mb-3 pb-3 border-b border-stone-200">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-ink-soft">{e.platform.commission.label}</span>
              <span className="font-bold text-amber-700 font-mono">+{fmtUSD(e.platform.commission.amount)}</span>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold">Service Referrals</div>
            {e.platform.referrals.map((r, i) => (
              <div key={i} className="flex justify-between items-baseline text-sm">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-ink truncate">{r.label}</div>
                  {r.note && <div className="text-[10px] text-ink-muted">{r.note}</div>}
                </div>
                <span className="font-mono text-emerald-700 shrink-0">+{fmtUSD(r.amount)}</span>
              </div>
            ))}
            {e.platform.subscription && (
              <>
                <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold pt-2">Recurring</div>
                <div className="flex justify-between items-baseline text-sm">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="text-ink">{e.platform.subscription.label}</div>
                    {e.platform.subscription.note && <div className="text-[10px] text-ink-muted">{e.platform.subscription.note}</div>}
                  </div>
                  <span className="font-mono text-emerald-700">+{fmtUSD(e.platform.subscription.amount)}/mo</span>
                </div>
              </>
            )}
          </div>

          <div className="mt-4 pt-3 border-t-2 border-stone-300">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-semibold text-ink">Total Platform Revenue</span>
              <span className="font-bold text-xl font-mono text-amber-700">{fmtUSD(e.platform.totalRevenueUSD)}</span>
            </div>
            <div className="text-xs text-ink-muted">
              {fmtPct(e.platform.totalRevenueUSD / e.dealValue.totalFOB_USD)} ของ deal value
            </div>
            <div className="mt-2 text-[11px] text-ink-soft italic leading-snug">
              Monetize {e.platform.monetizedLayers} ทาง: commission + service referrals + subscription
            </div>
          </div>
        </div>

        {/* Buyer Side */}
        <div className="card p-5 border-2 border-sky-400 bg-sky-50/50 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              <h3 className="font-bold text-lg text-ink">Buyer Side</h3>
            </div>
            <VerdictBadge verdict={e.buyer.verdict} />
          </div>

          <div className="mb-3 pb-3 border-b border-stone-200">
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-ink-soft">FOB Cost (paid to supplier)</span>
              <span className="font-mono text-rose-600">−{fmtUSD(e.buyer.fobCostUSD)}</span>
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold">Additional Costs</div>
            {e.buyer.additionalCosts.map((c, i) => (
              <div key={i} className="flex justify-between items-baseline text-sm">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-ink truncate">{c.label}</div>
                  {c.note && <div className="text-[10px] text-ink-muted">{c.note}</div>}
                </div>
                <span className="font-mono text-rose-600 shrink-0">−{fmtUSD(c.amount)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t-2 border-stone-300 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-ink">Landed Cost</span>
              <span className="font-mono text-ink font-semibold">{fmtUSD(e.buyer.landedCostUSD)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink-soft">Expected Resell ({(e.buyer.expectedResellUSD / e.dealValue.totalFOB_USD).toFixed(1)}x)</span>
              <span className="font-mono text-emerald-700">{fmtUSD(e.buyer.expectedResellUSD)}</span>
            </div>
            <div className="flex justify-between items-baseline mt-2 pt-2 border-t">
              <span className="text-sm font-semibold text-ink">Buyer Gross Profit</span>
              <span className="font-bold text-xl font-mono text-emerald-700">{fmtUSD(e.buyer.grossProfitUSD)}</span>
            </div>
            <div className="text-xs text-ink-muted">
              Margin: <span className="font-mono font-semibold">{fmtPct(e.buyer.marginPct)}</span>
            </div>
            <div className="mt-1 text-[11px] text-ink-soft italic leading-snug">{e.buyer.rationale}</div>
          </div>
        </div>
      </motion.div>

      {/* Context Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="card p-4 bg-rose-50 border border-rose-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⚠️</span>
            <h3 className="font-bold text-rose-900">Risk Factors</h3>
          </div>
          <ul className="space-y-2 text-sm text-rose-900">
            {e.context.risks.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-rose-500 shrink-0">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4 bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h3 className="font-bold text-emerald-900">Opportunities</h3>
          </div>
          <ul className="space-y-2 text-sm text-emerald-900">
            {e.context.opportunities.length > 0 ? e.context.opportunities.map((o, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-emerald-500 shrink-0">•</span>
                <span>{o}</span>
              </li>
            )) : (
              <li className="text-emerald-700 italic">ไม่พบโอกาส premium เพิ่มเติมจาก deal นี้</li>
            )}
            <li className="flex gap-2 pt-2 mt-2 border-t border-emerald-200">
              <span className="text-emerald-500 shrink-0">📊</span>
              <span><strong>Market:</strong> {e.context.marketBenchmark}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 shrink-0">📅</span>
              <span><strong>Season:</strong> {e.context.seasonality}</span>
            </li>
          </ul>
        </div>
      </motion.div>

      {/* Optimal Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400"
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="font-bold text-xl text-amber-900">Optimal Deal Suggestion</h3>
            <p className="text-amber-800 text-sm mt-1">{e.suggestion.headline}</p>
          </div>
        </div>

        {e.suggestion.adjustments.length > 0 && (
          <div className="space-y-3 mb-5">
            {e.suggestion.adjustments.map((adj, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="rounded-2xl p-4 bg-white border border-amber-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold uppercase">
                    {adj.area}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-muted mb-1">From</div>
                    <div className="font-mono text-sm text-ink-soft line-through">{adj.from}</div>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl text-amber-500">→</span>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold mb-1">To</div>
                    <div className="font-mono text-sm font-bold text-emerald-700">{adj.to}</div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-100 text-xs text-ink-soft italic">
                  💡 {adj.reason}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Win-Win-Win */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t-2 border-amber-300">
          <div className="rounded-xl p-3 bg-sage-100 border border-sage-300">
            <div className="text-[10px] uppercase tracking-wider text-sage-700 font-bold mb-1">🏭 Supply Wins</div>
            <p className="text-xs text-sage-900">{e.suggestion.winSupply}</p>
          </div>
          <div className="rounded-xl p-3 bg-amber-100 border border-amber-300">
            <div className="text-[10px] uppercase tracking-wider text-amber-700 font-bold mb-1">🌉 Platform Wins</div>
            <p className="text-xs text-amber-900">{e.suggestion.winPlatform}</p>
          </div>
          <div className="rounded-xl p-3 bg-sky-100 border border-sky-300">
            <div className="text-[10px] uppercase tracking-wider text-sky-700 font-bold mb-1">🌍 Buyer Wins</div>
            <p className="text-xs text-sky-900">{e.suggestion.winBuyer}</p>
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap justify-center pt-4 border-t border-stone-200">
        <Link href="/demo" className="btn-secondary">← กลับ Demo</Link>
        <button className="btn-primary" onClick={() => alert("📩 ส่ง Deal Proposal ให้ Patrick + Supplier review (mock)")}>
          📩 Forward to Patrick
        </button>
        <button className="btn-secondary" onClick={() => window.print()}>
          🖨️ Export PDF
        </button>
      </div>
    </div>
  );
}

export default function DealRoomPage() {
  return (
    <Suspense fallback={<div className="container-soft py-20 text-center text-ink-muted">Loading…</div>}>
      <DealRoomContent />
    </Suspense>
  );
}
