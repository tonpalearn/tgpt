const STEPS = [
  {
    num: "I",
    label: "Ask",
    th: "ถาม",
    detail: "Buyer poses a real-world enquiry in any language. The terminal reframes it as a structured demand signal.",
  },
  {
    num: "II",
    label: "Check",
    th: "ตรวจสอบ",
    detail: "Local Truth retrieval — laws, prices, capacity, certification status, season. Citation-grounded.",
  },
  {
    num: "III",
    label: "Select",
    th: "เลือก",
    detail: "Match engine ranks verified suppliers by tier × match score × Patrick's endorsement layer.",
  },
  {
    num: "IV",
    label: "Connect",
    th: "เชื่อมต่อ",
    detail: "Direct deal-room with the named decision-maker. No three-broker stack. Provenance is preserved.",
  },
  {
    num: "V",
    label: "Transact",
    th: "ทำธุรกรรม",
    detail: "Escrow-backed close, field verification, and audit trail. Patrick co-signs high-value deals.",
  },
];

export function Protocol() {
  return (
    <section className="relative py-28 lg:py-40 bg-emerald-deep text-parchment overflow-hidden">
      {/* atmospheric mesh on dark */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full opacity-25 blur-[100px]" style={{ background: "radial-gradient(circle, rgba(200,147,46,0.7), transparent 65%)" }} />
        <div className="absolute -bottom-40 -left-40 w-[50vw] h-[50vw] rounded-full opacity-20 blur-[120px]" style={{ background: "radial-gradient(circle, rgba(45,132,98,0.9), transparent 65%)" }} />
      </div>

      <div className="relative max-w-[1480px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-3">
            <div className="section-marker mb-4" style={{ color: "var(--amber-soft)" }}>Section 03 / Sequence</div>
            <div className="font-mono text-xs text-amber-soft/70">Five Movements</div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="font-display text-display-xl text-balance leading-[0.95]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}>
              The protocol moves like a <em className="not-italic text-amber-soft" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 100, 'WONK' 1" }}>jet ski</em>, not a cargo ship.
            </h2>
            <p className="mt-6 max-w-xl text-base lg:text-lg text-parchment/80 leading-relaxed">
              Five movements. No detours. The same sequence whether you are sourcing 50 tonnes of Monthong or commissioning bespoke handwoven silk.
            </p>
          </div>
        </div>

        {/* Sequence — vertical timeline with Roman numerals */}
        <ol className="grid lg:grid-cols-5 gap-px bg-parchment/15">
          {STEPS.map((s, i) => (
            <li key={s.num} className="bg-emerald-deep p-7 lg:p-8 group relative">
              <div className="flex items-baseline justify-between mb-8">
                <span className="font-display text-6xl text-amber-soft/90 group-hover:text-amber-warm transition-colors duration-500" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30, 'WONK' 1" }}>
                  {s.num}
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.22em] font-mono text-parchment/50">
                  {s.th}
                </span>
              </div>

              <h3 className="font-display text-3xl text-parchment mb-3" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
                {s.label}
              </h3>

              <p className="text-sm text-parchment/75 leading-relaxed">
                {s.detail}
              </p>

              {/* Connecting line — visible only on lg, except for last */}
              {i < STEPS.length - 1 && (
                <span className="hidden lg:block absolute top-12 -right-px w-px h-8 bg-amber-soft/40" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
