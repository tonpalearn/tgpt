import Link from "next/link";
import { Header } from "@/components/brand/Header";
import { DemoBadge } from "@/components/brand/DemoBadge";
import { SUPPLIERS, MOCK_DEALS } from "@/lib/mock-data.server";
import { formatUSD, cn } from "@/lib/utils";

export default function DashboardPage() {
  const totalGmv = MOCK_DEALS.reduce((sum, d) => sum + d.amount, 0);
  const tierCounts = SUPPLIERS.reduce<Record<string, number>>((acc, s) => {
    acc[s.tier] = (acc[s.tier] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <DemoBadge />
      <Header />

      <main className="border-t border-parchment-300 max-w-[1480px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="flex items-baseline justify-between flex-wrap gap-6 mb-12">
          <div>
            <div className="eyebrow mb-3">Section 08 / Operator</div>
            <h1 className="font-display text-display-xl text-ink leading-[1]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}>
              Operator&apos;s Desk
            </h1>
            <p className="mt-3 text-ink-soft max-w-xl">
              The internal terminal Patrick or Toni sees behind the consumer surface — pipeline, suppliers, signal log.
            </p>
          </div>
          <div className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-emerald-deep">
            ● Mock dashboard · No live feed
          </div>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-parchment-300 border border-parchment-300 mb-14">
          <Metric label="Verified suppliers" value={String(SUPPLIERS.length).padStart(2, "0")} sub="catalogue size" />
          <Metric label="Active deals" value={String(MOCK_DEALS.length).padStart(2, "0")} sub="pipeline" />
          <Metric label="GMV (mock)" value={formatUSD(totalGmv)} sub="active deal value" />
          <Metric label="Patrick&apos;s Circle" value={String(SUPPLIERS.filter((s) => s.endorsedByPatrick).length).padStart(2, "0")} sub="endorsed" />
        </div>

        {/* Two-column body */}
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="eyebrow mb-4">Active deal pipeline</div>
            <ul className="space-y-px bg-parchment-300 border border-parchment-300">
              {MOCK_DEALS.map((d) => {
                const supplier = SUPPLIERS.find((s) => s.id === d.supplierId);
                return (
                  <li key={d.id} className="bg-parchment-50 hover:bg-parchment-100 transition-colors duration-300 p-5 grid grid-cols-12 gap-4 items-center">
                    <span className="col-span-2 font-mono text-xs text-ink-muted">{d.id}</span>
                    <div className="col-span-4">
                      <div className="text-sm text-ink font-medium">{d.buyerName}</div>
                      <div className="text-xs text-ink-muted">{supplier?.businessName}</div>
                    </div>
                    <span className="col-span-3 text-xs text-ink-soft">{d.productDescription.slice(0, 60)}…</span>
                    <span className="col-span-2 text-right figure-num text-sm font-medium text-ink">
                      {formatUSD(d.amount)}
                    </span>
                    <span className="col-span-1 text-right">
                      <Link href={`/deals/${d.id}`} className="text-xs text-emerald-deep hover:text-ink transition-colors">
                        Open →
                      </Link>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">Tier distribution</div>
            <div className="border border-parchment-300 bg-parchment-50 p-6 space-y-4">
              {Object.entries(tierCounts).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between">
                  <span className={cn("tier-badge", `tier-${tier}`)}>★ {tier}</span>
                  <span className="figure-num text-base text-ink font-medium">{count}</span>
                </div>
              ))}
            </div>

            <div className="eyebrow mt-10 mb-4">Strategic signal log</div>
            <ul className="space-y-3 text-sm">
              <li className="border-l-2 border-amber-warm pl-3">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-amber-deep mb-1">Supply gap</div>
                <div className="text-ink leading-relaxed">2 queries for &ldquo;halal-certified mango&rdquo; — no match in catalogue</div>
              </li>
              <li className="border-l-2 border-emerald-deep pl-3">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-emerald-deep mb-1">Cascading demand</div>
                <div className="text-ink leading-relaxed">5 queries surfaced demand for English-speaking export coordinators (Layer 3)</div>
              </li>
              <li className="border-l-2 border-terracotta pl-3">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-terracotta mb-1">B2G opportunity</div>
                <div className="text-ink leading-relaxed">Skill demand pattern matches DLPW Q3 training budget allocation</div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-parchment-50 p-6">
      <div className="eyebrow mb-3">{label}</div>
      <div className="figure-num text-3xl text-ink font-medium" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{value}</div>
      {sub && <div className="text-[0.65rem] uppercase tracking-[0.18em] text-ink-muted font-mono mt-2">{sub}</div>}
    </div>
  );
}
