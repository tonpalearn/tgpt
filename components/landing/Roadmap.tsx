const STAGES = [
  {
    stage: "0",
    name: "Internal Demo",
    duration: "2–4 weeks",
    cost: "$0",
    audience: "Patrick (sole reviewer)",
    state: "active",
    deliverable: "Mock prototype (this site)",
  },
  {
    stage: "1",
    name: "External POC",
    duration: "4–8 weeks",
    cost: "$50–150 / mo",
    audience: "10–50 friendly testers",
    state: "next",
    deliverable: "Real users · limited scope",
  },
  {
    stage: "2",
    name: "MVP",
    duration: "12 weeks",
    cost: "$340–660 / mo",
    audience: "100–500 users",
    state: "planned",
    deliverable: "First closed real deal",
  },
  {
    stage: "3",
    name: "Scale",
    duration: "6+ months",
    cost: "$1.5–7K / mo",
    audience: "10K+ MAU · multi-country",
    state: "planned",
    deliverable: "Multi-country, multi-vertical",
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="relative py-28 lg:py-40 border-t border-parchment-300 bg-parchment-50/40">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-3">
            <div className="section-marker mb-4">Section 06 / Roadmap</div>
            <div className="font-mono text-xs text-ink-muted">Lean-First Progression</div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-display text-display-xl text-ink text-balance leading-[0.95]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}>
              Four stages. One <em className="not-italic text-emerald-deep" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>green-light</em> at a time.
            </h2>
            <p className="mt-6 max-w-xl text-base lg:text-lg text-ink-soft leading-relaxed">
              No premature scaling. Each stage&apos;s gate must close before the next opens. Patrick controls every gate. Toni delivers the artefact that earns the next.
            </p>
          </div>
        </div>

        {/* Roadmap matrix — like a railway timetable */}
        <div className="border-t border-b border-ink/40">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-x-6 gap-y-0 text-xs font-mono uppercase tracking-[0.18em] text-ink-muted py-3 border-b border-parchment-300">
            <span>Stage</span>
            <span>Name</span>
            <span>Duration</span>
            <span>Cost / mo</span>
            <span>Audience</span>
            <span className="text-right">State</span>
          </div>

          {STAGES.map((s) => (
            <div
              key={s.stage}
              className={`grid grid-cols-[auto_1fr_1fr_1fr_1fr_auto] gap-x-6 items-center py-6 border-b border-parchment-300 last:border-b-0 ${
                s.state === "active" ? "bg-emerald-deep/5" : ""
              }`}
            >
              <span className="font-display text-4xl figure-num text-ink/70" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
                {s.stage}
              </span>
              <div>
                <div className="font-display text-xl text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>{s.name}</div>
                <div className="text-xs text-ink-muted mt-1">{s.deliverable}</div>
              </div>
              <span className="figure-num text-sm text-ink-soft">{s.duration}</span>
              <span className="figure-num text-sm text-ink-soft">{s.cost}</span>
              <span className="text-sm text-ink-soft">{s.audience}</span>

              <span className="justify-self-end">
                {s.state === "active" ? (
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-deep text-amber-soft text-[0.65rem] tracking-[0.18em] uppercase font-mono">
                    <span className="w-1.5 h-1.5 bg-amber-warm rounded-full animate-pulse" />
                    Active
                  </span>
                ) : s.state === "next" ? (
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 border border-amber-warm text-amber-deep text-[0.65rem] tracking-[0.18em] uppercase font-mono">
                    Next
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-2.5 py-1 border border-parchment-300 text-ink-muted text-[0.65rem] tracking-[0.18em] uppercase font-mono">
                    Planned
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6 text-sm text-ink-soft">
          <div>
            <div className="eyebrow mb-2">Toni&apos;s domain</div>
            Build, spec, tech architecture, risk flagging. No business decisions.
          </div>
          <div>
            <div className="eyebrow mb-2">Patrick&apos;s domain</div>
            Brand, legal, hiring, real onboarding, MOU, gate decisions.
          </div>
          <div>
            <div className="eyebrow mb-2">Joint</div>
            Use case lock, defensibility framing, unit economics validation.
          </div>
        </div>
      </div>
    </section>
  );
}
