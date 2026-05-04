import { cn } from "@/lib/utils";

interface DemoBadgeProps {
  className?: string;
  variant?: "fixed" | "inline";
}

/**
 * "Mock Data Only" badge — required by POC-SPEC §0.
 * Visible across the demo so Patrick (and anyone he shares it with)
 * never mistakes the prototype for production.
 */
export function DemoBadge({ className, variant = "fixed" }: DemoBadgeProps) {
  if (variant === "inline") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-2 px-2.5 py-1 border border-amber-warm bg-amber-warm/10 text-amber-deep text-[0.65rem] tracking-[0.18em] uppercase font-medium font-mono",
          className
        )}
      >
        <span className="w-1.5 h-1.5 bg-amber-warm rounded-full animate-pulse" />
        Mock Data
      </span>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 group",
        "flex items-center gap-2.5 px-3.5 py-2",
        "border border-ink/80 bg-parchment/95 backdrop-blur-md",
        "shadow-[0_10px_40px_-10px_rgba(26,22,18,0.25)]",
        "transition-all duration-500 hover:bg-ink hover:text-parchment",
        className
      )}
      role="status"
    >
      <span className="relative w-2 h-2">
        <span className="absolute inset-0 bg-amber-warm rounded-full animate-ping opacity-60" />
        <span className="absolute inset-0 bg-amber-warm rounded-full" />
      </span>
      <span className="font-mono text-[0.65rem] tracking-[0.22em] uppercase font-medium">
        Stage 0 · Mock Data Only
      </span>
    </div>
  );
}
