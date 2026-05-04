/**
 * Cascading Demand visualisation — surfaces the strategic insight from
 * Panel B (Toni's example): one demand signal triggers downstream
 * demand for adjacent supply (skills, training, certification).
 *
 * Patrick may not have framed the platform this way; this section
 * makes it visible during the demo.
 */
export function Cascading() {
  const layers = [
    {
      idx: "L1",
      role: "Primary demand",
      example: "Dubai investor wants 50t Monthong durian",
      surfaced: "Verified suppliers in Chanthaburi",
      tone: "emerald",
    },
    {
      idx: "L2",
      role: "Cascading demand",
      example: "Cold-chain forwarder for GCC corridor",
      surfaced: "Logistics partner gap detected",
      tone: "amber",
    },
    {
      idx: "L3",
      role: "Cascading demand",
      example: "English-speaking export coordinator",
      surfaced: "Skill demand → training opportunity",
      tone: "amber",
    },
    {
      idx: "L4",
      role: "Tertiary supply",
      example: "Vocational English instructor in Chanthaburi",
      surfaced: "Education partner referral",
      tone: "terracotta",
    },
  ];

  return (
    <section className="relative py-28 lg:py-40 border-t border-parchment-300">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-8">
        {/* Section header */}
        <div className="lg:col-span-4">
          <div className="section-marker mb-4">Section 04 / Strategic Layer</div>
          <h2 className="font-display text-display-lg text-ink text-balance leading-[1]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}>
            Every demand signal is the <em className="not-italic text-emerald-deep" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>tip</em> of an iceberg.
          </h2>

          <p className="mt-6 text-ink-soft leading-relaxed">
            The platform doesn&apos;t just match Layer 1. It surfaces the cascading demand chain — and quietly opens four secondary markets at once.
          </p>

          <div className="mt-8 pt-6 border-t border-parchment-300">
            <div className="eyebrow mb-3">Panel B insight</div>
            <p className="font-display italic text-xl leading-snug text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>
              &ldquo;Patrick&apos;s network sees the deal. ThailandGPT sees the sub-economy the deal triggers.&rdquo;
            </p>
            <div className="mt-3 text-xs text-ink-muted font-mono">— Panel B Strategic Review · 2026-05-04</div>
          </div>
        </div>

        {/* Cascade visualisation */}
        <div className="lg:col-span-8 lg:pl-12">
          <ol className="space-y-px bg-parchment-300">
            {layers.map((layer, i) => (
              <li
                key={layer.idx}
                className="grid grid-cols-12 items-center gap-4 bg-parchment-50 hover:bg-parchment-100 transition-colors duration-500 p-6 lg:p-7 group"
              >
                <div className="col-span-1">
                  <span
                    className={`font-mono text-xs font-medium tracking-wider ${
                      layer.tone === "emerald"
                        ? "text-emerald-deep"
                        : layer.tone === "amber"
                        ? "text-amber-deep"
                        : "text-terracotta"
                    }`}
                  >
                    {layer.idx}
                  </span>
                </div>

                <div className="col-span-3">
                  <div className="eyebrow mb-1.5">{layer.role}</div>
                </div>

                <div className="col-span-5">
                  <div className="text-base lg:text-lg text-ink font-medium">{layer.example}</div>
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2 text-right">
                  <span className="text-sm text-ink-soft">{layer.surfaced}</span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      layer.tone === "emerald"
                        ? "bg-emerald-deep"
                        : layer.tone === "amber"
                        ? "bg-amber-warm"
                        : "bg-terracotta"
                    }`}
                  />
                </div>
              </li>
            ))}
          </ol>

          {/* Annotation */}
          <div className="mt-6 pl-6 border-l-2 border-amber-warm">
            <div className="text-xs text-ink-soft leading-relaxed">
              <span className="font-mono uppercase tracking-wider text-amber-deep">Implication</span> —
              the platform monetises Layer 1 (commission) while opening Layers 2-4 (training partnerships, B2G data, supplier development pipeline) as separate revenue streams.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
