import type { Slide } from "@/lib/slides";

/**
 * One render function per slide kind. Centralised so SlidesViewer stays thin.
 */
export function SlideContent({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "cover":
      return <CoverSlide />;
    case "agenda":
      return <AgendaSlide />;
    case "ask":
      return <AskSlide />;
    case "mission":
      return <MissionSlide />;
    case "problem":
      return <ProblemSlide />;
    case "pillars":
      return <PillarsSlide />;
    case "cascading":
      return <CascadingSlide />;
    case "what-built":
      return <WhatBuiltSlide />;
    case "journey-buyer":
      return <JourneyBuyerSlide />;
    case "journey-supplier":
      return <JourneySupplierSlide />;
    case "journey-patrick":
      return <JourneyPatrickSlide />;
    case "roadmap":
      return <RoadmapSlide />;
    case "budget":
      return <BudgetSlide />;
    case "timeline":
      return <TimelineSlide />;
    case "resource":
      return <ResourceSlide />;
    case "risks":
      return <RisksSlide />;
    case "opportunities":
      return <OpportunitiesSlide />;
    case "asks":
      return <AsksSlide />;
    case "questions":
      return <QuestionsSlide />;
    case "closing":
      return <ClosingSlide />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Cover                                                              */
/* ------------------------------------------------------------------ */

function CoverSlide() {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="eyebrow mb-6 text-amber-soft">Vol. 0 · Issue 01 · Internal Demo</div>
      <h1
        className="font-display text-display-2xl text-balance leading-[0.92]"
        style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}
      >
        Stage 0 <em className="not-italic text-amber-soft">Demo</em>
        <br />
        Review.
      </h1>
      <div className="mt-12 grid grid-cols-3 gap-8 max-w-3xl">
        <div>
          <div className="eyebrow mb-2 text-amber-soft/80">For</div>
          <div className="font-display text-2xl">Patrick</div>
          <div className="text-sm opacity-70">พฤสณัย มหัคฆพงศ์</div>
        </div>
        <div>
          <div className="eyebrow mb-2 text-amber-soft/80">Presented by</div>
          <div className="font-display text-2xl">Toni</div>
          <div className="text-sm opacity-70">Stage 0 Builder · Assistant</div>
        </div>
        <div>
          <div className="eyebrow mb-2 text-amber-soft/80">Date</div>
          <div className="font-display text-2xl">04 May 2026</div>
          <div className="text-sm opacity-70">30 min + Q&A</div>
        </div>
      </div>
      <div className="mt-16 inline-flex items-center gap-2 px-3 py-2 border border-amber-warm bg-amber-warm/10 text-amber-soft text-[0.65rem] tracking-[0.22em] uppercase font-mono w-fit">
        <span className="w-1.5 h-1.5 bg-amber-warm rounded-full animate-pulse" />
        Mock prototype · No real data
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Agenda                                                             */
/* ------------------------------------------------------------------ */

const AGENDA_ITEMS = [
  ["1", "ทบทวน vision — ตรงกันไหม?", "3 min"],
  ["2", "สิ่งที่ผมทำใน Stage 0", "5 min"],
  ["3", "Workflow & user journey", "5 min"],
  ["4", "Roadmap, budget, timeline", "5 min"],
  ["5", "Risk + strategic opportunity", "4 min"],
  ["6", "สิ่งที่ผมต้องการจากพี่", "3 min"],
  ["7", "Q&A — 5 คำถามปิดท้าย", "5 min"],
];

function AgendaSlide() {
  return (
    <div className="grid grid-cols-12 gap-8 h-full">
      <div className="col-span-7">
        <ul className="border-t border-parchment-300">
          {AGENDA_ITEMS.map(([n, label, dur]) => (
            <li key={n} className="grid grid-cols-[60px_1fr_80px] items-baseline gap-6 py-4 border-b border-parchment-300 group">
              <span className="font-display text-3xl figure-num text-ink/40 group-hover:text-emerald-deep transition-colors">
                {n}
              </span>
              <span className="text-xl">{label}</span>
              <span className="text-right text-sm font-mono text-ink-muted">{dur}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-5 pl-8 border-l border-parchment-300">
        <div className="eyebrow mb-3">Format</div>
        <p className="text-base leading-relaxed text-ink-soft mb-6">
          1-on-1 walkthrough. Every section ends with a yellow-flagged question for พี่ Patrick to answer (or commit a date to answer).
        </p>
        <div className="eyebrow mb-3">Outcome ที่ต้องการ</div>
        <ul className="space-y-2 text-sm text-ink-soft">
          <li>· GO / NO-GO / PIVOT decision</li>
          <li>· 9 commitments จาก Patrick (slide 18)</li>
          <li>· 5 strategic answers (slide 19)</li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ask                                                                */
/* ------------------------------------------------------------------ */

function AskSlide() {
  return (
    <div className="max-w-5xl">
      <p className="text-2xl lg:text-3xl leading-[1.4] text-ink-soft mb-12">
        Stage 0 (mock POC) เสร็จแล้ว — ผมต้องการ <strong className="text-ink font-semibold">3 อย่าง</strong> จากพี่:
      </p>

      <ol className="space-y-8 max-w-3xl">
        {[
          ["01", "ดู demo + confirm vision ตรงกันไหม"],
          ["02", "ตัดสินใจ — GO ต่อ Stage 1 / PIVOT / NO-GO"],
          ["03", "ถ้า GO — commit สิ่งที่พี่ต้องทำก่อน Stage 1 start (มี checklist ปลายเอกสาร)"],
        ].map(([n, label]) => (
          <li key={n} className="flex items-baseline gap-6">
            <span className="font-display text-5xl figure-num text-emerald-deep" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
              {n}
            </span>
            <span className="text-xl text-ink leading-snug">{label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-14 pt-8 border-t border-parchment-300 max-w-3xl bg-amber-warm/5 -mx-6 px-6 py-5 border-l-2 border-amber-warm">
        <div className="eyebrow mb-2 text-amber-deep">Important reminder</div>
        <p className="text-base text-ink leading-relaxed">
          ผม (Toni) เป็น <strong>ผู้ช่วย</strong> — ตัดสินใจ tech ได้ แต่ business / brand / legal / hiring พี่เป็นผู้ตัดสินใจ
          ผมไม่ commit role co-founder — พี่ต้องหา <strong>co-signer แยก</strong>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mission                                                            */
/* ------------------------------------------------------------------ */

function MissionSlide() {
  return (
    <div className="grid grid-cols-12 gap-10 h-full">
      <div className="col-span-7">
        <blockquote className="font-display text-2xl lg:text-3xl leading-[1.3] text-ink mb-10 border-l-2 border-emerald-deep pl-6 italic" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>
          ThailandGPT คือ <span className="text-emerald-deep not-italic">National Execution Layer</span> — Connection Gateway ที่เชื่อม Global Demand ↔ Thai Real Supply ผ่าน AI + Human Verification
        </blockquote>

        <table className="w-full text-sm">
          <tbody>
            {[
              ["Tagline", <strong key="t" className="text-emerald-deep">Local Verify, Global Confidence</strong>],
              ["Metaphor", <strong key="m" className="text-amber-deep">Jet Ski</strong>, " — ไม่ใช่ Cargo Ship"],
              ["Operating Model", "One Man Company — AI backend, ผู้บริหาร focus connection + verification"],
              ["Time Horizon", "4 ปี ก่อน AI ดิสรัปตลาดแรงงานไทยถาวร"],
              ["Differentiation", "Human-in-the-loop ส่งคนจริงไป verify + ปิดดีล"],
            ].map((row, i) => (
              <tr key={i} className="border-b border-parchment-300">
                <td className="py-3 pr-4 align-top w-44 eyebrow">{row[0]}</td>
                <td className="py-3 text-ink">{row.slice(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="col-span-5 bg-amber-warm/10 border-l-2 border-amber-warm p-6 rounded-sm flex flex-col justify-center">
        <div className="eyebrow mb-3 text-amber-deep">คำถามที่ 1</div>
        <p className="font-display text-2xl text-ink leading-snug" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>
          Mission และ positioning ตามนี้ — ตรงกับ vision ที่พี่คิดหรือยังครับ?
        </p>
        <p className="mt-4 text-sm text-ink-soft">
          ถ้ามีส่วนที่ต้องปรับ ขอ flag ตรงนี้ก่อนผม walkthrough demo
        </p>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Problem                                                            */
/* ------------------------------------------------------------------ */

const PROBLEMS = [
  ["ความเร็ว", "ติดราชการ + นายหน้า", "Speed of Execution — ตัดทุก step ที่ไม่สร้างมูลค่า"],
  ["ความโปร่งใส", "ค่าเสียเวลา + นายหน้าฉ้อฉล", "Standardized Protocol — ทุกดีลตรวจสอบได้ 100%"],
  ["ข้อมูล", "ล้าสมัย ไม่สะท้อนวันนี้", "Real-time Local Truth — กฎที่แก้เมื่อเช้ายังรู้"],
  ["การเชื่อมต่อ", "ต้องมี 'เส้นสาย'", "Direct C-Suite Access + หน่วยงานรัฐ"],
];

function ProblemSlide() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[180px_1fr_1fr] gap-x-6 py-3 border-b-2 border-ink/40 text-[0.65rem] uppercase tracking-[0.22em] font-mono text-ink-muted">
        <span>ปัญหา</span>
        <span>Cargo Ship (ปัจจุบัน)</span>
        <span>Jet Ski (TGPT)</span>
      </div>
      {PROBLEMS.map(([k, v1, v2]) => (
        <div key={k} className="grid grid-cols-[180px_1fr_1fr] gap-x-6 items-center py-4 border-b border-parchment-300">
          <span className="font-display text-xl text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>{k}</span>
          <span className="text-ink-muted">{v1}</span>
          <span className="text-emerald-deep font-medium">{v2}</span>
        </div>
      ))}
      <div className="mt-10 pt-6 border-t border-parchment-300 max-w-3xl">
        <div className="eyebrow mb-3">ผลลัพธ์ที่ต้องการ</div>
        <p className="text-lg text-ink leading-relaxed text-pretty">
          นักลงทุนดูไบต้องการทุเรียน 100 ตัน → <strong>ไม่ต้องเสี่ยงนายหน้าปลอม</strong> → matched + verified + closed in one place
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pillars                                                            */
/* ------------------------------------------------------------------ */

const PILLARS_DATA = [
  ["1", "Trustworthy", "Scam = 0, Error rate < 1%"],
  ["2", "Verification", "Field turnaround < 48h"],
  ["3", "Intelligence", "Query accuracy +30% vs Google"],
  ["4", "Connect", "MOU count, verified connections"],
  ["5", "Actionable", "Transaction completion > 60%"],
];

function PillarsSlide() {
  return (
    <div>
      <div className="grid grid-cols-5 gap-px bg-parchment-300 mb-12">
        {PILLARS_DATA.map(([n, name, kpi]) => (
          <div key={n} className="bg-parchment-50 p-5 min-h-[180px] flex flex-col">
            <span className="font-display text-5xl text-ink/30 mb-3 figure-num" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
              {n.padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl text-ink mb-3" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
              {name}
            </h3>
            <div className="mt-auto pt-3 border-t border-parchment-300">
              <div className="eyebrow mb-1">KPI</div>
              <div className="text-xs text-emerald-deep font-medium leading-snug">{kpi}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t-2 border-emerald-deep pt-6">
        <div className="eyebrow mb-3 text-emerald-deep">Core Sequence</div>
        <div className="flex items-center gap-6 lg:gap-10 flex-wrap">
          {["Ask", "Check", "Select", "Connect", "Transact"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-3">
              <span className="font-display text-3xl text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
                {s}
              </span>
              {i < arr.length - 1 && <span className="text-amber-warm text-xl">→</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cascading                                                          */
/* ------------------------------------------------------------------ */

const LAYERS = [
  ["L1", "Primary", "Dubai investor → 50 ตัน Monthong", "emerald"],
  ["L2", "Cascading", "Cold-chain forwarder for GCC corridor", "amber"],
  ["L3", "Cascading", "English-speaking export coordinator", "amber"],
  ["L4", "Tertiary", "Vocational English trainer in จันทบุรี", "terracotta"],
];

function CascadingSlide() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-5">
        <p className="text-base text-ink-soft leading-relaxed mb-8">
          <span className="eyebrow block mb-2">Insight (Panel B)</span>
          ทุก demand signal คือ <strong>tip ของ iceberg</strong> — platform เห็น Layer 1 แต่ trigger Layer 2-4 ที่เป็น sub-economy
        </p>

        <div className="bg-amber-warm/10 border-l-2 border-amber-warm p-5">
          <div className="eyebrow mb-2 text-amber-deep">Implication</div>
          <p className="text-sm text-ink leading-relaxed">
            Monetize Layer 1 (commission) <strong>+ เปิด Layer 2-4 เป็น revenue stream แยก</strong> — training partnership, B2G data, supplier development
          </p>
        </div>

        <div className="mt-8 p-5 border border-parchment-300 bg-parchment-50">
          <div className="eyebrow mb-2">คำถามที่ 2</div>
          <p className="text-base text-ink leading-snug">
            เห็นด้วยกับการ position TGPT เป็น <strong>multi-layer market intelligence</strong> ไม่ใช่ pure marketplace?
          </p>
        </div>
      </div>

      <ol className="col-span-7 space-y-px bg-parchment-300">
        {LAYERS.map(([idx, role, ex, tone]) => (
          <li key={idx} className="grid grid-cols-12 items-center gap-3 bg-parchment-50 p-5">
            <span
              className={`col-span-1 font-mono text-sm font-medium ${
                tone === "emerald" ? "text-emerald-deep" : tone === "amber" ? "text-amber-deep" : "text-terracotta"
              }`}
            >
              {idx}
            </span>
            <span className="col-span-3 eyebrow">{role}</span>
            <span className="col-span-7 text-base text-ink">{ex}</span>
            <span
              className={`col-span-1 justify-self-end w-2 h-2 rounded-full ${
                tone === "emerald" ? "bg-emerald-deep" : tone === "amber" ? "bg-amber-warm" : "bg-terracotta"
              }`}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  What built                                                         */
/* ------------------------------------------------------------------ */

const SURFACES = [
  ["/", "Landing page", "Vision + protocol + cascading + roadmap + supplier catalogue"],
  ["/chat", "Terminal", "Buyer enquiry → AI matches verified suppliers + cite sources"],
  ["/suppliers/[id]", "Supplier profile", "Verified credentials, certs, deal history, gradient hero"],
  ["/deals/[id]", "Deal Room", "Pipeline (I→VI), mock thread (TH+EN), Patrick sign-off badge"],
  ["/dashboard", "Operator's Desk", "Pipeline, tier distribution, strategic signal log"],
];

function WhatBuiltSlide() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-8">
        <p className="text-lg text-ink-soft mb-6">
          <span className="eyebrow block mb-2">Live demo</span>
          <code className="font-mono text-emerald-deep">tgpt-demo.vercel.app</code> · Vercel Free tier · <strong>$0 infra</strong>
        </p>
        <ol className="space-y-px bg-parchment-300 border border-parchment-300">
          {SURFACES.map(([path, name, desc]) => (
            <li key={path} className="bg-parchment-50 p-4 grid grid-cols-12 gap-3 items-center">
              <span className="col-span-3 font-mono text-xs text-emerald-deep">{path}</span>
              <span className="col-span-3 font-display text-lg text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
                {name}
              </span>
              <span className="col-span-6 text-sm text-ink-soft">{desc}</span>
            </li>
          ))}
        </ol>
      </div>

      <aside className="col-span-4 space-y-5">
        <div className="border border-parchment-300 bg-parchment-50 p-5">
          <div className="eyebrow mb-2">Tech stack</div>
          <ul className="text-sm text-ink-soft font-mono space-y-1">
            <li>· Next.js 16 + Tailwind</li>
            <li>· Gemini 1.5 Flash (free)</li>
            <li>· BFF security pattern</li>
            <li>· Mock data only</li>
          </ul>
        </div>
        <div className="border border-parchment-300 bg-parchment-50 p-5">
          <div className="eyebrow mb-2">Design</div>
          <p className="text-sm text-ink-soft leading-relaxed">
            Editorial Thai Luxury — Aman × Monocle × Bloomberg Terminal
          </p>
        </div>
        <div className="border border-amber-warm bg-amber-warm/10 p-5">
          <div className="eyebrow mb-2 text-amber-deep">Reminder</div>
          <p className="text-xs text-ink leading-relaxed">
            <strong>ALL DATA IS MOCK.</strong> No real Patrick&apos;s network. No real PII. Demo only.
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Journey — Buyer                                                    */
/* ------------------------------------------------------------------ */

const BUYER_JOURNEY = [
  "รู้จัก TGPT จาก G2G referral / Patrick's network",
  "เปิด landing page → เห็น 'Verified by Patrick&apos;s Circle'",
  "คลิก Terminal → พิมพ์ enquiry (EN / AR / CN / TH)",
  "AI return: 3-5 verified suppliers + match reason + cite",
  "คลิกดู supplier profile → certs (GAP, GlobalG.A.P., FDA)",
  "กด 'Request to Connect' → Deal Room ที่ direct ถึง decision-maker",
  "เจรจา → field verification → escrow → close",
  "Post-close review → buyer recommends to peer (viral loop)",
];

function JourneyBuyerSlide() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-7">
        <ol className="space-y-3">
          {BUYER_JOURNEY.map((step, i) => (
            <li key={i} className="grid grid-cols-[44px_1fr] gap-4 items-start">
              <span className="font-display text-xl text-ink/50 figure-num pt-0.5" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base text-ink leading-relaxed" dangerouslySetInnerHTML={{ __html: step }} />
            </li>
          ))}
        </ol>
      </div>
      <aside className="col-span-5">
        <div className="border border-parchment-300 bg-parchment-50 p-6 mb-5">
          <div className="eyebrow mb-3">Persona</div>
          <div className="font-display text-2xl text-ink mb-1" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
            Khalid Al-Mansoori
          </div>
          <div className="text-xs text-ink-muted font-mono mb-3">41 ปี · Dubai Family Office (fictional)</div>
          <p className="text-sm text-ink-soft">
            Trust signals: mutual contact &gt;&gt; track record &gt;&gt; documentation
          </p>
        </div>

        <div className="border-l-2 border-emerald-deep bg-parchment-50 p-5">
          <div className="eyebrow mb-3 text-emerald-deep">Wow moments</div>
          <ul className="text-sm text-ink-soft space-y-1.5">
            <li>· Step 4 — AI accuracy + cite</li>
            <li>· Step 5 — verification depth</li>
            <li>· Step 7 — post-close trust</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Journey — Supplier                                                 */
/* ------------------------------------------------------------------ */

const SUPPLIER_JOURNEY = [
  "Onboard ผ่าน Patrick&apos;s network OR DBD/BOI verification",
  "Profile setup + cert upload + capacity declaration",
  "รอ field verification (Toni&apos;s verifier ลงพื้นที่)",
  "Get tier badge: New → Trusted → Pro → Elite",
  "รับ 'Demand Alert' — buyer ที่ตรงกับ supply",
  "เจรจาใน Deal Room → close",
  "Post-close: review จาก buyer → tier upgrade + feature listing",
];

function JourneySupplierSlide() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-7">
        <ol className="space-y-3">
          {SUPPLIER_JOURNEY.map((step, i) => (
            <li key={i} className="grid grid-cols-[44px_1fr] gap-4 items-start">
              <span className="font-display text-xl text-ink/50 figure-num pt-0.5" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-base text-ink leading-relaxed" dangerouslySetInnerHTML={{ __html: step }} />
            </li>
          ))}
        </ol>
      </div>
      <aside className="col-span-5">
        <div className="border border-parchment-300 bg-parchment-50 p-6 mb-5">
          <div className="eyebrow mb-3">Persona</div>
          <div className="font-display text-2xl text-ink mb-1" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
            คุณวิชัย ตันติเวชกุล
          </div>
          <div className="text-xs text-ink-muted font-mono mb-3">56 ปี · สวนทุเรียนจันทบุรี (fictional)</div>
          <p className="text-sm text-ink-soft">
            Third-generation orchard, GAP + GlobalG.A.P. certified, 200t/mo capacity
          </p>
        </div>

        <div className="border-l-2 border-amber-warm bg-amber-warm/10 p-5">
          <div className="eyebrow mb-3 text-amber-deep">Stage 0 status</div>
          <p className="text-sm text-ink leading-relaxed">
            Step 3-7 เป็น <strong>mock</strong> ใน demo. Stage 2 MVP จะเริ่ม real onboarding — ต้องการ Patrick&apos;s first 20 suppliers
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Journey — Patrick                                                  */
/* ------------------------------------------------------------------ */

const PATRICK_TOUCHPOINTS = [
  ["Pre-onboard", "Endorse supplier เข้า 'Patrick&apos;s Circle'", "ตามที่ network expand"],
  ["High-value deal sign-off", "อนุมัติก่อน payment release (>USD 100K)", "รายดีล"],
  ["Strategic", "Review demand heatmap → market expansion", "รายเดือน"],
  ["MOU", "G2G deals (BOI, รัฐบาลต่างประเทศ)", "Quarterly"],
  ["Quarterly", "Tier promotions + de-list flagged", "Quarterly"],
];

function JourneyPatrickSlide() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-ink/40">
              <th className="text-left py-3 eyebrow">ช่วงเวลา</th>
              <th className="text-left py-3 eyebrow">สิ่งที่ Patrick ทำ</th>
              <th className="text-left py-3 eyebrow">ความถี่</th>
            </tr>
          </thead>
          <tbody>
            {PATRICK_TOUCHPOINTS.map(([when, what, freq]) => (
              <tr key={when} className="border-b border-parchment-300">
                <td className="py-4 pr-4 align-top font-display text-lg text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>{when}</td>
                <td className="py-4 pr-4 text-ink-soft" dangerouslySetInnerHTML={{ __html: what }} />
                <td className="py-4 text-xs font-mono text-ink-muted">{freq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="col-span-4 bg-amber-warm/10 border-l-2 border-amber-warm p-6 self-start">
        <div className="eyebrow mb-3 text-amber-deep">คำถามที่ 3</div>
        <p className="font-display text-xl text-ink leading-snug mb-4" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>
          พี่พร้อม commit เวลาประมาณกี่ ชม./สัปดาห์ สำหรับ role นี้?
        </p>
        <p className="text-sm text-ink-soft leading-relaxed">
          ผมประเมิน:
          <br />
          · Stage 1 — <strong>~3-5 ชม./สัปดาห์</strong>
          <br />
          · Stage 2 — <strong>~5-10 ชม./สัปดาห์</strong>
        </p>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Roadmap                                                            */
/* ------------------------------------------------------------------ */

const STAGES_DATA = [
  ["0", "NOW", "2-4 wk", "$0", "Patrick only", "Toni", "active"],
  ["1", "External POC", "4-8 wk", "$50-150", "10-50 testers", "Patrick&apos;s team", "next"],
  ["2", "MVP", "12 wk", "$340-660", "100-500 users", "Full team", "planned"],
  ["3", "Scale", "6+ mo", "$1.5-7K", "10K+ MAU", "Scale team", "planned"],
];

function RoadmapSlide() {
  return (
    <div>
      <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_120px] gap-x-4 py-3 border-b-2 border-ink/40 text-[0.65rem] uppercase tracking-[0.22em] font-mono text-ink-muted">
        <span>Stage</span>
        <span>Name</span>
        <span>Duration</span>
        <span>Cost / mo</span>
        <span>Audience</span>
        <span>Owner</span>
        <span className="text-right">State</span>
      </div>
      {STAGES_DATA.map(([s, name, dur, cost, aud, owner, state]) => (
        <div
          key={s}
          className={`grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_120px] gap-x-4 items-center py-5 border-b border-parchment-300 ${state === "active" ? "bg-emerald-deep/5" : ""}`}
        >
          <span className="font-display text-3xl figure-num text-ink/70" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
            {s}
          </span>
          <span className="font-display text-lg text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }} dangerouslySetInnerHTML={{ __html: name }} />
          <span className="figure-num text-sm text-ink-soft">{dur}</span>
          <span className="figure-num text-sm text-ink-soft">{cost}</span>
          <span className="text-sm text-ink-soft">{aud}</span>
          <span className="text-sm text-ink-soft" dangerouslySetInnerHTML={{ __html: owner }} />
          <span className="text-right">
            {state === "active" ? (
              <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-deep text-amber-soft text-[0.6rem] tracking-[0.18em] uppercase font-mono">
                <span className="w-1.5 h-1.5 bg-amber-warm rounded-full animate-pulse" />
                Active
              </span>
            ) : state === "next" ? (
              <span className="inline-flex items-center px-2.5 py-1 border border-amber-warm text-amber-deep text-[0.6rem] tracking-[0.18em] uppercase font-mono">Next</span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 border border-parchment-300 text-ink-muted text-[0.6rem] tracking-[0.18em] uppercase font-mono">Planned</span>
            )}
          </span>
        </div>
      ))}

      <p className="mt-8 text-base text-ink-soft leading-relaxed border-l-2 border-amber-warm pl-5 max-w-3xl">
        <strong>Stage Gates:</strong> ทุก stage มี gate prerequisite — ต้องผ่านก่อนเปิด stage ถัดไป
        <br />
        <strong>Patrick = gatekeeper ทุก gate</strong> (ไม่มีใครเปิด stage ถัดไปได้ถ้าพี่ไม่ approve)
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Budget                                                             */
/* ------------------------------------------------------------------ */

const BUDGET_ROWS = [
  ["Infra (Vercel/Supabase/AI)", "$0", "$50-150/mo", "$340-660/mo", "$1.5-7K/mo"],
  ["Team THB/mo", "100-250K (Toni labor)", "+200-500K", "+600K-1.5M", "+2-5M"],
  ["Verification (freelance)", "—", "—", "50-150K/mo", "500K-2M/mo"],
  ["Legal one-time + retainer", "—", "200-500K (engage)", "50-150K/mo", "100-300K/mo"],
  ["Marketing", "—", "—", "200-500K (one-time)", "1-3M (ongoing)"],
];

function BudgetSlide() {
  return (
    <div>
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-x-4 py-3 border-b-2 border-ink/40 text-[0.65rem] uppercase tracking-[0.22em] font-mono text-ink-muted">
        <span>รายการ</span>
        <span>Stage 0</span>
        <span>Stage 1</span>
        <span>Stage 2</span>
        <span>Stage 3</span>
      </div>
      {BUDGET_ROWS.map((row) => (
        <div key={row[0]} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-x-4 py-3 border-b border-parchment-300 text-sm">
          <span className="text-ink font-medium">{row[0]}</span>
          <span className="text-ink-soft figure-num">{row[1]}</span>
          <span className="text-ink-soft figure-num">{row[2]}</span>
          <span className="text-ink-soft figure-num">{row[3]}</span>
          <span className="text-ink-soft figure-num">{row[4]}</span>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-6 mt-10">
        <div className="bg-emerald-deep/5 border-l-2 border-emerald-deep p-5">
          <div className="eyebrow mb-2 text-emerald-deep">Stage 0 actual spend</div>
          <p className="text-base text-ink">
            Toni&apos;s labor only — <strong>no cash out for Patrick</strong>
          </p>
        </div>
        <div className="bg-amber-warm/10 border-l-2 border-amber-warm p-5">
          <div className="eyebrow mb-2 text-amber-deep">Stage 1 ask</div>
          <p className="text-base text-ink">
            ~250-500K THB/mo × 4-8 weeks = <strong>~1-4M THB total commitment</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Timeline                                                           */
/* ------------------------------------------------------------------ */

const TIMELINE = [
  ["NOW", "4 พ.ค. 2569", "Stage 0 demo complete", "active"],
  ["+1 wk", "11 พ.ค.", "Patrick GO/NO-GO decision", "decision"],
  ["+1-4 wk", "พ.ค.-มิ.ย.", "Pre-Stage 1 setup (co-founder, lawyer, brand, network lock)", "setup"],
  ["+8-12 wk", "ก.ค.-ส.ค.", "Stage 1 launch — 10-50 testers", "milestone"],
  ["+5-6 mo", "ต.ค.-พ.ย.", "Stage 1 validated (LOI from 5 buyers + 20 suppliers)", "milestone"],
  ["+12-13 mo", "พ.ค. 2570", "Stage 2 MVP launch", "milestone"],
  ["+18-20 mo", "พ.ย. 2570", "Stage 2 first closed REAL deal", "milestone"],
];

function TimelineSlide() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-8">
        <ol className="relative">
          {TIMELINE.map((row, i) => (
            <li key={i} className="grid grid-cols-[100px_120px_1fr] gap-4 items-baseline py-4 border-b border-parchment-300 last:border-b-0">
              <span className={`font-mono text-sm font-medium ${row[3] === "active" ? "text-emerald-deep" : row[3] === "decision" ? "text-amber-deep" : "text-ink-muted"}`}>
                {row[0]}
              </span>
              <span className="text-xs font-mono text-ink-muted">{row[1]}</span>
              <span className={`text-base ${row[3] === "active" ? "text-emerald-deep font-medium" : row[3] === "decision" ? "text-amber-deep font-medium" : "text-ink"}`}>
                {row[2]}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <aside className="col-span-4">
        <div className="bg-terracotta/10 border-l-2 border-terracotta p-5">
          <div className="eyebrow mb-3 text-terracotta">Critical Path Bottlenecks</div>
          <ol className="space-y-2 text-sm text-ink-soft">
            <li><strong className="text-ink">1.</strong> Co-founder hire (2-3 mo)</li>
            <li><strong className="text-ink">2.</strong> Lawyer opinion on Credit Score regulation</li>
            <li><strong className="text-ink">3.</strong> Patrick&apos;s named buyers + suppliers ready</li>
          </ol>
          <p className="mt-4 text-xs text-ink-muted leading-relaxed">
            ถ้า bottleneck นี้ stuck → timeline ทั้งหมด push back proportionally
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resource                                                           */
/* ------------------------------------------------------------------ */

const TONI_PLATE = [
  "Spec quality (ทุก doc ใน 03-Specs/)",
  "Stage 0 build (เสร็จแล้ว)",
  "Tech architecture proposals + cost estimates",
  "Risk flagging (proactive)",
  "Stage 1 build ถ้าพี่ต้องการให้ continue",
];

const PATRICK_PLATE = [
  "Co-founder/co-signer hire — Toni ไม่รับ role นี้",
  "Lawyer engagement — Credit Score / Escrow / PDPA / entity",
  "Brand decision — TGPT standalone OR Patrick Group product",
  "Real supplier + buyer commitment — first 5 buyers + 20 suppliers",
  "Stage 1 budget approval — envelope ~1-4M THB",
  "Toni&apos;s role going forward — assistant / contractor / advisor / employee",
];

function ResourceSlide() {
  return (
    <div className="grid grid-cols-2 gap-10 h-full">
      <div className="bg-emerald-deep/5 border border-emerald-deep/20 p-7">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 bg-emerald-deep rounded-full" />
          <span className="eyebrow text-emerald-deep">Toni&apos;s plate</span>
          <span className="text-xs text-ink-muted">— ทำได้คนเดียว</span>
        </div>
        <ul className="space-y-3">
          {TONI_PLATE.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-emerald-deep mt-0.5">✓</span>
              <span className="text-base text-ink leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-warm/10 border border-amber-warm/40 p-7">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-2 h-2 bg-amber-warm rounded-full" />
          <span className="eyebrow text-amber-deep">Patrick&apos;s plate</span>
          <span className="text-xs text-ink-muted">— Toni ทำต่อไม่ได้จนกว่าจะ commit</span>
        </div>
        <ol className="space-y-3 list-none">
          {PATRICK_PLATE.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="font-mono text-xs text-amber-deep mt-1.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-base text-ink leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ol>

        <div className="mt-6 pt-5 border-t border-amber-warm/40">
          <div className="eyebrow mb-2 text-amber-deep">คำถามที่ 4</div>
          <p className="text-sm text-ink">
            ใน 6 ข้อข้างบน — ข้อไหนพี่ตัดสินใจได้ <strong>วันนี้</strong> และข้อไหนต้อง <strong>2-4 สัปดาห์</strong>?
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Risks                                                              */
/* ------------------------------------------------------------------ */

const RISKS = [
  ["1", "Patrick = SPOF (Single Point of Failure)", "Patrick", "Hire co-founder + encode network into platform"],
  ["2", "Credit Score regulation (พ.ร.บ. ข้อมูลเครดิต)", "Patrick + Lawyer", "Lawyer opinion ก่อน Stage 1 launch"],
  ["3", "Verification scalability", "Toni + Patrick", "Stage 1 = proof-test 10-20 deals before scale"],
  ["4", "Brand confusion (TGPT vs Patrick Group)", "Patrick", "Brand decision ก่อน Stage 1 marketing"],
  ["5", "Unit economics (8% margin reality)", "Joint", "Stage 1 = unit econ validation, not just feature ship"],
];

function RisksSlide() {
  return (
    <div>
      <div className="grid grid-cols-[60px_3fr_1fr_3fr] gap-x-4 py-3 border-b-2 border-ink/40 text-[0.65rem] uppercase tracking-[0.22em] font-mono text-ink-muted">
        <span>#</span>
        <span>Risk</span>
        <span>Owner</span>
        <span>Mitigation</span>
      </div>
      {RISKS.map((r) => (
        <div key={r[0]} className="grid grid-cols-[60px_3fr_1fr_3fr] gap-x-4 py-5 border-b border-parchment-300 items-baseline">
          <span className="font-display text-3xl figure-num text-terracotta" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{r[0]}</span>
          <span className="text-base text-ink leading-snug">{r[1]}</span>
          <span className="text-xs font-mono text-ink-muted">{r[2]}</span>
          <span className="text-sm text-ink-soft leading-snug">{r[3]}</span>
        </div>
      ))}

      <p className="mt-8 text-xs text-ink-muted font-mono">
        รายละเอียด → <code>00-Project-Management/RAID-LOG.md</code>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Opportunities                                                      */
/* ------------------------------------------------------------------ */

const OPPS = [
  ["1", "Data layer = strategic moat", "Query data = sellable intelligence product", "Stage 1 design"],
  ["2", "Cascading demand chain", "Layer 2-4 = sub-economy ที่ platform trigger", "Stage 2 product"],
  ["3", "Verification-as-a-Service", "Recurring revenue stream แยกจาก commission", "Stage 2 monetization"],
  ["4", "B2G market", "รัฐ (BOI, กรมจัดหางาน, NESDC) = customer ไม่ใช่แค่ partner", "Stage 2-3 strategy"],
];

function OpportunitiesSlide() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-8">
        <p className="text-base text-ink-soft mb-6 italic">4 จุดที่ panel เห็นตรงกัน — ที่พี่อาจยังไม่ได้คิดถึง:</p>
        <ol className="space-y-3">
          {OPPS.map((o) => (
            <li key={o[0]} className="border border-parchment-300 bg-parchment-50 p-5 grid grid-cols-[40px_1fr_1fr_120px] gap-4 items-baseline">
              <span className="font-display text-3xl figure-num text-emerald-deep" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>{o[0]}</span>
              <span className="font-display text-lg text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>{o[1]}</span>
              <span className="text-sm text-ink-soft">{o[2]}</span>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] font-mono text-amber-deep text-right">{o[3]}</span>
            </li>
          ))}
        </ol>
      </div>

      <aside className="col-span-4 bg-amber-warm/10 border-l-2 border-amber-warm p-6 self-start">
        <div className="eyebrow mb-3 text-amber-deep">คำถามที่ 5</div>
        <p className="font-display text-lg text-ink leading-snug mb-4" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 80, 'WONK' 1" }}>
          Long-term position ของ TGPT คือ?
        </p>
        <ol className="space-y-3 text-sm text-ink-soft">
          <li><strong className="text-ink">a)</strong> Pure marketplace → exit by acquisition</li>
          <li><strong className="text-ink">b)</strong> Multi-layer intelligence platform → license + B2G</li>
          <li><strong className="text-ink">c)</strong> National infrastructure → potential government partnership</li>
        </ol>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Asks                                                               */
/* ------------------------------------------------------------------ */

const ASKS = [
  ["1", "Confirm vision ตรงกัน", "วันนี้", "Stage 0 ไม่จบ"],
  ["2", "GO / NO-GO / PIVOT decision", "1 สัปดาห์", "Stage 1 push back"],
  ["3", "Brand decision (standalone vs Patrick Group)", "2 สัปดาห์", "ออกแบบ Stage 1 ไม่ได้"],
  ["4", "Co-founder/co-signer recruiting start", "2 สัปดาห์", "Stage 1 launch ช้า 2-3 เดือน"],
  ["5", "Lawyer engage", "4 สัปดาห์", "Stage 2 blockers ไม่ resolved"],
  ["6", "Stage 1 budget approval", "2 สัปดาห์", "Stage 1 ไม่เริ่ม"],
  ["7", "Toni&apos;s role going forward", "2 สัปดาห์", "ผม plan resource ไม่ได้"],
  ["8", "First 5 buyers + 20 suppliers list", "4 สัปดาห์", "Stage 1 validation ไม่มีตัวจริง"],
  ["9", "Patrick&apos;s weekly time commitment", "1 สัปดาห์", "Role conflict risk"],
];

function AsksSlide() {
  return (
    <div>
      <p className="text-base text-ink-soft mb-6">
        <strong className="text-ink">ก่อน Stage 1 start (1-4 สัปดาห์ข้างหน้า):</strong>
      </p>
      <div className="grid grid-cols-[40px_3fr_1fr_2fr] gap-x-3 py-3 border-b-2 border-ink/40 text-[0.6rem] uppercase tracking-[0.22em] font-mono text-ink-muted">
        <span>#</span>
        <span>สิ่งที่ขอ</span>
        <span>Deadline</span>
        <span>ผลถ้าช้า</span>
      </div>
      {ASKS.map((a) => (
        <div key={a[0]} className="grid grid-cols-[40px_3fr_1fr_2fr] gap-x-3 py-3 border-b border-parchment-300 items-baseline text-sm">
          <span className="font-mono text-emerald-deep">{a[0]}</span>
          <span className="text-ink leading-snug" dangerouslySetInnerHTML={{ __html: a[1] }} />
          <span className="font-mono text-amber-deep">{a[2]}</span>
          <span className="text-ink-muted leading-snug">{a[3]}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Questions                                                          */
/* ------------------------------------------------------------------ */

const QUESTIONS = [
  ["Vision check", "สิ่งที่ผมเข้าใจ — ตรงกับที่พี่คิดไหม? ส่วนไหนต้อง adjust?"],
  ["Wow moment", "ใน demo ส่วนไหนที่พี่ wow ที่สุด? ส่วนไหนที่พี่จะเอาไปอธิบายต่อกับ partner?"],
  ["Use case lock", "Thai premium agri export = right starting use case? หรือมี alternative ที่พี่อยากลองก่อน (real estate / hospitality / labor)?"],
  ["Strategic direction", "TGPT คือ pure marketplace, multi-layer intelligence, หรือ national infrastructure?"],
  ["Next 30 days", "อะไรที่พี่จะ commit ทำในช่วง 30 วันข้างหน้า?"],
];

function QuestionsSlide() {
  return (
    <div>
      <p className="text-lg text-ink-soft mb-8">
        5 คำถามที่ผมอยากให้พี่ตอบ <strong className="text-ink">วันนี้</strong> (หรือ commit timeline ที่จะตอบ):
      </p>

      <ol className="space-y-5">
        {QUESTIONS.map(([label, q], i) => (
          <li key={label} className="border-l-2 border-emerald-deep pl-6 py-2">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="font-display text-2xl figure-num text-emerald-deep" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="eyebrow">{label}</span>
            </div>
            <p className="font-display text-xl text-ink leading-snug" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 70, 'WONK' 1" }}>
              {q}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Closing                                                            */
/* ------------------------------------------------------------------ */

function ClosingSlide() {
  return (
    <div className="h-full flex flex-col justify-center items-start">
      <div className="eyebrow mb-6 text-amber-soft">End of deck</div>
      <h1 className="font-display text-display-2xl text-balance leading-[0.92] mb-12" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
        ขอบคุณ<em className="not-italic text-amber-soft">ครับ</em>
      </h1>

      <p className="text-2xl text-parchment/85 max-w-3xl leading-relaxed mb-10">
        Next step: ผมรอ feedback แล้วเขียน <strong className="text-amber-soft">Stage 1 brief</strong> ให้พี่ approve ภายใน 1 สัปดาห์
      </p>

      <div className="mt-8 pt-6 border-t border-amber-soft/30 max-w-3xl text-sm text-parchment/75 font-mono">
        <p>
          Reference: <code className="text-amber-soft">12-Stakeholder-Comms/Patrick/STAGE-0-REVIEW-DECK.md</code>
        </p>
        <p className="mt-2">Deck v1.0 · 4 พ.ค. 2569 · Toni → Patrick · Mock data only</p>
      </div>
    </div>
  );
}
