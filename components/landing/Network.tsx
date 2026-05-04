import Link from "next/link";
import { SUPPLIERS } from "@/lib/mock-data.server";

const TIER_LABEL: Record<string, string> = {
  elite: "Elite",
  pro: "Pro",
  trusted: "Trusted",
  new: "New",
};

const TIER_CLASS: Record<string, string> = {
  elite: "tier-elite",
  pro: "tier-pro",
  trusted: "tier-trusted",
  new: "tier-new",
};

const HERO_GRADIENTS: Record<string, string> = {
  "emerald-amber":
    "linear-gradient(135deg, #1B5942 0%, #0F3D2E 40%, #C8932E 100%)",
  "amber-cream":
    "linear-gradient(135deg, #E5BD6A 0%, #C8932E 50%, #FBF8F3 100%)",
  "emerald-deep":
    "linear-gradient(135deg, #2D8462 0%, #0F3D2E 60%, #1A1612 100%)",
  "cream-amber":
    "linear-gradient(135deg, #FBF8F3 0%, #E5BD6A 60%, #9C6E1A 100%)",
  "terracotta-emerald":
    "linear-gradient(135deg, #A04E2C 0%, #1B5942 60%, #0F3D2E 100%)",
  "cream-emerald":
    "linear-gradient(135deg, #FBF8F3 0%, #2D8462 60%, #0F3D2E 100%)",
};

export function Network() {
  return (
    <section id="network" className="relative py-28 lg:py-40 border-t border-parchment-300">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-3">
            <div className="section-marker mb-4">Section 05 / Network</div>
            <div className="font-mono text-xs text-ink-muted">Curated Suppliers</div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-display text-display-xl text-ink text-balance leading-[0.95]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}>
              A small list, <em className="not-italic text-emerald-deep" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>aggressively</em> verified.
            </h2>
            <p className="mt-6 max-w-xl text-base lg:text-lg text-ink-soft leading-relaxed">
              The mock catalogue. Six fictional suppliers, each carrying real-world rigour: certifications named, capacity stated, prices priced. Patrick&apos;s endorsement layer is visually distinguished from self-listed.
            </p>
          </div>
          <div className="lg:col-span-2 lg:text-right">
            <div className="eyebrow mb-2">Total in catalogue</div>
            <div className="font-display text-5xl text-ink figure-num" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
              {String(SUPPLIERS.length).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Suppliers grid — editorial cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-parchment-300">
          {SUPPLIERS.map((s, i) => (
            <article
              key={s.id}
              className="card-editorial p-0 flex flex-col"
            >
              {/* Hero — gradient placeholder, no real images */}
              <div
                className="relative h-44 overflow-hidden"
                style={{ background: HERO_GRADIENTS[s.heroImagePrompt] ?? HERO_GRADIENTS["emerald-amber"] }}
              >
                {/* grain overlay */}
                <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.85'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />

                {/* Top-row metadata */}
                <div className="relative z-10 p-4 flex items-start justify-between">
                  <span className={`tier-badge ${TIER_CLASS[s.tier]}`}>
                    ★ {TIER_LABEL[s.tier]}
                  </span>
                  {s.endorsedByPatrick && (
                    <span className="px-2 py-1 bg-ink/85 text-amber-soft text-[0.6rem] tracking-[0.18em] uppercase font-mono">
                      ✦ Patrick&apos;s Circle
                    </span>
                  )}
                </div>

                {/* Bottom: country marker */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-parchment/95">
                  <div>
                    <div className="text-[0.6rem] uppercase tracking-[0.2em] font-mono opacity-80">{s.region}</div>
                    <div className="text-base font-medium">{s.province}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.6rem] uppercase tracking-[0.2em] font-mono opacity-80">Years</div>
                    <div className="figure-num text-2xl font-display" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{s.yearsInOperation}</div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-xl text-ink leading-tight mb-1.5" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
                  {s.businessName}
                </h3>
                <div className="text-xs text-ink-muted mb-4 font-mono uppercase tracking-wider">{s.subCategory}</div>

                <p className="text-sm text-ink-soft leading-relaxed mb-5 flex-1">
                  {s.description}
                </p>

                {/* Numeric bar — Bloomberg terminal feel */}
                <div className="grid grid-cols-3 gap-px bg-parchment-300 mb-5">
                  <Cell label="Past deals" value={String(s.pastDealCount)} />
                  <Cell label="GMV (USD)" value={`${(s.totalGmvUsd / 1_000_000).toFixed(2)}M`} />
                  <Cell label="Rating" value={s.starRating.toFixed(1)} />
                </div>

                <Link
                  href={`/suppliers/${s.id}`}
                  className="inline-flex items-center justify-between text-sm text-ink hover:text-emerald-deep transition-colors duration-300 group/link"
                >
                  <span className="font-medium">Open profile</span>
                  <span className="figure-num text-[0.65rem] tracking-wider text-ink-muted group-hover/link:text-emerald-deep transition-colors">
                    [{String(i + 1).padStart(2, "0")} / {String(SUPPLIERS.length).padStart(2, "0")}]
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs text-ink-muted font-mono">
          <span>※ All suppliers shown above are fictional. No real Patrick&apos;s network data is in this prototype.</span>
          <Link href="/chat" className="text-emerald-deep hover:text-ink transition-colors">→ Try a query in the Terminal</Link>
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-parchment-50 p-3">
      <div className="text-[0.55rem] uppercase tracking-[0.18em] text-ink-muted font-mono mb-1">{label}</div>
      <div className="figure-num text-base text-ink font-medium">{value}</div>
    </div>
  );
}
