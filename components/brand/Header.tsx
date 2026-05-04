import Link from "next/link";
import { Logo } from "./Logo";

const NAV = [
  { label: "Protocol", href: "#protocol" },
  { label: "Network", href: "#network" },
  { label: "Intelligence", href: "/chat" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Deck", href: "/present" },
];

export function Header() {
  return (
    <header className="relative z-30">
      <div className="border-b border-parchment-300/70 backdrop-blur-md bg-parchment/60">
        <div className="max-w-[1480px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Logo />

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3.5 py-2 text-[0.78rem] tracking-[0.04em] text-ink-soft hover:text-ink transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-1 left-3.5 right-3.5 h-px bg-emerald-deep scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/chat"
              className="btn-primary text-[0.78rem] py-2.5 px-5"
            >
              Open Terminal
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M2 6h7m0 0L5.5 2.5M9 6L5.5 9.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-band — editorial publication info */}
      <div className="border-b border-parchment-300/40 bg-parchment-50/30">
        <div className="max-w-[1480px] mx-auto px-6 lg:px-12 h-9 flex items-center justify-between text-[0.65rem] tracking-[0.22em] uppercase font-mono text-ink-muted">
          <span>Vol. 0 · Issue 01 — Internal Demo</span>
          <span className="hidden md:inline">Bangkok ⟶ Global · {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
          <span className="text-emerald-deep">Reviewer: Patrick</span>
        </div>
      </div>
    </header>
  );
}
