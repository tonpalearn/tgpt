import Link from "next/link";

const NAV = [
  { label: "ค้นหาซัพพลาย", href: "/browse", icon: "🌾" },
  { label: "ดีล", href: "/deals", icon: "🤝" },
  { label: "Demand", href: "/demands", icon: "📋" },
  { label: "Commission", href: "/reports/commission", icon: "📊" },
  { label: "Break-Even", href: "/reports/breakeven", icon: "🎯" },
  { label: "โมเดล", href: "/reports/model", icon: "💼" },
  { label: "Patrick Pitch", href: "/present/patrick", icon: "👑" },
  { label: "Live Demo", href: "/demo", icon: "🪄" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur-md border-b border-stone-100">
      <div className="container-soft h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-sage-500 flex items-center justify-center text-white font-semibold text-lg group-hover:bg-sage-600 transition-colors">
            T
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-ink">ThailandGPT</div>
            <div className="text-[11px] text-ink-muted -mt-0.5">เชื่อมซัพพลายไทยกับโลก</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 h-10 inline-flex items-center gap-2 rounded-full text-sm text-ink-soft hover:bg-sage-50 hover:text-ink transition-colors"
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/browse" className="btn-primary btn-sm">
            เริ่มค้นหา
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 7h7m0 0L6.5 3.5M10 7L6.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
