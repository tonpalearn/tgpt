"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { SLIDES } from "@/lib/slides";
import { SlideShell } from "./SlideShell";
import { SlideContent } from "./SlideContent";
import { cn } from "@/lib/utils";

const DARK_KINDS = new Set(["cover", "closing"]);

export function SlidesViewer() {
  const [idx, setIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const total = SLIDES.length;

  const next = useCallback(() => setIdx((i) => Math.min(total - 1, i + 1)), [total]);
  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);

  const goFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        setIdx(0);
      } else if (e.key === "End") {
        setIdx(total - 1);
      } else if (e.key.toLowerCase() === "f") {
        goFullscreen();
      } else if (e.key === "Escape") {
        if (document.fullscreenElement) document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goFullscreen, total]);

  const slide = SLIDES[idx];
  const isDark = DARK_KINDS.has(slide.kind);

  return (
    <div ref={containerRef} className="relative w-screen h-screen overflow-hidden bg-ink">
      {/* Slide stage */}
      <div className="relative w-full h-full">
        <SlideShell
          key={idx}
          slide={slide}
          index={idx}
          total={total}
          variant={isDark ? "dark" : "light"}
        >
          <SlideContent slide={slide} />
        </SlideShell>
      </div>

      {/* Top-right exit */}
      <Link
        href="/"
        className="fixed top-3 right-3 z-50 px-3 py-1.5 bg-ink/85 text-parchment text-[0.6rem] font-mono uppercase tracking-[0.22em] hover:bg-amber-warm hover:text-ink transition-colors backdrop-blur-md"
      >
        Exit ⏎
      </Link>

      {/* Bottom navigation rail */}
      <nav
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-ink/85 backdrop-blur-md px-4 py-2 text-parchment shadow-2xl"
        aria-label="Slide navigation"
      >
        <button
          onClick={prev}
          disabled={idx === 0}
          className="w-7 h-7 flex items-center justify-center hover:bg-amber-warm hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          ←
        </button>
        <div className="font-mono text-xs tabular-nums tracking-wider">
          {String(idx + 1).padStart(2, "0")}
          <span className="text-parchment/40 mx-1.5">/</span>
          {String(total).padStart(2, "0")}
        </div>
        <button
          onClick={next}
          disabled={idx === total - 1}
          className="w-7 h-7 flex items-center justify-center hover:bg-amber-warm hover:text-ink transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          →
        </button>

        <span className="w-px h-4 bg-parchment/30 mx-1" />

        <button
          onClick={goFullscreen}
          className="px-2 h-7 text-[0.6rem] uppercase tracking-[0.18em] font-mono hover:bg-amber-warm hover:text-ink transition-colors"
          aria-label="Toggle fullscreen"
        >
          Full
        </button>

        <span className="hidden sm:inline text-[0.6rem] text-parchment/50 font-mono ml-2">
          ← → · F · Esc
        </span>
      </nav>

      {/* Progress bar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-0.5 bg-amber-warm transition-all duration-500 z-40",
        )}
        style={{ width: `${((idx + 1) / total) * 100}%` }}
      />
    </div>
  );
}
