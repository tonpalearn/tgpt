import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  variant?: "dark" | "light";
}

export function Logo({ className, showWordmark = true, variant = "dark" }: LogoProps) {
  const inkColor = variant === "dark" ? "var(--fg)" : "var(--surface)";
  const accentColor = variant === "dark" ? "var(--emerald)" : "var(--amber-soft)";

  return (
    <Link href="/" className={cn("inline-flex items-center gap-3 group", className)} aria-label="ThailandGPT — Home">
      <span className="relative inline-block w-9 h-9" aria-hidden>
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {/* Editorial monogram — emerald frame around amber dot */}
          <rect
            x="2"
            y="2"
            width="32"
            height="32"
            fill="none"
            stroke={accentColor}
            strokeWidth="1.25"
          />
          <line x1="2" y1="11.2" x2="34" y2="11.2" stroke={accentColor} strokeWidth="0.6" opacity="0.6" />
          <line x1="2" y1="24.8" x2="34" y2="24.8" stroke={accentColor} strokeWidth="0.6" opacity="0.6" />
          {/* Inner amber dot */}
          <circle cx="18" cy="18" r="3.4" fill="var(--amber)" />
          {/* Compass tick */}
          <line x1="18" y1="2" x2="18" y2="6" stroke={inkColor} strokeWidth="1.25" />
        </svg>
        <span className="absolute inset-0 rounded-sm bg-amber-warm/0 group-hover:bg-amber-warm/10 transition-colors duration-700" />
      </span>

      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className="font-display text-[1.05rem] tracking-tight"
            style={{ color: inkColor, fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}
          >
            ThailandGPT
          </span>
          <span
            className="text-[0.55rem] uppercase tracking-[0.28em] mt-0.5 figure-num"
            style={{ color: variant === "dark" ? "var(--fg-muted)" : "var(--amber-soft)" }}
          >
            Est. <span className="figure-num">2026</span> · Bangkok
          </span>
        </span>
      )}
    </Link>
  );
}
