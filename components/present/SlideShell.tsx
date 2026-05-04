"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Slide } from "@/lib/slides";

interface SlideShellProps {
  slide: Slide;
  index: number;
  total: number;
  variant?: "light" | "dark";
  children: ReactNode;
}

export function SlideShell({ slide, index, total, variant = "light", children }: SlideShellProps) {
  const dark = variant === "dark";
  return (
    <article
      className={cn(
        "absolute inset-0 flex flex-col px-12 lg:px-20 py-10 lg:py-14",
        dark ? "bg-emerald-deep text-parchment" : "bg-parchment text-ink"
      )}
    >
      {/* Top header band */}
      <header className="flex items-baseline justify-between text-[0.65rem] uppercase tracking-[0.22em] font-mono opacity-70 mb-8 shrink-0">
        <span className="flex items-center gap-3">
          <span className={cn("w-1.5 h-1.5 rounded-full", dark ? "bg-amber-warm" : "bg-emerald-deep")} />
          ThailandGPT · Stage 0 Review
        </span>
        <span>{slide.section ?? "—"}</span>
        <span>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </header>

      {/* Title */}
      {slide.title && slide.kind !== "cover" && slide.kind !== "closing" && (
        <div className="mb-10 shrink-0">
          <h2
            className="font-display text-4xl lg:text-6xl leading-[0.98] text-balance"
            style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}
          >
            {slide.title}
          </h2>
          {slide.subtitle && (
            <p className={cn("mt-3 text-base lg:text-lg", dark ? "text-parchment/75" : "text-ink-soft")}>
              {slide.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Footer band */}
      <footer className="mt-8 pt-4 border-t border-current/10 flex items-baseline justify-between text-[0.65rem] uppercase tracking-[0.22em] font-mono opacity-60 shrink-0">
        <span>4 พ.ค. 2569 · For Patrick · Mock data only</span>
        <span>← → keys to navigate · F for fullscreen</span>
      </footer>
    </article>
  );
}
