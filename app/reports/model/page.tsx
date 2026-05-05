import Link from "next/link";

// ─── Exchange rate ────────────────────────────────────────────────────────────
const USD_THB = 35;

// ─── Full cost breakdown per stage ───────────────────────────────────────────
const STAGE_COSTS = [
  {
    stage: "Stage 0",
    label: "POC / Demo",
    period: "ก่อนตัดสินใจ",
    status: "done",
    statusLabel: "เสร็จแล้ว",
    total_thb: 0,
    note: "Toni ทำ demo ฟรี — Patrick ไม่จ่ายอะไร",
    items: [] as { name: string; thb: string; type: string; note: string }[],
  },
  {
    stage: "Stage 1",
    label: "MVP Build (2 เดือน)",
    period: "จ่ายครั้งเดียว ตอน kick-off",
    status: "next",
    statusLabel: "รอ GO",
    total_thb: 1_300_000,
    note: "Patrick จ่ายทั้งหมด — Toni ไม่จ่าย",
    items: [
      { name: "Toni — Service Fee (3 milestone)", thb: "฿600,000", type: "people", note: "Fixed contract ไม่ใช่เงินเดือน — จ่าย 3 งวด" },
      { name: "Tech Contractor (optional)", thb: "฿240,000", type: "people", note: "ถ้าต้องการ dev เพิ่ม — ไม่บังคับ Stage 1" },
      { name: "PDPA Compliance Setup", thb: "฿100,000–150,000", type: "legal", note: "นโยบาย + DPA + consent flow" },
      { name: "KYB / Supplier Verification Setup", thb: "฿50,000–150,000", type: "legal", note: "ระบบ verify ซัพพลายเออร์ครั้งแรก" },
      { name: "Legal — TOS + MOU + Term Sheets", thb: "฿80,000", type: "legal", note: "ทนายไทย review + draft" },
      { name: "Infra — Vercel Pro + Supabase Pro", thb: "฿50,000", type: "infra", note: "Setup + 2 เดือนแรก" },
      { name: "Buffer / Contingency", thb: "฿60,000", type: "buffer", note: "รองรับ scope creep เล็กน้อย" },
    ],
  },
  {
    stage: "Stage 1+",
    label: "Monthly Ops (หลัง Launch)",
    period: "ต่อเนื่องทุกเดือน",
    status: "ongoing",
    statusLabel: "หลัง M2",
    total_thb: 14_000,
    note: "ต้นทุนคงที่ต่ำมาก — ไม่มี staff cost ใน Stage 1",
    items: [
      { name: "Infra — Vercel + Supabase (monthly)", thb: "฿3,500", type: "infra", note: "$100 — scales กับ traffic" },
      { name: "Legal / Compliance maintenance", thb: "฿7,000", type: "legal", note: "$200 — retainer เล็กๆ ทนาย" },
      { name: "Email, SMS, Misc tools", thb: "฿3,500", type: "infra", note: "$100 — Postmark, Twilio ฯลฯ" },
      { name: "Toni RS (variable)", thb: "3% × commission", type: "people", note: "ไม่ใช่ fixed cost — จ่ายเมื่อมีรายได้เท่านั้น" },
      { name: "Staff / ทีม", thb: "฿0", type: "people", note: "ไม่มี — Stage 1 Toni คนเดียว" },
      { name: "Lawyer (ongoing)", thb: "฿0", type: "legal", note: "retainer อยู่ในค่า Legal maintenance แล้ว" },
    ],
  },
  {
    stage: "Stage 2",
    label: "Full Employment + Scale",
    period: "หลัง MVP GO — Patrick ตัดสินใจ",
    status: "future",
    statusLabel: "ต่อเมื่อ GO S1",
    total_thb: 450_000,
    note: "ต้นทุนเพิ่มมาก — ต้องมี revenue cover ก่อน",
    items: [
      { name: "Toni — Salary (Co-Founder & CTO)", thb: "฿180,000/mo", type: "people", note: "เงินเดือนจริง — แทนที่ service fee" },
      { name: "Tech Staff (1-2 คน)", thb: "฿60,000–120,000/mo", type: "people", note: "Full-stack dev หรือ QA" },
      { name: "Sales / BD (Patrick's network)", thb: "฿40,000–80,000/mo", type: "people", note: "คน manage deal flow" },
      { name: "Infra Scale", thb: "฿20,000–50,000/mo", type: "infra", note: "CDN, DB scale, monitoring" },
      { name: "Legal / Accounting", thb: "฿15,000–30,000/mo", type: "legal", note: "retainer + นักบัญชี" },
      { name: "Marketing / Content", thb: "฿20,000–50,000/mo", type: "marketing", note: "LinkedIn, B2B outreach" },
    ],
  },
];

const TYPE_COLOR: Record<string, string> = {
  people: "bg-amber-100 text-amber-800",
  legal: "bg-violet-100 text-violet-800",
  infra: "bg-sky-100 text-sky-800",
  buffer: "bg-stone-100 text-stone-700",
  marketing: "bg-rose-100 text-rose-800",
};
const TYPE_LABEL: Record<string, string> = {
  people: "People",
  legal: "Legal",
  infra: "Infra",
  buffer: "Buffer",
  marketing: "Marketing",
};

// ─── Business model streams ───────────────────────────────────────────────────
const SUPPLIER_STREAMS = [
  {
    name: "Commission ต่อดีล",
    name_en: "Deal Commission",
    phase: "ทุกดีลที่ปิด",
    amount: "3.0% – 5.0%",
    basis: "% ของ GMV deal",
    recommended: true,
    when: "paid after deal closed",
    pros: ["ซัพพลายเออร์จ่ายเฉพาะเมื่อได้เงินจริง", "Align กับ platform — ยิ่งดีลสำเร็จ ยิ่งได้", "ง่ายต่อ pitch"],
    cons: ["ขึ้นอยู่กับ deal volume", "ต้องมี escrow ป้องกัน bypass"],
    current: true,
  },
  {
    name: "ค่า Onboarding / Verification",
    name_en: "Onboarding Fee",
    phase: "ครั้งแรกที่สมัคร",
    amount: "฿3,000 – ฿8,000",
    basis: "One-time flat fee",
    recommended: true,
    when: "ก่อนได้รับ verified badge",
    pros: ["Cover ต้นทุน KYB จริง", "คัดกรอง supplier ไม่จริงจัง", "สร้าง revenue ตั้งแต่ก่อนมีดีล"],
    cons: ["อาจลด conversion ตอน signup", "ถ้า Patrick's Circle — อาจ waive ได้"],
    current: false,
  },
  {
    name: "Annual Renewal",
    name_en: "Annual Verification Renewal",
    phase: "ทุกปี",
    amount: "฿1,500 – ฿3,000",
    basis: "ต่อปี ต่อซัพพลายเออร์",
    recommended: true,
    when: "anniversary of join date",
    pros: ["สร้าง predictable MRR", "บังคับ update เอกสาร compliance ทุกปี", "กรองซัพพลายเออร์ inactive"],
    cons: ["ต้องมี billing system", "อาจ annoy supplier ถ้า deal น้อย"],
    current: false,
  },
  {
    name: "Premium Listing / Featured",
    name_en: "Premium Placement",
    phase: "เลือกซื้อ",
    amount: "฿2,500 – ฿5,000/เดือน",
    basis: "Monthly subscription",
    recommended: false,
    when: "ซัพพลายเออร์อยาก featured หน้าแรก",
    pros: ["Upsell ง่าย", "สร้าง differentiation"],
    cons: ["ต้องมี traffic จริงก่อน ถึงจะ worth it", "Stage 1 ยังเร็วเกิน"],
    current: false,
  },
];

const BUYER_STREAMS = [
  {
    name: "Browse & Search",
    name_en: "Free Tier",
    phase: "ตลอดเวลา",
    amount: "ฟรี",
    basis: "ไม่มีค่าใช้จ่าย",
    recommended: true,
    when: "ทันทีที่สมัคร",
    pros: ["ลด friction — buyer เข้ามาง่าย", "สร้าง demand side ก่อน", "ไม่มีคู่แข่งในไทยทำได้"],
    cons: ["ไม่ได้ revenue จาก buyer tier นี้"],
    current: true,
  },
  {
    name: "Verified Buyer Badge",
    name_en: "Buyer Verification",
    phase: "ต้องการ access premium",
    amount: "$200 – $400/ปี",
    basis: "Annual subscription",
    recommended: true,
    when: "ก่อนเปิด deal กับ Patrick's Circle",
    pros: ["KYB ฝั่ง buyer — ลด fraud", "Buyer ที่จ่ายแปลว่า serious", "Access Patrick's Circle ซัพพลายเออร์ได้"],
    cons: ["อาจ slow adoption ช่วงแรก", "ต้องมี value clear ก่อน charge"],
    current: false,
  },
  {
    name: "Concierge Sourcing",
    name_en: "Managed Sourcing",
    phase: "เลือกซื้อ",
    amount: "$500 – $1,500/deal",
    basis: "Per deal flat fee",
    recommended: true,
    when: "Buyer ต้องการให้ Toni/ทีมหา supplier ให้",
    pros: ["High margin", "Differentiated vs platform-only", "Patrick's network leverage ได้สูงสุด"],
    cons: ["ต้องใช้เวลา Toni/ทีม", "Scale ยาก ถ้าไม่มีคน"],
    current: false,
  },
  {
    name: "Early Access Membership",
    name_en: "Priority Access",
    phase: "Premium tier",
    amount: "$800 – $1,200/ปี",
    basis: "Annual membership",
    recommended: false,
    when: "Buyer อยากเห็น new supplier ก่อนใคร",
    pros: ["FOMO-driven", "สร้าง VIP community"],
    cons: ["ต้องมี new supplier flow สม่ำเสมอ", "Stage 2+ เท่านั้น"],
    current: false,
  },
];

// ─── Recommended model summary ────────────────────────────────────────────────
const RECOMMENDED = {
  stage1: [
    { side: "Supplier", stream: "Commission 3–5%/deal", status: "✅ Launch Day 1" },
    { side: "Supplier", stream: "Onboarding fee ฿5,000", status: "✅ Launch Day 1" },
    { side: "Buyer",    stream: "Browse & Search ฟรี", status: "✅ Launch Day 1" },
    { side: "Buyer",    stream: "Verified Buyer $300/ปี", status: "⏳ Month 3-4" },
  ],
  stage2: [
    { side: "Supplier", stream: "Annual Renewal ฿2,000/ปี", status: "Stage 2" },
    { side: "Buyer",    stream: "Concierge Sourcing $1,000/deal", status: "Stage 2" },
    { side: "Both",     stream: "Escrow fee 0.5% (shared)", status: "Stage 2" },
    { side: "Supplier", stream: "Premium Listing ฿3,500/mo", status: "Stage 2+" },
  ],
};

function thbNum(n: number) {
  return "฿" + n.toLocaleString("th-TH");
}

export default function BusinessModelPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="container-soft py-10 space-y-12">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm text-ink-muted">
            <Link href="/" className="hover:text-ink">หน้าแรก</Link>
            <span>/</span>
            <span className="text-ink">Business Model</span>
          </div>
          <h1 className="text-2xl font-semibold text-ink">Business Model — ต้นทุน + รายได้</h1>
          <p className="text-ink-muted text-sm mt-1">
            ต้นทุนจริงครบทุก Stage · โมเดลรายได้จากมุมมอง Supplier · มุมมอง Buyer
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 1 — COST TRANSPARENCY                                  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div>
            <h2 className="font-semibold text-ink text-lg">💸 ต้นทุนจริงทุก Item — แต่ละ Stage</h2>
            <p className="text-sm text-ink-muted mt-1">
              ค่า ops {thbNum(14_000)}/เดือน ที่ใช้คำนวณ break-even = <strong>Stage 1 ongoing เท่านั้น</strong> (ไม่มี staff, ไม่มีเงินเดือน Toni)
              Stage 2 มีต้นทุนสูงกว่ามาก — ดูด้านล่าง
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {STAGE_COSTS.map(stage => {
              const statusColor =
                stage.status === "done"    ? "bg-stone-100 text-stone-600" :
                stage.status === "next"    ? "bg-amber-100 text-amber-700" :
                stage.status === "ongoing" ? "bg-emerald-100 text-emerald-700" :
                "bg-sky-100 text-sky-700";
              const borderColor =
                stage.status === "done"    ? "border-stone-300" :
                stage.status === "next"    ? "border-amber-400" :
                stage.status === "ongoing" ? "border-emerald-400" :
                "border-sky-400";

              return (
                <div key={stage.stage} className={`card p-6 border-t-4 ${borderColor} space-y-4`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-ink text-base">{stage.stage} — {stage.label}</div>
                      <div className="text-xs text-ink-muted">{stage.period}</div>
                    </div>
                    <span className={`pill text-xs shrink-0 ${statusColor}`}>{stage.statusLabel}</span>
                  </div>

                  {stage.total_thb > 0 && (
                    <div className="text-2xl font-bold text-ink">
                      {stage.status === "ongoing"
                        ? `${thbNum(stage.total_thb)}/เดือน`
                        : stage.status === "future"
                        ? `~${thbNum(stage.total_thb)}/เดือน`
                        : thbNum(stage.total_thb)}
                    </div>
                  )}
                  {stage.total_thb === 0 && (
                    <div className="text-2xl font-bold text-ink">฿0</div>
                  )}

                  <p className="text-xs text-ink-muted italic">{stage.note}</p>

                  {stage.items.length > 0 && (
                    <div className="space-y-2">
                      {stage.items.map(item => (
                        <div key={item.name} className="flex items-start gap-2">
                          <span className={`pill text-[10px] shrink-0 mt-0.5 ${TYPE_COLOR[item.type] ?? "bg-stone-100 text-stone-700"}`}>
                            {TYPE_LABEL[item.type] ?? item.type}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-ink">{item.name}</div>
                            <div className="text-xs text-ink-muted">{item.note}</div>
                          </div>
                          <div className="text-sm font-mono font-semibold text-ink shrink-0">{item.thb}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {stage.stage === "Stage 0" && (
                    <div className="bg-stone-50 rounded-xl p-3 text-sm text-ink-muted text-center">
                      ไม่มี item — Toni ทำ POC เป็น goodwill
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cost comparison bar */}
          <div className="card p-5 space-y-3">
            <div className="text-sm font-semibold text-ink">เปรียบเทียบต้นทุน/เดือน</div>
            <div className="space-y-2">
              {[
                { label: "Stage 1 Ongoing (fixed only)", thb: 14_000, max: 500_000, color: "bg-emerald-400" },
                { label: "Stage 2 (min scenario)", thb: 315_000, max: 500_000, color: "bg-amber-400" },
                { label: "Stage 2 (max scenario)", thb: 480_000, max: 500_000, color: "bg-rose-400" },
              ].map(row => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-muted">{row.label}</span>
                    <span className="font-mono font-semibold text-ink">{thbNum(row.thb)}/mo</span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${row.color} rounded-full`}
                      style={{ width: `${(row.thb / row.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-muted">
              ⚠️ Break-even ที่คำนวณก่อนหน้าใช้ {thbNum(14_000)}/เดือน (Stage 1 only) — ถ้า Stage 2 เริ่ม ต้องทบทวนตัวเลขใหม่ทั้งหมด
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 2 — SUPPLIER PERSPECTIVE                               */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sage-100 flex items-center justify-center text-xl">🏭</div>
            <div>
              <h2 className="font-semibold text-ink text-lg">มุมมอง Supplier — จ่ายอะไร ได้อะไร</h2>
              <p className="text-sm text-ink-muted">ซัพพลายเออร์ไทย SME ถึง Elite — เห็นอะไร จ่ายอะไร</p>
            </div>
          </div>

          {/* What supplier gets */}
          <div className="card p-5 bg-sage-50/40 space-y-3">
            <div className="text-sm font-semibold text-ink">✅ สิ่งที่ Supplier ได้จาก Platform</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {[
                { icon: "🌍", v: "เชื่อมกับ Buyer ทั่วโลก 20+ ประเทศ" },
                { icon: "⭐", v: "Patrick's personal network — verified deal flow" },
                { icon: "🔒", v: "Trust badge — verified, tier, performance score" },
                { icon: "💼", v: "Deal Room ที่ secure + timeline tracking" },
                { icon: "📋", v: "ระบบ Demand matching — Buyer มาหาคุณเอง" },
                { icon: "📊", v: "Performance report — track ยอดขาย + commission" },
              ].map(i => (
                <div key={i.v} className="flex items-start gap-2">
                  <span className="text-base">{i.icon}</span>
                  <span className="text-ink-soft">{i.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue streams for supplier */}
          <div className="space-y-3">
            {SUPPLIER_STREAMS.map(s => (
              <div
                key={s.name}
                className={`card p-5 ${s.recommended ? "" : "opacity-75"} space-y-3`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-ink">{s.name}</span>
                      {s.current && <span className="pill text-xs bg-emerald-100 text-emerald-700">ใช้งานอยู่</span>}
                      {s.recommended && !s.current && <span className="pill text-xs bg-amber-100 text-amber-700">แนะนำ</span>}
                      {!s.recommended && <span className="pill text-xs bg-stone-100 text-stone-600">Stage 2+</span>}
                    </div>
                    <div className="text-xs text-ink-muted mt-0.5">{s.phase}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-ink">{s.amount}</div>
                    <div className="text-xs text-ink-muted">{s.basis}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-emerald-700 font-medium mb-1">ข้อดี</div>
                    <ul className="space-y-1">
                      {s.pros.map(p => <li key={p} className="text-xs text-ink-soft flex gap-1"><span className="text-emerald-500 shrink-0">+</span>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-rose-600 font-medium mb-1">ข้อควรระวัง</div>
                    <ul className="space-y-1">
                      {s.cons.map(c => <li key={c} className="text-xs text-ink-soft flex gap-1"><span className="text-rose-400 shrink-0">−</span>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Supplier cost simulation */}
          <div className="card p-5 space-y-3">
            <div className="text-sm font-semibold text-ink">💡 ตัวอย่าง: ซัพพลายเออร์ปิดดีล $35,000 จ่ายอะไร?</div>
            <div className="space-y-2 text-sm">
              {[
                { item: "Onboarding fee (จ่ายครั้งเดียว)", thb: "฿5,000", note: "one-time" },
                { item: "Commission 4.0% × $35,000", thb: "฿49,000", note: "$1,400 = ฿49,000" },
                { item: "รับเงินสุทธิ", thb: "฿1,176,000", note: "$35,000 − $1,400 = $33,600 = ฿1,176,000" },
              ].map(r => (
                <div key={r.item} className="flex justify-between items-start border-b border-stone-100 pb-2">
                  <div>
                    <div className="text-ink">{r.item}</div>
                    <div className="text-xs text-ink-muted">{r.note}</div>
                  </div>
                  <span className="font-mono font-semibold text-ink">{r.thb}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-muted">ซัพพลายเออร์จ่ายรวม ≈ 4.01% ของ deal (รวม onboarding amortized) — ถูกกว่า agent ทั่วไปที่เก็บ 8-15%</p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 3 — BUYER PERSPECTIVE                                  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-xl">🌍</div>
            <div>
              <h2 className="font-semibold text-ink text-lg">มุมมอง Buyer — เห็นอะไร จ่ายอะไร</h2>
              <p className="text-sm text-ink-muted">นักซื้อต่างประเทศ — Europe, US, Japan, Middle East</p>
            </div>
          </div>

          {/* What buyer gets */}
          <div className="card p-5 bg-sky-50/40 space-y-3">
            <div className="text-sm font-semibold text-ink">✅ สิ่งที่ Buyer ได้จาก Platform</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {[
                { icon: "🔍", v: "Search Thai suppliers ที่ verified แล้ว — ไม่ต้อง cold call" },
                { icon: "✅", v: "Supplier verification โดย Patrick — ไม่เสี่ยง scam" },
                { icon: "📋", v: "Post demand → รอ AI match — ไม่ต้อง sourcing เอง" },
                { icon: "💼", v: "Deal Room — negotiate + track + milestone" },
                { icon: "🏆", v: "Patrick's Circle = elite suppliers ที่หาไม่ได้ที่อื่น" },
                { icon: "🔒", v: "Compliance ready — GAP, Organic, FSC, HACCP cert ครบ" },
              ].map(i => (
                <div key={i.v} className="flex items-start gap-2">
                  <span className="text-base">{i.icon}</span>
                  <span className="text-ink-soft">{i.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue streams for buyer */}
          <div className="space-y-3">
            {BUYER_STREAMS.map(s => (
              <div
                key={s.name}
                className={`card p-5 ${s.recommended ? "" : "opacity-75"} space-y-3`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-ink">{s.name}</span>
                      {s.current && <span className="pill text-xs bg-emerald-100 text-emerald-700">ใช้งานอยู่</span>}
                      {s.recommended && !s.current && <span className="pill text-xs bg-amber-100 text-amber-700">แนะนำ</span>}
                      {!s.recommended && <span className="pill text-xs bg-stone-100 text-stone-600">Stage 2+</span>}
                    </div>
                    <div className="text-xs text-ink-muted mt-0.5">{s.phase}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-ink">{s.amount}</div>
                    <div className="text-xs text-ink-muted">{s.basis}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-emerald-700 font-medium mb-1">ข้อดี</div>
                    <ul className="space-y-1">
                      {s.pros.map(p => <li key={p} className="text-xs text-ink-soft flex gap-1"><span className="text-emerald-500 shrink-0">+</span>{p}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs text-rose-600 font-medium mb-1">ข้อควรระวัง</div>
                    <ul className="space-y-1">
                      {s.cons.map(c => <li key={c} className="text-xs text-ink-soft flex gap-1"><span className="text-rose-400 shrink-0">−</span>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Buyer journey cost */}
          <div className="card p-5 space-y-3">
            <div className="text-sm font-semibold text-ink">💡 ตัวอย่าง: Buyer ซื้อ $35,000 order จ่ายอะไร?</div>
            <div className="space-y-2 text-sm">
              {[
                { item: "Browse + Search + Post Demand", thb: "ฟรี", note: "ไม่มี fee" },
                { item: "Verified Buyer Badge (ถ้าต้องการ access Patrick's Circle)", thb: "$300/ปี", note: "optional — ปีแรก" },
                { item: "Commission ฝั่ง Buyer", thb: "$0", note: "Platform ไม่เก็บ buyer commission" },
                { item: "จ่ายให้ Supplier", thb: "$35,000", note: "full GMV ตรงไปซัพพลายเออร์" },
                { item: "รวมค่าใช้จ่าย Buyer ต่อ deal", thb: "$300/ปี", note: "เฉลี่ย $25/deal ถ้าซื้อ 12 ครั้ง/ปี" },
              ].map(r => (
                <div key={r.item} className="flex justify-between items-start border-b border-stone-100 pb-2">
                  <div>
                    <div className="text-ink">{r.item}</div>
                    <div className="text-xs text-ink-muted">{r.note}</div>
                  </div>
                  <span className="font-mono font-semibold text-ink">{r.thb}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-ink-muted">Buyer ได้ verified supplier + deal room ในราคาที่ถูกกว่าจ้าง sourcing agent ทั่วไป ($2,000-5,000/deal)</p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/* SECTION 4 — RECOMMENDED MODEL                                  */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <section className="card p-6 space-y-5">
          <h2 className="font-semibold text-ink text-lg">⭐ โมเดลที่แนะนำ — Launch Sequence</h2>
          <p className="text-sm text-ink-muted">
            ไม่ควรเปิดทุก revenue stream พร้อมกัน — launch แบบ phased เพื่อลด friction และ prove value ก่อน
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stage 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="pill text-xs bg-emerald-100 text-emerald-700">Stage 1 — Launch ทันที</span>
              </div>
              {RECOMMENDED.stage1.map(r => (
                <div key={r.stream} className="flex items-center justify-between text-sm border-b border-stone-100 pb-2">
                  <div>
                    <span className={`pill text-xs mr-2 ${r.side === "Supplier" ? "bg-sage-100 text-sage-700" : "bg-sky-100 text-sky-700"}`}>
                      {r.side}
                    </span>
                    {r.stream}
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">{r.status}</span>
                </div>
              ))}
            </div>

            {/* Stage 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="pill text-xs bg-sky-100 text-sky-700">Stage 2 — เพิ่มเมื่อ proven</span>
              </div>
              {RECOMMENDED.stage2.map(r => (
                <div key={r.stream} className="flex items-center justify-between text-sm border-b border-stone-100 pb-2">
                  <div>
                    <span className={`pill text-xs mr-2 ${r.side === "Supplier" ? "bg-sage-100 text-sage-700" : r.side === "Buyer" ? "bg-sky-100 text-sky-700" : "bg-violet-100 text-violet-700"}`}>
                      {r.side}
                    </span>
                    {r.stream}
                  </div>
                  <span className="text-xs text-ink-muted">{r.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue mix projection */}
          <div className="bg-ink text-cream rounded-2xl p-5 space-y-4">
            <div className="text-sm font-semibold">Revenue Mix — Year 1 (Target Scenario)</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { stream: "Commission", share: "82%", thb: "฿5.2M/ปี", note: "Main engine" },
                { stream: "Onboarding Fee", share: "12%", thb: "฿750K/ปี", note: "150 suppliers × ฿5K" },
                { stream: "Buyer Badge", share: "4%", thb: "฿250K/ปี", note: "25 buyers × $300" },
                { stream: "Concierge", share: "2%", thb: "฿125K/ปี", note: "5 deals × $1,000" },
              ].map(r => (
                <div key={r.stream} className="space-y-1">
                  <div className="text-2xl font-bold text-cream">{r.share}</div>
                  <div className="text-xs text-cream/70">{r.stream}</div>
                  <div className="text-xs text-sage-300 font-semibold">{r.thb}</div>
                  <div className="text-[10px] text-cream/50">{r.note}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-cream/20 pt-3 flex justify-between text-sm">
              <span className="text-cream/70">Total Revenue Estimate Year 1</span>
              <span className="font-semibold text-sage-300">฿6.3M/ปี ≈ $180K</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 space-y-1">
            <div className="font-semibold">⚠️ สิ่งที่ต้องระวัง</div>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Commission bypass risk:</strong> Supplier + Buyer อาจตกลงกันนอก platform — ต้องมี Non-Circumvention ใน MOU</li>
              <li>• <strong>Onboarding fee sensitivity:</strong> Thai SME บางรายไม่มีเงิน upfront — พิจารณา waive สำหรับ Patrick's Circle</li>
              <li>• <strong>Buyer badge timing:</strong> อย่าเปิด charge เร็วเกินไป — ให้ prove value 3-4 เดือนก่อน</li>
              <li>• <strong>Escrow:</strong> ต้องมี payment gateway (Stripe/Omise) + legal structure ก่อน — Stage 2 ขึ้นไป</li>
            </ul>
          </div>
        </section>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/reports/breakeven" className="btn-secondary">← Break-Even</Link>
          <Link href="/reports/commission" className="btn-secondary">Commission Report</Link>
          <Link href="/browse" className="btn-primary">ดู Suppliers →</Link>
        </div>
      </div>
    </main>
  );
}
