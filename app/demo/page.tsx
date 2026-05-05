"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

// ─── Sample queries (Patrick can click) ───────────────────────────────────
const SAMPLE_QUERIES = [
  { icon: "🥭", text: "ต้องการทุเรียน Monthong 50 ตัน ส่งดูไบ Q3 2569" },
  { icon: "🌾", text: "Looking for organic jasmine rice 200 tons EU certification" },
  { icon: "🧶", text: "Thai silk supplier — luxury hospitality 5-star hotel chain" },
  { icon: "🦐", text: "Premium frozen shrimp 100 tons HACCP for Japanese market" },
];

// ─── LLM Router stages ────────────────────────────────────────────────────
type RouterStage = {
  id: string;
  step: string;
  model: string;
  task: string;
  cost: number;
  duration: number; // ms simulated
  reason: string;
};

const ROUTER_STAGES: RouterStage[] = [
  { id: "parse", step: "1", model: "Gemini Flash", task: "Parse Query (NER + intent)", cost: 0.0001, duration: 600, reason: "Fast + cheap for structured extraction" },
  { id: "embed", step: "2", model: "text-embedding-3", task: "Embed query → vector", cost: 0.00002, duration: 400, reason: "Standard embedding for similarity search" },
  { id: "rag", step: "3", model: "Supabase pgvector", task: "RAG: BOI + supplier DB", cost: 0, duration: 500, reason: "Local vector search, no LLM cost" },
  { id: "reason", step: "4", model: "Claude Sonnet 4.6", task: "Match reasoning + cite", cost: 0.003, duration: 1400, reason: "Quality reasoning for trust matching" },
  { id: "verify", step: "5", model: "Rule engine", task: "Verify cert + tier", cost: 0, duration: 300, reason: "No LLM — deterministic rules" },
];

// ─── Mock Suppliers (the matched results) ─────────────────────────────────
const MATCHED_SUPPLIERS = [
  {
    id: "sup-001",
    name: "สวนทุเรียนคุณวิชัย — จันทบุรี",
    tier: "Patrick's Circle",
    score: 96,
    badge: "👑",
    capacity: "120 ตัน/ปี",
    certs: ["GAP", "GlobalG.A.P.", "FDA"],
    matchReason: "Capacity ครอบคลุม · GAP + GlobalG.A.P. ครบสำหรับ EU/ME · เคยส่งออก UAE 3 ครั้ง",
    confidence: 0.94,
  },
  {
    id: "sup-007",
    name: "Premium Orchard Group — ระยอง",
    tier: "Top Performer",
    score: 82,
    badge: "🏆",
    capacity: "80 ตัน/ปี",
    certs: ["GAP", "FDA"],
    matchReason: "Capacity พอดี · ส่งออก Singapore + HK เป็นหลัก · ใหม่กับ GCC market",
    confidence: 0.81,
  },
  {
    id: "sup-012",
    name: "Eastern Thai Fruit Co-op — ตราด",
    tier: "Reliable",
    score: 67,
    badge: "⭐",
    capacity: "200 ตัน/ปี",
    certs: ["GAP"],
    matchReason: "Capacity เกินพอ · price competitive · ไม่มี GlobalG.A.P. (อาจจำเป็นสำหรับ Dubai HNW)",
    confidence: 0.65,
  },
];

// ─── BOI / Customs RAG data ───────────────────────────────────────────────
const BOI_CITATIONS = [
  {
    source: "BOI",
    title: "Thailand Durian Export Statistics 2024",
    snippet: "Thailand exported 928,000 tons of fresh durian in 2024, valued at $4.65B USD — with UAE imports growing 47% YoY.",
    url: "boi.go.th/exports/2024/durian",
    confidence: 0.96,
  },
  {
    source: "กรมศุลกากร",
    title: "Customs HS Code 0810.60 — Durian",
    snippet: "Top destinations 2024: China (62%), Hong Kong (14%), UAE (8%, +47%), South Korea (5%), Indonesia (3%).",
    url: "customs.go.th/hs/081060",
    confidence: 0.98,
  },
  {
    source: "DITP",
    title: "Middle East Premium Fruit Demand Report Q4 2024",
    snippet: "GCC HNW market premium fruit segment grew 38% YoY — Monthong commands $18-24/kg retail in Dubai luxury supermarkets.",
    url: "ditp.go.th/reports/me-fruit-2024",
    confidence: 0.91,
  },
];

// ─── Cascading Demand Layers ──────────────────────────────────────────────
type DemandNode = {
  id: string;
  layer: number;
  label: string;
  detail: string;
  icon: string;
  color: string;
  parent?: string;
};

const DEMAND_TREE: DemandNode[] = [
  // Layer 1 — Primary
  { id: "L1", layer: 1, label: "Dubai HNW Buyer", detail: "50 ตัน Monthong · Q3 2569 · $20K/ton", icon: "🌍", color: "amber" },
  // Layer 2 — Direct services
  { id: "L2-1", layer: 2, label: "Cold-Chain Forwarder", detail: "GCC corridor · -18°C · 3 reefer containers", icon: "📦", color: "sky", parent: "L1" },
  { id: "L2-2", layer: 2, label: "Export Insurance", detail: "Marine cargo · perishable rider · ฿180K premium", icon: "🛡️", color: "sky", parent: "L1" },
  { id: "L2-3", layer: 2, label: "FX Hedge", detail: "USD/THB forward 90-day · ฿35M notional", icon: "💱", color: "sky", parent: "L1" },
  // Layer 3 — Skills + secondary
  { id: "L3-1", layer: 3, label: "EN-AR Coordinator", detail: "Bilingual export coord · จันทบุรี-based · 6-mo contract", icon: "👨‍💼", color: "emerald", parent: "L2-1" },
  { id: "L3-2", layer: 3, label: "Quality Inspector", detail: "Brix ≥ 32 · maturity grading · GCC compliance", icon: "🔍", color: "emerald", parent: "L2-1" },
  { id: "L3-3", layer: 3, label: "Halal Certification Agent", detail: "GCC-recognized halal cert · 14-day turnaround", icon: "📋", color: "emerald", parent: "L2-2" },
  // Layer 4 — Education / training
  { id: "L4-1", layer: 4, label: "Vocational EN Trainer", detail: "Export English program · จันทบุรี Vocational · 80 students", icon: "🏫", color: "rose", parent: "L3-1" },
  { id: "L4-2", layer: 4, label: "GAP Audit Training", detail: "120 farmers in district · 6-month certification path", icon: "🌱", color: "rose", parent: "L3-2" },
];

// ─── Helper components ────────────────────────────────────────────────────
function StatusDot({ active, done }: { active: boolean; done: boolean }) {
  return (
    <div className="relative w-3 h-3 shrink-0">
      {done ? (
        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
      ) : active ? (
        <>
          <div className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75"></div>
          <div className="absolute inset-0 rounded-full bg-amber-500"></div>
        </>
      ) : (
        <div className="w-3 h-3 rounded-full bg-stone-300"></div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────
export default function DemoPage() {
  const [query, setQuery] = useState("");
  const [running, setRunning] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [showCitations, setShowCitations] = useState(false);
  const [showCascade, setShowCascade] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  const totalCost = ROUTER_STAGES.reduce((sum, s) => sum + s.cost, 0);

  const runQuery = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setRunning(true);
    setActiveStage(-1);
    setCompletedStages(new Set());
    setShowResults(false);
    setShowCitations(false);
    setShowCascade(false);
    setStreamedText("");

    // Run each stage sequentially
    for (let i = 0; i < ROUTER_STAGES.length; i++) {
      setActiveStage(i);
      await new Promise(r => setTimeout(r, ROUTER_STAGES[i].duration));
      setCompletedStages(prev => new Set([...prev, i]));
    }

    setActiveStage(-1);
    setShowResults(true);

    // Stream reasoning text
    const reasoning = `พบ supplier ที่ verified แล้ว 3 ราย — รวม Patrick's Circle 1 ราย\n\nMatch หลัก: สวนคุณวิชัย (จันทบุรี) — capacity 120 ตัน + GAP + GlobalG.A.P. + เคยส่ง UAE 3 ครั้ง\nMatch รอง: Premium Orchard (ระยอง) + Eastern Thai Co-op (ตราด)\n\nแหล่งข้อมูล: BOI 2024, กรมศุลกากร HS 0810.60, DITP ME report Q4`;
    for (let i = 0; i <= reasoning.length; i++) {
      setStreamedText(reasoning.slice(0, i));
      await new Promise(r => setTimeout(r, 12));
    }

    await new Promise(r => setTimeout(r, 300));
    setShowCitations(true);
    await new Promise(r => setTimeout(r, 800));
    setShowCascade(true);
    setRunning(false);

    // scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <main className="min-h-screen bg-cream">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-sage-900 to-ink text-cream">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-72 h-72 rounded-full bg-amber-500 blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-sage-400 blur-3xl"></div>
        </div>
        <div className="container-soft relative py-16 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 border border-amber-400/30 text-amber-300 rounded-full text-xs font-medium uppercase tracking-wider">
            🪄 Live AI Matching · Tech Showcase
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            ThailandGPT <span className="text-amber-300">in Action</span>
          </h1>
          <p className="text-lg text-cream/80 max-w-3xl mx-auto">
            พิมพ์สิ่งที่อยากซื้อ — AI route ผ่าน 5 stages → match supplier → cite BOI → reveal cascading demand
          </p>
        </div>
      </section>

      <div className="container-soft py-10 space-y-10">

        {/* ── Query Input ─────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="card p-6 bg-white border-2 border-amber-200 space-y-4 shadow-lg">
            <label className="block">
              <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">
                พิมพ์ความต้องการของคุณ (TH หรือ EN)
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="เช่น: ต้องการทุเรียน Monthong 50 ตัน ส่งดูไบ Q3 2569"
                disabled={running}
                rows={2}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none text-ink resize-none disabled:bg-stone-50"
              />
            </label>
            <button
              onClick={() => runQuery(query)}
              disabled={running || !query.trim()}
              className="w-full btn-primary py-3 text-base disabled:opacity-50"
            >
              {running ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></span>
                  AI กำลัง match...
                </span>
              ) : (
                <>🔍  Run AI Matching</>
              )}
            </button>
            {/* Sample queries */}
            <div className="space-y-2">
              <div className="text-xs text-ink-muted">ลอง query ตัวอย่าง:</div>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_QUERIES.map(q => (
                  <button
                    key={q.text}
                    onClick={() => runQuery(q.text)}
                    disabled={running}
                    className="text-xs px-3 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 disabled:opacity-50 transition-colors"
                  >
                    {q.icon} {q.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── LLM ROUTER VISUALIZATION ────────────────────────────────── */}
        <section className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">🧠 LLM Router — Multi-Model Intelligence</h2>
            <p className="text-ink-muted text-sm mt-1">
              เลือก model ที่เหมาะกับ task เพื่อ optimize cost + quality
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {ROUTER_STAGES.map((stage, i) => {
              const isActive = activeStage === i;
              const isDone = completedStages.has(i);
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card p-4 border-2 transition-all space-y-2 ${
                    isActive ? "border-amber-400 bg-amber-50 shadow-lg scale-105" :
                    isDone ? "border-emerald-300 bg-emerald-50/50" :
                    "border-stone-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-ink-muted">STAGE {stage.step}</div>
                    <StatusDot active={isActive} done={isDone} />
                  </div>
                  <div className="font-semibold text-sm text-ink leading-tight">{stage.task}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block font-mono ${
                    stage.cost === 0 ? "bg-emerald-100 text-emerald-700" :
                    stage.cost < 0.001 ? "bg-sky-100 text-sky-700" :
                    "bg-amber-100 text-amber-800"
                  }`}>
                    {stage.model}
                  </div>
                  <div className="text-[11px] text-ink-soft italic leading-snug">
                    {stage.reason}
                  </div>
                  <div className="text-xs font-mono text-ink-muted border-t border-stone-100 pt-1">
                    {stage.cost === 0 ? "FREE" : `$${stage.cost.toFixed(4)}`}
                  </div>
                </motion.div>
              );
            })}
          </div>
          {/* Cost summary */}
          <div className="card p-4 bg-ink text-cream flex items-center justify-between flex-wrap gap-3">
            <div className="text-sm">
              <span className="text-cream/60">Total cost per query:</span>{" "}
              <span className="font-mono font-bold text-amber-300 text-lg">${totalCost.toFixed(4)}</span>
              <span className="text-cream/50 ml-2">≈ ฿{(totalCost * 35).toFixed(3)}</span>
            </div>
            <div className="text-xs text-cream/60">
              💡 Single-model GPT-4 baseline ≈ <span className="font-mono">$0.012</span> · Router saves <span className="text-amber-300 font-bold">71%</span>
            </div>
          </div>
        </section>

        <div ref={resultsRef}></div>

        {/* ── RESULTS — Matched Suppliers ─────────────────────────────── */}
        <AnimatePresence>
          {showResults && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-ink">🎯 Matched Suppliers</h2>
                <p className="text-ink-muted text-sm mt-1">
                  AI reasoning + confidence score + citation
                </p>
              </div>

              {/* Streaming reasoning */}
              <div className="card p-5 bg-gradient-to-br from-sage-50 to-cream border-l-4 border-sage-400">
                <div className="text-xs font-semibold text-sage-700 uppercase tracking-wider mb-2">
                  🤖 AI Reasoning (Claude Sonnet 4.6)
                </div>
                <pre className="font-sans text-sm text-ink whitespace-pre-wrap leading-relaxed">
                  {streamedText}
                  {streamedText.length < 250 && <span className="inline-block w-2 h-4 bg-amber-500 animate-pulse ml-1 align-middle"></span>}
                </pre>
              </div>

              {/* Supplier cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {MATCHED_SUPPLIERS.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className={`card p-5 border-2 space-y-3 ${
                      i === 0 ? "border-amber-400 bg-gradient-to-br from-amber-50 to-cream" : "border-stone-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{s.badge}</span>
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider text-ink-muted">Confidence</div>
                        <div className="text-lg font-bold text-emerald-600">{(s.confidence * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-ink">{s.name}</div>
                      <div className="text-xs text-ink-muted mt-0.5">{s.tier} · Score {s.score}</div>
                    </div>
                    <div className="text-sm text-ink-soft">
                      <strong>Capacity:</strong> {s.capacity}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.certs.map(c => (
                        <span key={c} className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] rounded-full font-medium">
                          ✓ {c}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-ink-soft border-t border-stone-100 pt-2 italic">
                      {s.matchReason}
                    </div>
                    {/* Confidence bar */}
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.confidence * 100}%` }}
                        transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                        className={i === 0 ? "h-full bg-amber-500" : "h-full bg-sage-500"}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── RAG CITATIONS — BOI Data ────────────────────────────────── */}
        <AnimatePresence>
          {showCitations && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-ink">📚 RAG Citations — แหล่งข้อมูลจริง</h2>
                <p className="text-ink-muted text-sm mt-1">
                  AI ดึงจาก BOI · กรมศุลกากร · DITP · vector search ใน Supabase pgvector
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {BOI_CITATIONS.map((c, i) => (
                  <motion.div
                    key={c.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="card p-5 border border-sky-200 bg-white space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-1 bg-sky-100 text-sky-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                        📄 {c.source}
                      </span>
                      <span className="text-xs text-emerald-600 font-mono font-semibold">
                        {(c.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-ink leading-tight">{c.title}</h3>
                    <blockquote className="text-xs text-ink-soft italic border-l-2 border-sky-300 pl-3 leading-relaxed">
                      &ldquo;{c.snippet}&rdquo;
                    </blockquote>
                    <div className="text-[10px] font-mono text-ink-muted truncate flex items-center gap-1">
                      🔗 {c.url}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── CASCADING DEMAND TREE ───────────────────────────────────── */}
        <AnimatePresence>
          {showCascade && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-ink">🌊 Cascading Demand — Sub-Economy</h2>
                <p className="text-ink-muted text-sm mt-1">
                  1 ดีลใหญ่ → trigger demand chain 4 layer · platform monetize ทุก layer
                </p>
              </div>

              {/* Tree visualization */}
              <div className="card p-6 bg-gradient-to-br from-ink via-sage-900 to-ink text-cream">
                <div className="space-y-6">
                  {[1, 2, 3, 4].map(layer => {
                    const nodes = DEMAND_TREE.filter(n => n.layer === layer);
                    const layerLabels = {
                      1: { label: "LAYER 1 · Primary Demand", color: "text-amber-300", desc: "ดีลหลัก — buyer ต้องการ" },
                      2: { label: "LAYER 2 · Direct Services", color: "text-sky-300", desc: "บริการที่ตามมาทันที" },
                      3: { label: "LAYER 3 · Skill Demand", color: "text-emerald-300", desc: "ทักษะ + งานเฉพาะทาง" },
                      4: { label: "LAYER 4 · Education", color: "text-rose-300", desc: "ฝึกอบรม + แรงงานรุ่นใหม่" },
                    };
                    const info = layerLabels[layer as keyof typeof layerLabels];
                    return (
                      <motion.div
                        key={layer}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: layer * 0.3 }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`text-xs font-bold uppercase tracking-wider ${info.color}`}>
                            {info.label}
                          </div>
                          <div className="text-xs text-cream/50">— {info.desc}</div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {nodes.map((n, i) => {
                            const colMap: Record<string, string> = {
                              amber: "bg-amber-500/20 border-amber-400/40 text-amber-200",
                              sky: "bg-sky-500/20 border-sky-400/40 text-sky-200",
                              emerald: "bg-emerald-500/20 border-emerald-400/40 text-emerald-200",
                              rose: "bg-rose-500/20 border-rose-400/40 text-rose-200",
                            };
                            return (
                              <motion.div
                                key={n.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: layer * 0.3 + i * 0.1 }}
                                className={`rounded-2xl p-3 border-2 ${colMap[n.color]} backdrop-blur-sm`}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="text-xl shrink-0">{n.icon}</span>
                                  <div className="space-y-1 min-w-0">
                                    <div className="font-semibold text-sm leading-tight">{n.label}</div>
                                    <div className="text-[11px] text-cream/70 leading-snug">{n.detail}</div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                        {layer < 4 && (
                          <div className="flex justify-center my-3">
                            <motion.div
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ delay: layer * 0.3 + 0.5 }}
                              className="w-px h-6 bg-gradient-to-b from-amber-400 to-transparent"
                            ></motion.div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Bottom insight */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.8 }}
                  className="mt-8 pt-6 border-t border-cream/20 text-center"
                >
                  <div className="text-amber-300 font-semibold mb-1">💡 Strategic Insight</div>
                  <p className="text-sm text-cream/80 max-w-3xl mx-auto leading-relaxed">
                    Platform ไม่ได้แค่ปิดดีล Layer 1 ($1M commission) —{" "}
                    <span className="text-amber-300 font-semibold">monetize Layer 2-4 เป็น recurring revenue</span>{" "}
                    (logistics, training partnership, B2G data)
                  </p>
                </motion.div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Bottom Nav ──────────────────────────────────────────────── */}
        <div className="flex gap-3 flex-wrap justify-center pt-6 border-t border-stone-200">
          <Link href="/present/patrick" className="btn-secondary">← Patrick Pitch</Link>
          <Link href="/browse" className="btn-secondary">Browse Suppliers</Link>
          <Link href="/" className="btn-primary">หน้าแรก</Link>
        </div>
      </div>
    </main>
  );
}
