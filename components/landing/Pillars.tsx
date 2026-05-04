const PILLARS = [
  {
    num: "01",
    name: "Trustworthy",
    th: "ความน่าเชื่อถือ",
    body: "Fresh-by-default knowledge. Verified provenance. Zero tolerance for scammer infiltration.",
    metric: "Scam incidents",
    metricValue: "0",
  },
  {
    num: "02",
    name: "Verification",
    th: "การตรวจสอบ",
    body: "Local people on the ground confirm what AI cannot — orchards, factories, certifications.",
    metric: "Turnaround",
    metricValue: "<48h",
  },
  {
    num: "03",
    name: "Intelligence",
    th: "ปัญญาเชิงลึก",
    body: "Local truth that global LLMs cannot reach. Laws that changed this morning. Prices that shifted at noon.",
    metric: "Accuracy delta",
    metricValue: "+30%",
  },
  {
    num: "04",
    name: "Connect",
    th: "การเชื่อมโยง",
    body: "Direct access to decision-makers. No three-layer broker stack. Friction reduced to zero.",
    metric: "Verified MOUs",
    metricValue: "Target 12",
  },
  {
    num: "05",
    name: "Actionable",
    th: "ลงมือได้จริง",
    body: "Every query becomes a transaction path — not a search result page that goes nowhere.",
    metric: "Completion",
    metricValue: ">60%",
  },
];

export function Pillars() {
  return (
    <section id="protocol" className="relative py-28 lg:py-40 border-t border-parchment-300">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-12">
        {/* Section header — editorial chapter mark */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-3">
            <div className="section-marker mb-4">Section 02 / Protocol</div>
            <div className="font-mono text-xs text-ink-muted">Five Pillars</div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-display text-display-xl text-ink text-balance leading-[0.95]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}>
              Built on five non-negotiable <em className="not-italic text-emerald-deep" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>convictions</em>.
            </h2>
            <p className="mt-6 max-w-xl text-base lg:text-lg text-ink-soft leading-relaxed">
              The protocol is the moat. Each pillar is measurable. Each pillar is enforced before any transaction is permitted to surface.
            </p>
          </div>
        </div>

        {/* Pillars grid — magazine columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 border-t border-l border-parchment-300">
          {PILLARS.map((p, i) => (
            <article
              key={p.num}
              className="border-r border-b border-parchment-300 p-7 lg:p-8 bg-parchment-50/50 hover:bg-parchment-50 transition-colors duration-700 group min-h-[280px] flex flex-col"
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-display text-5xl text-ink/30 group-hover:text-emerald-deep transition-colors duration-500 figure-num" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
                  {p.num}
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-muted font-mono">
                  {p.th}
                </span>
              </div>

              <h3 className="font-display text-2xl text-ink mb-3" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
                {p.name}
              </h3>

              <p className="text-sm text-ink-soft leading-relaxed flex-1">
                {p.body}
              </p>

              <div className="mt-6 pt-4 border-t border-parchment-300 flex items-baseline justify-between">
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-ink-muted font-mono">{p.metric}</span>
                <span className="figure-num text-base text-emerald-deep font-medium">{p.metricValue}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
