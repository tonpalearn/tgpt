import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/brand/Header";
import { DemoBadge } from "@/components/brand/DemoBadge";
import { getSupplier, MOCK_DEALS } from "@/lib/mock-data.server";
import { cn, formatUSD } from "@/lib/utils";

const HERO_GRADIENTS: Record<string, string> = {
  "emerald-amber": "linear-gradient(135deg, #1B5942 0%, #0F3D2E 40%, #C8932E 100%)",
  "amber-cream": "linear-gradient(135deg, #E5BD6A 0%, #C8932E 50%, #FBF8F3 100%)",
  "emerald-deep": "linear-gradient(135deg, #2D8462 0%, #0F3D2E 60%, #1A1612 100%)",
  "cream-amber": "linear-gradient(135deg, #FBF8F3 0%, #E5BD6A 60%, #9C6E1A 100%)",
  "terracotta-emerald": "linear-gradient(135deg, #A04E2C 0%, #1B5942 60%, #0F3D2E 100%)",
  "cream-emerald": "linear-gradient(135deg, #FBF8F3 0%, #2D8462 60%, #0F3D2E 100%)",
};

export default async function SupplierProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supplier = getSupplier(id);
  if (!supplier) notFound();

  const supplierDeals = MOCK_DEALS.filter((d) => d.supplierId === supplier.id);

  return (
    <>
      <DemoBadge />
      <Header />

      <main className="relative">
        {/* Hero band */}
        <section
          className="relative h-[44vh] min-h-[360px] overflow-hidden border-b border-ink/15"
          style={{ background: HERO_GRADIENTS[supplier.heroImagePrompt] ?? HERO_GRADIENTS["emerald-amber"] }}
        >
          <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />

          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end max-w-[1480px] mx-auto px-6 lg:px-12 pb-12 text-parchment">
            <div className="flex items-center gap-3 mb-5">
              <Link href="/" className="text-[0.65rem] uppercase tracking-[0.22em] font-mono text-parchment/70 hover:text-amber-soft transition-colors">
                ← Back to network
              </Link>
              <span className={cn("tier-badge", `tier-${supplier.tier}`)}>★ {supplier.tier}</span>
              {supplier.endorsedByPatrick && (
                <span className="px-2 py-1 bg-ink/85 text-amber-soft text-[0.6rem] tracking-[0.18em] uppercase font-mono">
                  ✦ Patrick&apos;s Circle
                </span>
              )}
            </div>

            <h1 className="font-display text-display-xl text-parchment leading-[1] mb-3" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
              {supplier.businessName}
            </h1>
            <div className="text-parchment/85 font-mono text-sm tracking-wide">
              {supplier.subCategory} · {supplier.province} · เริ่มดำเนินการ {2026 - supplier.yearsInOperation}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="max-w-[1480px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="grid lg:grid-cols-[1fr_360px] gap-16">
            {/* Left column — narrative */}
            <div>
              <div className="grid sm:grid-cols-3 gap-px bg-parchment-300 border border-parchment-300 mb-12">
                <Stat label="Past deals" value={String(supplier.pastDealCount)} />
                <Stat label="Total GMV" value={`USD ${(supplier.totalGmvUsd / 1_000_000).toFixed(2)}M`} />
                <Stat label="Star rating" value={`${supplier.starRating.toFixed(1)} / 5.0`} />
              </div>

              <div className="prose-editorial max-w-2xl">
                <div className="eyebrow mb-3">Profile</div>
                <p className="text-lg text-ink leading-relaxed mb-12 text-pretty">
                  {supplier.description}
                </p>

                <div className="eyebrow mb-3">Owner / contact</div>
                <p className="text-lg text-ink leading-relaxed mb-12">
                  {supplier.ownerName} · <span className="text-ink-muted text-sm font-mono">redacted in mock</span>
                </p>

                <div className="eyebrow mb-3">Capacity & price band</div>
                <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-12">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted mb-1.5">Capacity</dt>
                    <dd className="text-base text-ink">{supplier.capacity}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted mb-1.5">Price band</dt>
                    <dd className="text-base text-ink figure-num">{supplier.pricePerUnit}</dd>
                  </div>
                </dl>

                <div className="eyebrow mb-4">Certifications</div>
                <ul className="space-y-2.5 mb-14">
                  {supplier.certifications.map((c) => (
                    <li key={c.name} className="flex items-baseline gap-3 border-b border-parchment-300 pb-2.5">
                      <span className="text-emerald-deep mt-0.5">✓</span>
                      <span className="flex-1">
                        <span className="text-ink font-medium">{c.name}</span>
                        <span className="text-ink-muted text-sm ml-2">— {c.issuer}</span>
                      </span>
                      {c.validUntil && (
                        <span className="text-xs font-mono text-ink-muted">
                          valid → {c.validUntil}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="eyebrow mb-3">Tags</div>
                <div className="flex flex-wrap gap-2 mb-12">
                  {supplier.hashtags.map((h) => (
                    <span key={h} className="px-3 py-1 border border-parchment-300 text-xs text-ink-soft font-mono">
                      #{h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent deals */}
              {supplierDeals.length > 0 && (
                <div className="mt-8">
                  <div className="eyebrow mb-5">Recent deal activity</div>
                  <ul className="space-y-px bg-parchment-300 border border-parchment-300">
                    {supplierDeals.map((d) => (
                      <li key={d.id} className="bg-parchment-50 p-5 grid grid-cols-12 gap-4 items-center">
                        <span className="col-span-2 font-mono text-xs text-ink-muted">{d.id}</span>
                        <span className="col-span-4 text-sm text-ink">{d.buyerName}</span>
                        <span className="col-span-3 text-xs text-ink-soft">{d.productDescription}</span>
                        <span className="col-span-2 text-right figure-num text-sm font-medium text-ink">
                          {formatUSD(d.amount)}
                        </span>
                        <span className="col-span-1 text-right">
                          <Link href={`/deals/${d.id}`} className="text-xs text-emerald-deep hover:text-ink transition-colors">
                            Open →
                          </Link>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right column — sticky action card */}
            <aside className="lg:sticky lg:top-8 self-start">
              <div className="border border-ink/85 bg-parchment-50 p-6 mb-6">
                <div className="eyebrow mb-2">Verified</div>
                <div className="text-2xl font-display text-ink mb-4" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60, 'WONK' 1" }}>
                  {new Date(supplier.verifiedAt).toLocaleDateString("en-GB", { dateStyle: "long" })}
                </div>
                <div className="text-xs text-ink-soft mb-6 leading-relaxed">
                  Site visit, certification audit, and financial reference check. Re-verification cycle: every 90 days.
                </div>

                <button className="btn-primary w-full justify-center mb-3">
                  Request to connect
                  <span>→</span>
                </button>
                <button className="btn-ghost w-full justify-center border border-parchment-300">
                  Save to shortlist
                </button>
              </div>

              <div className="border border-parchment-300 bg-parchment-50/60 p-6">
                <div className="eyebrow mb-3 text-amber-deep">Demo notice</div>
                <p className="text-xs text-ink-soft leading-relaxed">
                  This profile is fictional. Names, numbers, and certifications are illustrative — used to demonstrate the verification standard. No connection request will be transmitted to any real party.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-parchment-50 p-5">
      <div className="eyebrow mb-2">{label}</div>
      <div className="figure-num text-2xl text-ink font-medium">{value}</div>
    </div>
  );
}
