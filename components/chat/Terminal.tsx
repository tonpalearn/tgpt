"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { QueryResult, Supplier } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TerminalProps {
  suppliers: Supplier[];
  sampleQueries: string[];
}

interface Turn {
  id: string;
  query: string;
  result?: QueryResult;
  error?: string;
  loading: boolean;
  timestamp: number;
}

export function Terminal({ suppliers, sampleQueries }: TerminalProps) {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const supplierMap = new Map(suppliers.map((s) => [s.id, s]));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  async function submit(query: string) {
    const trimmed = query.trim();
    if (trimmed.length < 3) return;

    const id = crypto.randomUUID();
    const turn: Turn = { id, query: trimmed, loading: true, timestamp: Date.now() };
    setTurns((prev) => [...prev, turn]);
    setInput("");

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed, language: /[฀-๿]/.test(trimmed) ? "th" : "en" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setTurns((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, loading: false, error: err.error ?? `Error ${res.status}` } : t
          )
        );
        return;
      }
      const result = (await res.json()) as QueryResult;
      setTurns((prev) =>
        prev.map((t) => (t.id === id ? { ...t, loading: false, result } : t))
      );
    } catch (err) {
      setTurns((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, loading: false, error: err instanceof Error ? err.message : "Unknown error" }
            : t
        )
      );
    }
  }

  return (
    <div className="grid lg:grid-cols-[280px_1fr_320px] gap-px bg-parchment-300 min-h-[calc(100vh-9rem)]">
      {/* Left rail — terminal metadata */}
      <aside className="bg-parchment-50 p-6 lg:p-7 hidden lg:flex flex-col">
        <div className="eyebrow mb-3">Section 07 / Terminal</div>
        <div className="font-display text-3xl text-ink leading-tight mb-6" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
          Local truth, on demand.
        </div>

        <div className="text-sm text-ink-soft leading-relaxed mb-8">
          Type a buyer enquiry. The terminal returns structured intelligence: matched suppliers, citations, and the cascading demand signals the platform detects.
        </div>

        <div className="mt-auto pt-6 border-t border-parchment-300 space-y-3">
          <div>
            <div className="eyebrow mb-1">Model</div>
            <div className="font-mono text-xs text-ink-soft">gemini-1.5-flash · server-side</div>
          </div>
          <div>
            <div className="eyebrow mb-1">Catalogue</div>
            <div className="font-mono text-xs text-ink-soft">{suppliers.length} verified suppliers</div>
          </div>
          <div>
            <div className="eyebrow mb-1">Mode</div>
            <div className="font-mono text-xs text-emerald-deep">● Mock data — Stage 0</div>
          </div>
        </div>
      </aside>

      {/* Center — transcript + input */}
      <section className="bg-parchment flex flex-col min-h-[80vh]">
        <div ref={transcriptRef} className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-10">
          {turns.length === 0 && (
            <div className="max-w-2xl">
              <div className="eyebrow mb-3">Start here</div>
              <h2 className="font-display text-display-lg text-ink leading-[1.05] mb-6" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50" }}>
                Ask the terminal what you would ask a trusted local fixer.
              </h2>
              <p className="text-ink-soft leading-relaxed mb-10">
                Five sample enquiries below. Tap one or write your own.
              </p>
              <ul className="space-y-2">
                {sampleQueries.map((s, i) => (
                  <li key={i}>
                    <button
                      onClick={() => submit(s)}
                      className="w-full text-left p-4 border border-parchment-300 hover:border-ink hover:bg-parchment-50 transition-all duration-300 group flex items-start gap-4"
                    >
                      <span className="font-mono text-[0.65rem] tracking-[0.2em] text-ink-muted group-hover:text-emerald-deep mt-1 shrink-0">
                        Q.{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-ink leading-relaxed">{s}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {turns.map((turn, idx) => (
            <TurnBlock
              key={turn.id}
              turn={turn}
              index={idx + 1}
              supplierMap={supplierMap}
            />
          ))}
        </div>

        {/* Input — sticky bottom */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="border-t border-parchment-300 bg-parchment-50/95 backdrop-blur p-5 lg:p-6"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3">
              <span className="font-mono text-xs text-emerald-deep mb-3 mr-1">»</span>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(input);
                  }
                }}
                rows={1}
                placeholder="Type an enquiry — 'I need 50 tonnes premium durian, export to Dubai, by next month.'"
                className="flex-1 bg-transparent resize-none outline-none text-ink placeholder:text-ink-muted/70 text-base leading-relaxed py-2 max-h-32"
              />
              <button
                type="submit"
                disabled={input.trim().length < 3}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                Run query
                <span className="font-mono text-[0.6rem] tracking-wider opacity-70">↵</span>
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-[0.65rem] tracking-[0.18em] uppercase font-mono text-ink-muted">
              <span>Press Enter to run · Shift+Enter for newline</span>
              <span>Server-side LLM · No PII captured</span>
            </div>
          </div>
        </form>
      </section>

      {/* Right rail — query log */}
      <aside className="bg-parchment-50 p-6 lg:p-7 hidden lg:block">
        <div className="eyebrow mb-3">Session log</div>
        <div className="text-xs text-ink-muted mb-6 font-mono">
          {turns.length} {turns.length === 1 ? "turn" : "turns"} this session
        </div>

        {turns.length === 0 ? (
          <div className="text-sm text-ink-muted italic">No queries yet. Returns will appear here.</div>
        ) : (
          <ol className="space-y-3">
            {turns.map((t, i) => (
              <li key={t.id} className="border-l-2 border-emerald-deep/40 pl-3 py-1">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-muted mb-1">
                  T{String(i + 1).padStart(2, "0")} · {t.loading ? "running" : t.error ? "error" : "complete"}
                </div>
                <div className="text-xs text-ink line-clamp-2">{t.query}</div>
                {t.result?.signalDetected.supplyGap && (
                  <div className="mt-1 text-[0.65rem] text-amber-deep font-mono">⚑ Supply gap recorded</div>
                )}
              </li>
            ))}
          </ol>
        )}

        <div className="mt-10 pt-6 border-t border-parchment-300">
          <div className="eyebrow mb-2">Per Panel B</div>
          <p className="text-xs text-ink-soft leading-relaxed">
            Unanswered queries are logged as supply-gap signals. This data becomes a sellable B2G intelligence product in Stage 2+.
          </p>
        </div>
      </aside>
    </div>
  );
}

function TurnBlock({
  turn,
  index,
  supplierMap,
}: {
  turn: Turn;
  index: number;
  supplierMap: Map<string, Supplier>;
}) {
  return (
    <article className="max-w-3xl">
      {/* User query — editorial pull-quote */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-ink-muted">
            Turn {String(index).padStart(2, "0")} · Buyer
          </span>
        </div>
        <div className="font-display text-2xl lg:text-3xl text-ink leading-snug" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 60, 'WONK' 1" }}>
          &ldquo;{turn.query}&rdquo;
        </div>
      </div>

      {/* Response */}
      <div className="border-l-2 border-emerald-deep pl-6 py-2">
        <div className="flex items-baseline gap-3 mb-3">
          <span className="font-mono text-[0.65rem] tracking-[0.22em] uppercase text-emerald-deep">
            ThailandGPT
          </span>
          {turn.result && (
            <span className="font-mono text-[0.6rem] tracking-wider text-ink-muted">
              {turn.result.meta.model} · {turn.result.meta.latencyMs}ms
              {turn.result.meta.isMock && " · mock"}
            </span>
          )}
        </div>

        {turn.loading && <LoadingSkeleton />}

        {turn.error && (
          <div className="text-sm text-terracotta py-3">
            <span className="font-mono uppercase tracking-wider mr-2">Error:</span>
            {turn.error}
          </div>
        )}

        {turn.result && !turn.loading && (
          <ResultBlock result={turn.result} supplierMap={supplierMap} />
        )}
      </div>
    </article>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 py-3">
      <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
        <span className="w-2 h-2 bg-emerald-deep rounded-full animate-pulse" />
        Consulting catalogue, knowledge base, and surfacing matches…
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-parchment-300 animate-pulse rounded w-4/5" />
        <div className="h-3 bg-parchment-300 animate-pulse rounded w-3/5" />
        <div className="h-3 bg-parchment-300 animate-pulse rounded w-2/3" />
      </div>
    </div>
  );
}

function ResultBlock({
  result,
  supplierMap,
}: {
  result: QueryResult;
  supplierMap: Map<string, Supplier>;
}) {
  return (
    <div className="space-y-7">
      {/* Summary */}
      <p className="text-base lg:text-lg text-ink leading-relaxed text-pretty">
        {result.summary}
      </p>

      {/* Cascading signals */}
      {result.signalDetected && (
        <div className="border border-parchment-300 bg-parchment-50/80 p-5">
          <div className="eyebrow mb-3 text-amber-deep">Detected signals</div>
          <div className="space-y-2.5 text-sm">
            <SignalRow label="Primary demand" value={result.signalDetected.primaryDemand} tone="emerald" />
            {result.signalDetected.cascadingDemand?.map((c, i) => (
              <SignalRow key={i} label={`Cascading L${i + 2}`} value={c} tone="amber" />
            ))}
            {result.signalDetected.supplyGap && (
              <SignalRow label="Supply gap recorded" value={result.signalDetected.supplyGap} tone="terracotta" />
            )}
          </div>
        </div>
      )}

      {/* Matched suppliers */}
      {result.matchedSuppliers.length > 0 && (
        <div>
          <div className="eyebrow mb-4">Matched verified suppliers</div>
          <ul className="space-y-3">
            {result.matchedSuppliers.map((m, i) => {
              const s = supplierMap.get(m.supplierId);
              if (!s) return null;
              return (
                <li key={m.supplierId}>
                  <Link
                    href={`/suppliers/${s.id}`}
                    className="card-editorial p-5 flex items-start gap-5 group"
                  >
                    <span className="font-display text-3xl figure-num text-ink/30 group-hover:text-emerald-deep transition-colors duration-500 shrink-0" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 mb-1.5 flex-wrap">
                        <h4 className="font-display text-lg text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
                          {s.businessName}
                        </h4>
                        <span className={cn("tier-badge", `tier-${s.tier}`)}>★ {s.tier}</span>
                        {s.endorsedByPatrick && (
                          <span className="px-2 py-0.5 bg-ink text-amber-soft text-[0.55rem] tracking-[0.2em] uppercase font-mono">
                            ✦ Patrick&apos;s Circle
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-ink-muted font-mono uppercase tracking-wider mb-2">
                        {s.subCategory} · {s.province}
                      </div>
                      <p className="text-sm text-ink-soft leading-relaxed">{m.matchReason}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-muted font-mono mb-1">Match</div>
                      <div className="figure-num text-2xl text-emerald-deep font-medium">{m.matchScore}<span className="text-sm text-ink-muted">/100</span></div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Citations */}
      {result.citations.length > 0 && (
        <div className="border-t border-parchment-300 pt-5">
          <div className="eyebrow mb-3">Citations</div>
          <ul className="space-y-1.5 text-xs text-ink-soft font-mono">
            {result.citations.map((c, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-amber-deep">[{i + 1}]</span>
                <span className="text-ink-soft">
                  <span className="text-ink-muted mr-2">{c.docId}</span>
                  &ldquo;{c.excerpt}&rdquo;
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SignalRow({ label, value, tone }: { label: string; value: string; tone: "emerald" | "amber" | "terracotta" }) {
  const dot = {
    emerald: "bg-emerald-deep",
    amber: "bg-amber-warm",
    terracotta: "bg-terracotta",
  }[tone];
  return (
    <div className="flex items-baseline gap-3">
      <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 shrink-0", dot)} />
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-muted shrink-0 w-32">
        {label}
      </span>
      <span className="text-sm text-ink leading-snug">{value}</span>
    </div>
  );
}
