import Link from "next/link";
import InvestmentSimulator from "@/components/v2/InvestmentSimulator";

// ─── Panel personas ───────────────────────────────────────────────────────────
const PANEL = [
  {
    name: "Dr. Wanchai Limthongkul",
    title: "CFO — Thailand Tech Venture (20 ปีประสบการณ์ B2B marketplace)",
    avatar: "📊",
    color: "border-sky-400",
    accent: "bg-sky-50",
    badge: "bg-sky-100 text-sky-700",
    verdict: "GO — แต่ต้องมี guardrails",
    verdictColor: "bg-amber-100 text-amber-700",
    score: 78,
    lens: "ดูจาก unit economics และ cash flow safety",
    analysis: `Unit economics แข็งแกร่งมาก: ต้นทุน fixed ต่ำ (฿14,000/เดือน post-launch), commission margin สูง (gross ~100% ของ commission), payback ~8 เดือน ถ้า deal flow ตาม target — เป็นโมเดลที่ดีกว่า marketplace ส่วนใหญ่ที่ผมเคยเห็น

สิ่งที่ต้องระวัง: Stage 2 cost jump จาก ฿14K → ฿450K/เดือน เป็น cliff ที่อันตราย ถ้า revenue ไม่โตพร้อม ต้องกำหนด revenue threshold ชัดเจนก่อน trigger Stage 2`,
    concerns: [
      "Commission bypass risk — ต้องมี escrow + Non-Circumvention ในทุก MOU ก่อน launch",
      "Stage 2 cost jump ต้องมี revenue gate (เช่น commission ≥ ฿200K/mo ก่อน hire)",
      "Onboarding fee ฿5K — อาจเป็น friction สำหรับ SME ไทย ควร waive Patrick's Circle",
      "Currency risk: commission เป็น USD แต่ ops cost เป็น THB — ต้องมี hedging policy",
    ],
    recommendation: "อนุมัติ Stage 1 — แต่ต้องมีเงื่อนไข Stage 2 trigger ที่ชัดเจนในสัญญา",
  },
  {
    name: "คุณพฤสณัย มหัคฆพงศ์ (Patrick)",
    title: "Connection Capital Owner — ผู้ลงทุนและเจ้าของ Network",
    avatar: "👑",
    color: "border-emerald-500",
    accent: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700",
    verdict: "Compelling — ต้องการ proof of concept",
    verdictColor: "bg-emerald-100 text-emerald-700",
    score: 85,
    lens: "ดูจาก Network leverage และ ROI ต่อ connection ที่ลงทุนไป",
    analysis: `Platform นี้ monetize สิ่งที่ผมมีอยู่แล้ว — network 20+ ปีที่ไม่เคย scale ได้ นี่คือ key insight สำหรับผม ถ้า Toni build ได้จริงตามที่ propose, ผมแทบไม่ต้องทำอะไรเพิ่ม แค่ introduce suppliers เข้าระบบ

ROI 96× ใน 3 ปี ถ้า conservative scenario เป็นจริง — ดีกว่าลงทุนใน property หรือ stock มาก ความเสี่ยงหลักคือ Toni deliver ได้จริงไหม และ supplier ในวงผมจะ trust platform ไหม`,
    concerns: [
      "ต้องเห็น MVP ทำงานจริงกับ real supplier ก่อนลงทุน ฿1.3M",
      "Supplier ใน network ผมบางคน conservative มาก — ต้องการ face-to-face มากกว่า digital",
      "ถ้า Toni ออกไปกลางทาง ใครดูแล platform? ต้องมี contingency",
      "Commission rate 3% สำหรับ Patrick's Circle — ผม ok แต่ต้องอธิบาย rationale ให้ supplier เข้าใจ",
    ],
    recommendation: "GO Stage 1 ถ้า Toni sign term sheets วันนี้ — ผมพร้อม introduce 5 suppliers แรกจาก network ทันที",
  },
  {
    name: "Ms. Sarah van den Berg",
    title: "Master Buyer, Amsterdam Floral Trading — ซื้อ ฿35M+ / ปีจากเอเชีย",
    avatar: "🌍",
    color: "border-amber-400",
    accent: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700",
    verdict: "ใช้แน่ — ถ้า reliability ได้",
    verdictColor: "bg-emerald-100 text-emerald-700",
    score: 82,
    lens: "ดูจาก Buyer experience: เสียเวลากี่ชั่วโมงต่อ deal ตอนนี้ vs บน platform",
    analysis: `ตอนนี้การหา Thai supplier ที่ verified ต้องบิน Bangkok 2-3 ครั้ง ใช้เวลา 3-6 เดือน ถ้า platform นี้ทำได้จริง — เราพร้อมจ่าย $300/ปี สำหรับ Verified Buyer badge ทันที นั่นคือ ROI ภายใน flight เดียวที่ไม่ต้องไป

สิ่งที่เราต้องการ: 1) Deal Room ที่ track shipment ได้จริง 2) Certification ต้องอัปเดตทุกปีไม่ใช่แค่ครั้งแรก 3) Patrick's personal verification คือ USP ที่แตกต่างจาก Alibaba ชัดมาก`,
    concerns: [
      "Supply consistency — ถ้า supplier cancel กลางทาง platform รับผิดชอบยังไง?",
      "Payment protection — escrow จำเป็นมากสำหรับ cross-border deal",
      "Certification expiry tracking — ต้องแจ้งเตือนก่อน cert หมดอายุ",
      "ภาษา — Supplier บางรายสื่อสารได้แค่ภาษาไทย ต้องมี mediation",
    ],
    recommendation: "พร้อม sign Verified Buyer Badge ทันทีที่ platform launch — และ introduce 3 buyers จาก EU network",
  },
  {
    name: "คุณวิชัย สวนทุเรียน (ผู้แทน Supplier)",
    title: "Elite Supplier, Patrick's Circle — ส่งออก ฿20M+ / ปี",
    avatar: "🏭",
    color: "border-sage-500",
    accent: "bg-sage-50",
    badge: "bg-sage-100 text-sage-700",
    verdict: "เข้าร่วม — commission fair",
    verdictColor: "bg-emerald-100 text-emerald-700",
    score: 88,
    lens: "ดูจาก Net ที่ได้หลัง commission vs ทำเองผ่าน agent",
    analysis: `ผมส่งออกผ่าน agent อยู่แล้ว เสียค่า commission 8-12% บางรายเก็บ 15% ถ้า platform เก็บแค่ 3% (Patrick's Circle) และมี buyer verified พร้อมซื้อ — นี่ดีกว่ามาก

ค่า onboarding ฿5,000 ไม่เป็นไร ถ้า platform ช่วยหา buyer ให้จริง ตอนนี้ผมเสียเวลา 2-3 เดือนต่อ 1 buyer ใหม่ ถ้าลดเหลือ 2-3 สัปดาห์ มันคุ้มมากกว่า ฿5,000 มาก`,
    concerns: [
      "ถ้าปิดดีลนอก platform จะโดน penalty ไหม? ต้องชัดเจนใน MOU",
      "Commission คิดจาก FOB หรือ CIF? ต้องระบุชัดก่อน sign",
      "ถ้า buyer ไม่จ่าย platform ช่วยอะไรได้บ้าง? ต้องมี escrow protection",
      "Annual renewal ฿2,000 — ok แต่ต้องแสดง value ที่ได้จริงทุกปี",
    ],
    recommendation: "พร้อม join และ bring 2 suppliers จาก network มาร่วมด้วย",
  },
  {
    name: "Kunal Mehta",
    title: "Venture Partner, Asia B2B Marketplace Fund — ลงทุน 15+ marketplace ในเอเชีย",
    avatar: "🚀",
    color: "border-violet-400",
    accent: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    verdict: "Fundable — แต่ network moat คือทุกอย่าง",
    verdictColor: "bg-amber-100 text-amber-700",
    score: 72,
    lens: "ดูจาก defensibility, TAM, และ exit potential",
    analysis: `ฉันเห็น marketplace แบบนี้ 20+ แบบในเอเชีย ส่วนใหญ่ล้มเพราะ supply side ไม่ qualified หรือ trust ไม่ได้ Patrick's personal verification network คือ differentiator ที่แท้จริงที่ซื้อเงินไม่ได้ — นี่คือ moat

ถ้า Patrick commit จริง และ Toni deliver MVP ในเวลา ฉันจะ consider Series A หลัง Stage 1 proof ที่ ฿50M valuation. TAM ของ Thai premium export ≈ $2B+ และยังไม่มีใคร dominate digital channel นี้`,
    concerns: [
      "Network effect ยังไม่ถึง critical mass — ต้องการ 50+ suppliers ก่อน viral loop เริ่ม",
      "Dependency บน Patrick เดี่ยว — ถ้า Patrick ถอย business พัง ต้องสร้าง second-tier verification",
      "Commission rate อาจถูกกว่าไปสำหรับ VC round — ควร benchmark vs Faire, Ankorstore",
      "Exit path: acquisition โดย Alibaba/Amazon/Coupang/Lazada สมเหตุสมผล ถ้าทำ GMV $20M+",
    ],
    recommendation: "Pass ตอนนี้ — แต่ put on watchlist. กลับมา pitch หลัง Stage 1 มีตัวเลขจริง",
  },
];

// ─── Panel consensus ──────────────────────────────────────────────────────────
const CONSENSUS = [
  "Commission 3-5% เป็น fair market rate — ต่ำกว่า agent ทั่วไปแต่ cover costs ได้",
  "Patrick's personal verification คือ moat จริง — ซื้อ/copy ไม่ได้",
  "Stage 1 ฿1.3M เป็น reasonable entry point สำหรับ risk ที่รับได้",
  "Escrow + Non-Circumvention ต้องอยู่ใน legal framework ก่อน launch วัน 1",
  "Free buyer side ถูกต้อง — demand flywheel ต้องสร้างก่อน",
];

const DISAGREEMENTS = [
  { topic: "Onboarding fee timing", split: "CFO + VC: เปิดทันที / Patrick: waive Circle ก่อน / Supplier: ok ถ้า value clear" },
  { topic: "Stage 2 trigger", split: "CFO: กำหนด revenue gate ก่อน / VC: รอ Series A / Patrick: ตาม execution" },
  { topic: "Commission rate future", split: "VC: อาจต้องขึ้นถ้า fundraise / CFO: คง rate ดีกว่าเพื่อ supplier loyalty" },
];

// ─── Patrick investment simulation ───────────────────────────────────────────
const INVEST_SIM = {
  invest_thb: 1_300_000,
  invest_usd: 37_143,
  equity_pct: 88,
  alternatives: [
    { name: "ฝากธนาคาร (1.5%/ปี)", return_3yr_thb: 1_300_000 * 1.045, roi_x: 1.045, risk: "ต่ำ", color: "bg-stone-100" },
    { name: "กองทุน SET Index (avg 8%/ปี)", return_3yr_thb: 1_300_000 * 1.259, roi_x: 1.259, risk: "กลาง", color: "bg-amber-50" },
    { name: "Property (Condo เช่า)", return_3yr_thb: 1_300_000 * 1.18, roi_x: 1.18, risk: "กลาง", color: "bg-amber-50" },
    { name: "ThailandGPT — Conservative", return_3yr_thb: 1_300_000 * 48, roi_x: 48, risk: "สูง", color: "bg-sage-50" },
    { name: "ThailandGPT — Target ⭐", return_3yr_thb: 1_300_000 * 96, roi_x: 96, risk: "สูง-กลาง", color: "bg-emerald-50" },
  ],
  scenarios: [
    { label: "Worst Case (1 deal/mo)", payback_mo: "ไม่คืนทุน ใน 3 ปี", yr1_net: "฿68K", yr3_net: "฿205K", note: "ops cover เท่านั้น" },
    { label: "Lean (3 deals/mo)", payback_mo: "32 เดือน", yr1_net: "฿220K", yr3_net: "฿660K", note: "ช้าแต่ positive" },
    { label: "Target ⭐ (6 deals/mo)", payback_mo: "8 เดือน", yr1_net: "฿1.8M", yr3_net: "฿125M", note: "recommended" },
    { label: "Scale (12 deals/mo)", payback_mo: "4 เดือน", yr1_net: "฿3.6M", yr3_net: "฿250M+", note: "ถ้า network เปิดเต็ม" },
  ],
};

// ─── Win-Win wheel data ───────────────────────────────────────────────────────
const WHEEL = [
  {
    id: "patrick",
    label: "Patrick",
    sublabel: "Connection Capital Owner",
    icon: "👑",
    color: "bg-emerald-500",
    textColor: "text-emerald-700",
    bgLight: "bg-emerald-50",
    border: "border-emerald-300",
    gives: ["Network 20+ ปี ทั่วโลก", "เงินลงทุน ฿1.3M (Stage 1)", "Personal verification + credibility", "MOU + intro กับ suppliers"],
    gets: ["Commission income ฝั่ง Platform 97%", "Equity 88% (ก่อน earn-in)", "ROI 96× ใน 3 ปี (target)", "Platform monetize network ที่มีอยู่"],
  },
  {
    id: "toni",
    label: "Toni",
    sublabel: "Technical Partner & Builder",
    icon: "🧑‍💻",
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgLight: "bg-amber-50",
    border: "border-amber-300",
    gives: ["Technology — build + maintain platform", "Product thinking + UX/PM", "2 เดือน full-time execution", "Long-term commitment (4yr vest)"],
    gets: ["Service fee ฿600K (Stage 1)", "Equity 12% (4yr/1yr cliff)", "Revenue Share 3% × 36 เดือน", "Stage 2: CTO + ฿180K/เดือน"],
  },
  {
    id: "supplier",
    label: "Suppliers",
    sublabel: "Thai SME → Elite Exporters",
    icon: "🏭",
    color: "bg-sage-500",
    textColor: "text-sage-700",
    bgLight: "bg-sage-50",
    border: "border-sage-300",
    gives: ["สินค้าคุณภาพ + certification", "ข้อมูลและ transparency", "Onboarding fee ฿5K (one-time)", "Commission 3-5% ต่อดีล"],
    gets: ["Global buyers ที่ verified แล้ว", "Trust badge + performance tier", "Deal Room + milestone tracking", "Commission ถูกกว่า agent 8-15%"],
  },
  {
    id: "buyer",
    label: "Buyers",
    sublabel: "International — EU / US / Asia",
    icon: "🌍",
    color: "bg-sky-500",
    textColor: "text-sky-700",
    bgLight: "bg-sky-50",
    border: "border-sky-300",
    gives: ["Demand + capital", "Verified Buyer badge $300/ปี (optional)", "Credibility + track record", "Long-term purchasing commitment"],
    gets: ["Verified Thai suppliers ไม่ต้องบิน Bangkok", "Patrick-backed trust — ไม่เสี่ยง scam", "Deal Room ครบ ไม่ต้อง sourcing agent", "ประหยัด $2,000-5,000 ต่อ deal"],
  },
];

// ─── The Ask ──────────────────────────────────────────────────────────────────
const THE_ASK = [
  { item: "เงินลงทุน Stage 1", detail: "฿1,300,000 (2 เดือน)", icon: "💰", critical: true },
  { item: "Network intro — 10 Suppliers แรก", detail: "จาก Patrick's Circle โดยตรง", icon: "🤝", critical: true },
  { item: "Sign term sheets 3 ฉบับ พร้อมกัน", detail: "Service + Earn-In + Stage 2", icon: "✍️", critical: true },
  { item: "MOU กับ Suppliers ในวงของ Patrick", detail: "ใช้ credibility Patrick เปิดประตูให้", icon: "📋", critical: true },
  { item: "Time — ประชุมสัปดาห์ละ 1 ชั่วโมง", detail: "Strategic direction + supplier intro", icon: "🕐", critical: false },
  { item: "Patience — 2 เดือน build time", detail: "Toni build เต็มที่ ไม่ interrupt", icon: "⏳", critical: false },
];

export default function PatrickPitchPage() {
  const avgScore = Math.round(PANEL.reduce((a, p) => a + p.score, 0) / PANEL.length);

  return (
    <main className="min-h-screen bg-cream">
      <div className="container-soft py-10 space-y-14">

        {/* ── Cover ─────────────────────────────────────────────────────── */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-100 text-sage-700 rounded-full text-sm font-medium">
            พร้อม Present Patrick · {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 className="text-4xl font-semibold text-ink leading-tight">
            ThailandGPT<br />
            <span className="text-sage-600">Connection Gateway Platform</span>
          </h1>
          <p className="text-ink-muted text-lg max-w-xl mx-auto">
            สิ่งที่ Toni ต้องการจาก Patrick · สิ่งที่ Patrick จะได้รับ ·<br />
            Win-Win ทุกมิติ ในทุก Stakeholder
          </p>
          <div className="flex justify-center gap-3 flex-wrap pt-2">
            <Link href="#ask" className="btn-primary">สิ่งที่ต้องการจาก Patrick →</Link>
            <Link href="#wheel" className="btn-secondary">Win-Win Wheel</Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* THE ASK                                                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="ask" className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">สิ่งที่ Toni ต้องการจาก Patrick</h2>
            <p className="text-ink-muted mt-1">ตรงๆ ไม่อ้อม — นี่คือสิ่งที่จำเป็นให้ Project สำเร็จ</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {THE_ASK.map(a => (
              <div key={a.item} className={`card p-5 flex gap-4 ${a.critical ? "border border-sage-200" : "opacity-80"}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${a.critical ? "bg-sage-50" : "bg-stone-50"}`}>
                  {a.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-ink">{a.item}</span>
                    {a.critical && <span className="pill text-xs bg-rose-100 text-rose-700">จำเป็น</span>}
                  </div>
                  <p className="text-sm text-ink-muted mt-0.5">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card p-5 bg-ink text-cream text-center space-y-2">
            <div className="text-lg font-semibold">รวม: ฿1,300,000 + Network + Time</div>
            <div className="text-cream/70 text-sm">เงิน 2 เดือน · Network ตลอด · เวลา 1 ชั่วโมง/สัปดาห์ — นั่นคือทุกอย่างที่ต้องการจาก Patrick</div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WIN-WIN WHEEL                                                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="wheel" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">Win-Win Wheel — ทุกคนได้ประโยชน์</h2>
            <p className="text-ink-muted mt-1">Platform เป็นกลไกกลาง — ทุก Stakeholder ให้และได้รับ</p>
          </div>

          {/* Center + 4 quadrants */}
          <div className="relative">
            {/* 2×2 grid with center */}
            <div className="grid grid-cols-2 gap-3">
              {WHEEL.map((w, i) => (
                <div key={w.id} className={`card p-5 border-2 ${w.border} space-y-3 ${i >= 2 ? "mt-0" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${w.color} flex items-center justify-center text-xl text-white`}>
                      {w.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-ink">{w.label}</div>
                      <div className="text-xs text-ink-muted">{w.sublabel}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Gives */}
                    <div className={`rounded-xl p-3 ${w.bgLight}`}>
                      <div className={`text-xs font-semibold ${w.textColor} mb-2 uppercase tracking-wide`}>ให้ Platform</div>
                      <ul className="space-y-1">
                        {w.gives.map(g => (
                          <li key={g} className="text-xs text-ink-soft flex gap-1.5">
                            <span className="text-rose-400 shrink-0 mt-0.5">→</span>{g}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Gets */}
                    <div className="rounded-xl p-3 bg-white/60">
                      <div className="text-xs font-semibold text-sage-700 mb-2 uppercase tracking-wide">ได้รับกลับ</div>
                      <ul className="space-y-1">
                        {w.gets.map(g => (
                          <li key={g} className="text-xs text-ink-soft flex gap-1.5">
                            <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>{g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Center overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-28 h-28 rounded-full bg-ink flex flex-col items-center justify-center text-cream shadow-2xl border-4 border-cream">
                <div className="text-xl font-bold leading-tight">TGPT</div>
                <div className="text-[9px] text-cream/70 text-center leading-tight px-1">Connection<br />Gateway</div>
              </div>
            </div>
          </div>

          {/* Flow arrows summary */}
          <div className="card p-5 space-y-3">
            <div className="text-sm font-semibold text-ink">กลไกที่ Platform ทำ (ตรงกลาง Wheel)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
              {[
                { step: "1. Match", desc: "AI จับคู่ Demand ↔ Supply จาก Patrick's network", color: "bg-emerald-50 border-emerald-200" },
                { step: "2. Verify", desc: "Patrick personal verification + 4-dim trust signals", color: "bg-amber-50 border-amber-200" },
                { step: "3. Connect", desc: "Deal Room — negotiate + milestone + track", color: "bg-sky-50 border-sky-200" },
                { step: "4. Monetize", desc: "Commission เข้า Platform → แจก Patrick + Toni RS", color: "bg-sage-50 border-sage-200" },
              ].map(s => (
                <div key={s.step} className={`rounded-xl p-3 border ${s.color}`}>
                  <div className="font-semibold text-ink mb-1">{s.step}</div>
                  <div className="text-ink-muted leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* INTERACTIVE SIMULATOR                                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="simulator" className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">ลอง Simulate การลงทุนเอง</h2>
            <p className="text-ink-muted mt-1">
              ปรับ Supplier / Buyer / Deal / Commission ดูผล ROI Patrick + ต้นทุนแต่ละ Stage แบบ real-time
            </p>
          </div>
          <InvestmentSimulator />
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PATRICK INVESTMENT SIMULATION                                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">Patrick Investment — คุ้มหรือไม่?</h2>
            <p className="text-ink-muted mt-1">เปรียบเทียบกับทางเลือกการลงทุนอื่น ฿1.3M เดียวกัน</p>
          </div>

          {/* Alternatives comparison */}
          <div className="card p-6 space-y-4">
            <div className="text-sm font-semibold text-ink">ถ้าเอา ฿1.3M ไปลงทุนที่อื่น — ได้กลับมาเท่าไรใน 3 ปี?</div>
            <div className="space-y-3">
              {INVEST_SIM.alternatives.map(alt => {
                const maxROI = 96;
                const barWidth = Math.min((alt.roi_x / maxROI) * 100, 100);
                const isTGPT = alt.name.includes("ThailandGPT");
                return (
                  <div key={alt.name} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`text-ink ${isTGPT ? "font-semibold" : ""}`}>{alt.name}</span>
                        <span className={`pill text-[10px] ${alt.risk === "ต่ำ" ? "bg-stone-100 text-stone-600" : alt.risk === "กลาง" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-600"}`}>
                          ความเสี่ยง {alt.risk}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`font-mono font-semibold ${isTGPT ? "text-sage-600 text-base" : "text-ink"}`}>
                          ฿{alt.return_3yr_thb.toLocaleString("th-TH", { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-xs text-ink-muted ml-1">({alt.roi_x}×)</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isTGPT ? (alt.name.includes("Target") ? "bg-emerald-400" : "bg-sage-300") : "bg-stone-300"}`}
                        style={{ width: `${Math.max(barWidth, 1)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scenario table */}
          <div className="card p-6 space-y-4">
            <div className="text-sm font-semibold text-ink">Scenario Analysis — Patrick net return</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-2 px-3 text-ink-muted font-medium">Scenario</th>
                    <th className="text-center py-2 px-3 text-ink-muted font-medium">Payback</th>
                    <th className="text-right py-2 px-3 text-ink-muted font-medium">Year 1 Net</th>
                    <th className="text-right py-2 px-3 text-ink-muted font-medium">Year 3 Cumulative</th>
                    <th className="text-left py-2 px-3 text-ink-muted font-medium">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody>
                  {INVEST_SIM.scenarios.map((s, i) => {
                    const isTarget = i === 2;
                    return (
                      <tr key={s.label} className={`border-b border-stone-50 ${isTarget ? "bg-sage-50/60" : "hover:bg-stone-50/40"} transition-colors`}>
                        <td className="py-3 px-3">
                          <span className={`font-medium ${isTarget ? "text-sage-700" : "text-ink"}`}>{s.label}</span>
                        </td>
                        <td className={`py-3 px-3 text-center text-sm ${s.payback_mo.includes("ไม่") ? "text-rose-500" : isTarget ? "text-emerald-600 font-semibold" : "text-ink-soft"}`}>
                          {s.payback_mo}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-sage-600">{s.yr1_net}</td>
                        <td className="py-3 px-3 text-right font-mono font-semibold text-sage-700">{s.yr3_net}</td>
                        <td className="py-3 px-3 text-xs text-ink-muted">{s.note}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-ink-muted">
              * ตัวเลข net = commission Patrick รับ (97%) − ops − investment. ไม่รวม equity exit value ซึ่งอาจเพิ่ม upside อีก 10-20×
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PANEL REVIEW                                                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">Panel Review — 5 ผู้เชี่ยวชาญประเมิน</h2>
            <p className="text-ink-muted mt-1">CFO · Patrick · International Buyer · Thai Supplier · Marketplace VC</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="text-3xl font-bold text-ink">{avgScore}/100</div>
              <div className="text-sm text-ink-muted">คะแนนเฉลี่ยจาก Panel<br /><span className="text-sage-600 font-semibold">ผ่าน — ควร GO Stage 1</span></div>
            </div>
          </div>

          <div className="space-y-4">
            {PANEL.map(p => (
              <div key={p.name} className={`card p-6 border-l-4 ${p.color} space-y-4`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${p.accent} flex items-center justify-center text-2xl shrink-0`}>
                      {p.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-ink">{p.name}</div>
                      <div className="text-xs text-ink-muted">{p.title}</div>
                      <div className="text-xs text-ink-muted mt-0.5 italic">มุมมอง: {p.lens}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-ink">{p.score}</div>
                      <div className="text-xs text-ink-muted">คะแนน</div>
                    </div>
                    <span className={`pill text-xs ${p.verdictColor}`}>{p.verdict}</span>
                  </div>
                </div>

                <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">{p.analysis}</p>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-ink uppercase tracking-wide">ข้อกังวล</div>
                  <ul className="space-y-1.5">
                    {p.concerns.map(c => (
                      <li key={c} className="text-sm text-ink-soft flex gap-2">
                        <span className="text-amber-500 shrink-0">⚠</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`rounded-xl p-3 ${p.accent} text-sm`}>
                  <span className="font-semibold text-ink">Recommendation: </span>
                  <span className="text-ink-soft">{p.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* CONSENSUS + DISAGREEMENTS                                        */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card p-6 space-y-3">
            <h3 className="font-semibold text-ink">✅ Panel เห็นด้วยทุกคน</h3>
            <ul className="space-y-2">
              {CONSENSUS.map(c => (
                <li key={c} className="flex gap-2 text-sm text-ink-soft">
                  <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>{c}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 space-y-3">
            <h3 className="font-semibold text-ink">🟡 ประเด็นที่ Panel ไม่เห็นตรงกัน</h3>
            <div className="space-y-3">
              {DISAGREEMENTS.map(d => (
                <div key={d.topic} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                  <div className="text-sm font-semibold text-ink">{d.topic}</div>
                  <div className="text-xs text-ink-muted mt-1">{d.split}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PM SYNTHESIS                                                      */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="card p-8 bg-ink text-cream space-y-5">
          <h2 className="text-xl font-semibold">PM Synthesis — สรุปและคำแนะนำ</h2>

          <div className="space-y-4 text-cream/90 text-sm leading-relaxed">
            <p>
              จากการ review ของ panel ทั้ง 5 คน — <strong className="text-cream">คะแนนเฉลี่ย {avgScore}/100 ผ่านเกณฑ์ GO</strong>
              มี consensus ชัดเจนว่าโมเดลนี้ sound ทั้ง unit economics และ market fit
            </p>
            <p>
              <strong className="text-cream">จุดแข็งที่ทุกคนเห็นตรงกัน:</strong> Patrick's personal verification network คือ moat ที่ซื้อไม่ได้
              ไม่มี marketplace ไหนในไทยทำได้แบบนี้ ถ้า Patrick commit — platform มี unfair advantage ตั้งแต่วันแรก
            </p>
            <p>
              <strong className="text-cream">ความเสี่ยงหลักที่ต้องแก้ก่อน launch:</strong> Escrow + Non-Circumvention ต้องอยู่ใน legal framework
              ก่อนเปิดดีลแรก — นี่คือ single biggest risk ที่ทุกคนใน panel flag
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "คำแนะนำ", value: "GO Stage 1", color: "text-emerald-300" },
              { label: "เงื่อนไข", value: "Sign 3 term sheets + legal setup before launch", color: "text-amber-300" },
              { label: "Next Action", value: "Patrick GO/NO-GO ภายใน 30 วัน", color: "text-sky-300" },
            ].map(r => (
              <div key={r.label} className="border border-cream/20 rounded-xl p-4">
                <div className="text-xs text-cream/50 uppercase tracking-wide mb-1">{r.label}</div>
                <div className={`font-semibold ${r.color}`}>{r.value}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-cream/20 pt-4 text-xs text-cream/50">
            Panel Review generated by TGPT PM · ตัวเลขอ้างอิงจาก conservative scenario ·
            ผลจริงขึ้นกับ Patrick network engagement + Toni execution velocity
          </div>
        </section>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/reports/commission" className="btn-secondary">Commission Report</Link>
          <Link href="/reports/breakeven" className="btn-secondary">Break-Even Analysis</Link>
          <Link href="/reports/model" className="btn-secondary">Business Model</Link>
          <Link href="/browse" className="btn-primary">ดู Suppliers →</Link>
        </div>
      </div>
    </main>
  );
}
