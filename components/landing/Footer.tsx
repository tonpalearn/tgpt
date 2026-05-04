import { Logo } from "../brand/Logo";

export function Footer() {
  return (
    <footer className="relative bg-ink text-parchment border-t border-amber-warm/20">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Logo variant="light" />

            <p className="mt-8 max-w-md text-base leading-relaxed text-parchment/75">
              ThailandGPT is the connection gateway turning global enquiries into closed deals — verified locally, signed transparently, executed without the broker tax.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <span className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-amber-soft">Tagline</span>
              <span className="font-display italic text-2xl text-amber-soft" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>
                Local Verify, Global Confidence.
              </span>
            </div>
          </div>

          {/* Columns */}
          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-8">
            <FooterCol
              label="Protocol"
              items={[
                { label: "Five Pillars", href: "#protocol" },
                { label: "Sequence", href: "#protocol" },
                { label: "Cascading Demand", href: "#" },
                { label: "Network", href: "#network" },
              ]}
            />
            <FooterCol
              label="Stage 0 Materials"
              items={[
                { label: "POC Spec v2", href: "#" },
                { label: "Scale Plan v2", href: "#" },
                { label: "Open Questions", href: "#" },
                { label: "Panel B Review", href: "#" },
              ]}
            />
            <FooterCol
              label="For Patrick"
              items={[
                { label: "Stage 0 Review Deck", href: "/present" },
                { label: "Demo script", href: "#" },
                { label: "GO / NO-GO checklist", href: "#" },
                { label: "Stage 1 brief", href: "#" },
                { label: "Direct Toni", href: "mailto:toni@example.local" },
              ]}
            />
          </div>
        </div>

        {/* Sub-footer */}
        <div className="mt-20 pt-8 border-t border-parchment/10 flex flex-wrap items-baseline justify-between gap-4 text-xs font-mono text-parchment/60 tracking-[0.04em]">
          <span>© Mock prototype · No real transactions · No real PII · Stage 0</span>
          <span className="flex items-center gap-4">
            <span className="text-amber-soft">v0.1.0-mock</span>
            <span>{new Date().toLocaleDateString("en-GB", { dateStyle: "long" })}</span>
            <span>Bangkok 13.7563° N · 100.5018° E</span>
          </span>
        </div>
      </div>

      {/* Decorative bottom rule */}
      <div className="h-1 bg-gradient-to-r from-emerald-deep via-amber-warm to-emerald-deep opacity-60" />
    </footer>
  );
}

function FooterCol({ label, items }: { label: string; items: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <div className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-amber-soft mb-5">
        {label}
      </div>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="text-sm text-parchment/85 hover:text-amber-soft transition-colors duration-300 inline-flex items-center gap-2 group"
            >
              {item.label}
              <span className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-amber-warm">→</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
