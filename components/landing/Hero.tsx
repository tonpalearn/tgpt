import Link from "next/link";
import { DemoBadge } from "../brand/DemoBadge";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col">
      <div className="atmosphere" />

      <div className="relative z-10 flex-1 grid lg:grid-cols-12 gap-8 lg:gap-0 px-6 lg:px-12 max-w-[1480px] w-full mx-auto pt-14 pb-20">
        {/* Left rail — editorial metadata */}
        <aside className="lg:col-span-2 flex lg:flex-col justify-between lg:justify-start gap-6 lg:gap-12 pt-2">
          <div className="space-y-1">
            <div className="eyebrow">Section 01</div>
            <div className="font-mono text-xs text-ink-muted">National Execution Layer</div>
          </div>
          <div className="hidden lg:block space-y-1">
            <div className="eyebrow">Audience</div>
            <div className="font-mono text-xs text-ink-soft">Patrick · Internal Review</div>
          </div>
          <div className="hidden lg:block space-y-1">
            <div className="eyebrow">Status</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-deep rounded-full" />
              <span className="font-mono text-xs text-emerald-deep uppercase tracking-wider">Stage 0 Live</span>
            </div>
          </div>
        </aside>

        {/* Center — display headline */}
        <div className="lg:col-span-8 lg:px-8 flex flex-col justify-center stagger">
          <DemoBadge variant="inline" className="mb-8 self-start" />

          <h1 className="font-display text-display-2xl text-balance text-ink leading-[0.92]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 0" }}>
            Local <em className="not-italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>Verify</em>,
            <br />
            <span className="text-emerald-deep">Global</span> <em className="not-italic text-amber-warm" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>Confidence</em>.
          </h1>

          <p className="mt-10 max-w-[620px] text-lg lg:text-xl leading-[1.55] text-ink-soft text-pretty">
            ThailandGPT is the <span className="text-ink font-medium">National Execution Layer</span> — a verification gateway that turns global enquiries about Thailand into closed transactions, without the broker tax.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Link href="/chat" className="btn-primary">
              Try the Terminal
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h9m0 0L7 3m4 4L7 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
              </svg>
            </Link>
            <Link href="#protocol" className="btn-ghost">
              Read the protocol
            </Link>
            <span className="text-xs font-mono text-ink-muted ml-2">
              <span className="text-emerald-deep">●</span> Free demo · No login required for Stage 0
            </span>
          </div>

          {/* Pull-quote row */}
          <div className="mt-20 pt-8 border-t border-parchment-300 grid sm:grid-cols-3 gap-6 lg:gap-12">
            <Stat label="Verified suppliers in mock" value="06" suffix="curated" />
            <Stat label="Avg. match latency" value="1.4s" suffix="Gemini Flash" />
            <Stat label="Commission target band" value="6–12%" suffix="vs broker 20–35%" />
          </div>
        </div>

        {/* Right rail — meta + decorative */}
        <aside className="lg:col-span-2 flex lg:flex-col items-end lg:items-stretch justify-between gap-6 lg:gap-10 pt-2">
          <div className="text-right space-y-1.5 lg:text-left">
            <div className="eyebrow lg:text-right">Codename</div>
            <div className="font-display text-2xl text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 70, 'WONK' 1" }}>
              TGPT
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="eyebrow mb-2 lg:text-right">Issue Coordinates</div>
            <div className="font-mono text-[0.7rem] text-ink-soft leading-relaxed lg:text-right">
              13.7563° N
              <br />
              100.5018° E
            </div>
          </div>

          <div className="hidden lg:block lg:text-right">
            <div className="eyebrow mb-2 lg:text-right">Version</div>
            <div className="font-mono text-[0.7rem] text-ink-soft">
              v0.1.0-mock
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom marquee — demand ticker */}
      <DemandTicker />
    </section>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-display text-4xl lg:text-5xl text-ink figure-num whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{value}</span>
        {suffix && <span className="text-xs text-ink-muted font-mono uppercase tracking-wider">{suffix}</span>}
      </div>
    </div>
  );
}

function DemandTicker() {
  const items = [
    "Dubai Family Office · 50t Monthong durian · Apr–Jul",
    "Singapore grocer · 120t Hom Mali GI Surin · Q3",
    "London tea house · 180kg single-origin oolong",
    "GCC hospitality · 800m handwoven Lanna silk",
    "Stockholm distributor · 12M units coconut water",
    "Hong Kong family office · seeking certified halal mango",
    "Tokyo importer · USDA-organic aromatic rice",
    "Riyadh restaurant group · monthly Thai sea salt",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="relative border-t border-b border-ink/15 bg-parchment-50/50 backdrop-blur-sm overflow-hidden mask-fade-x">
      <div className="flex items-center gap-3 py-3.5">
        <span className="ml-6 lg:ml-12 shrink-0 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-emerald-deep">
          <span className="w-1.5 h-1.5 bg-emerald-deep rounded-full animate-pulse" />
          Live demand ticker
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-12 animate-ticker whitespace-nowrap">
            {doubled.map((item, i) => (
              <span key={i} className="text-sm text-ink-soft font-mono inline-flex items-center gap-3">
                <span className="text-amber-warm">◆</span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
