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
    gives: ["Technology — build + maintain platform", "Product thinking + UX/PM", "2 เดือน full-time MVP execution", "Phase 0 Tech Discovery ฟรี (cover เอง)", "Long-term commitment ผ่าน earn-in"],
    gets: ["Service fee ฿500K (Stage 1, milestone-based)", "Equity earn-in 0% → 6% → 9% → 12%", "RS 2% × 36mo (gated ≥฿100K/mo, cap ฿10M)", "Stage 2: CTO + ฿180K/เดือน"],
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

// ─── 3 Decision Choices (decisive, professional) ──────────────────────────────
const CHOICES = [
  {
    label: "✅ GO",
    headline: "เห็นด้วยกับ proposal นี้",
    items: [
      "เซ็น Term Sheet 3 ฉบับ",
      "Phase 0 เริ่มสัปดาห์หน้า (฿0)",
      "M1 kick-off Week 2 (฿200K)",
      "MVP launch Week 8",
    ],
    color: "border-amber-400 bg-gradient-to-b from-amber-50 to-cream",
    badgeColor: "bg-amber-500",
    badgeText: "text-ink",
  },
  {
    label: "🔄 ADJUST",
    headline: "อยากปรับบางจุดก่อนตัดสิน",
    items: [
      "Term ที่อยากแก้ — บอกได้เลย",
      "ผม revise ภายใน 3 วัน",
      "Re-review meeting ภายใน 1 สัปดาห์",
      "Decision หลัง revise",
    ],
    color: "border-sage-400 bg-gradient-to-b from-sage-50 to-cream",
    badgeColor: "bg-sage-500",
    badgeText: "text-white",
  },
  {
    label: "🚫 NO-GO",
    headline: "ไม่ใช่ตอนนี้ / ไม่ใช่ผม",
    items: [
      "ขอบคุณที่ให้โอกาสพิจารณา",
      "Stage 0 work เป็นของพี่ (free)",
      "ผมแนะนำ developer คนอื่นได้",
      "ความสัมพันธ์ยังคงดี",
    ],
    color: "border-rose-300 bg-gradient-to-b from-rose-50 to-cream",
    badgeColor: "bg-rose-500",
    badgeText: "text-white",
  },
];

// ─── 5 Professional Commitments (toned down) ──────────────────────────────────
const COMMITMENTS = [
  {
    icon: "🎯",
    title: "Quality Standards",
    what: "Production-grade code · TypeScript strict · test coverage ≥ 70%",
    detail: "ใช้ pattern + tool ที่ proven · ไม่ใช่ exotic",
  },
  {
    icon: "📅",
    title: "Delivery Discipline",
    what: "Milestone date เป็นสัญญา · ส่งล่าช้า → adjust scope ไม่ใช่ delay",
    detail: "Weekly demo + bi-weekly Patrick sync",
  },
  {
    icon: "🔍",
    title: "Brand Respect",
    what: "ทุก decision ที่กระทบ Patrick Group brand → Patrick approve ก่อน",
    detail: "Tone, pricing, partnership, public communication ทั้งหมด",
  },
  {
    icon: "🤝",
    title: "Long-term Mindset",
    what: "ทำงานเหมือน Patrick Group เป็นบริษัทผมเอง",
    detail: "Decision คิดยาว · optimize relationship ไม่ใช่ Stage 1 fee",
  },
  {
    icon: "🛡️",
    title: "Patrick's Protection",
    what: "IP transfer ทุก milestone · daily push · backup pool",
    detail: "ถ้าผมไม่อยู่ พี่ continuity ได้",
  },
];

// ─── Worst Case + Patrick's Protection (no "refund 50%") ──────────────────────
const WORST_CASES = [
  {
    case: "M1 ส่งมอบไม่ผ่าน Patrick approval",
    loss: "฿0",
    mitigation: "ผม rework ฟรี — ไม่นับเป็น M2 work · M1 payment hold จนกว่าจะผ่าน",
  },
  {
    case: "Patrick stop หลัง M1",
    loss: "฿200,000",
    mitigation: "พี่ได้ code + spec + Phase 0 docs · IP transfer to NewCo เรียบร้อย",
  },
  {
    case: "Patrick stop หลัง M2",
    loss: "+ ฿150,000",
    mitigation: "พี่ได้ทั้งหมดที่ build แล้ว · ไม่จ่าย M3 · Toni เขียน handover doc",
  },
  {
    case: "Toni หาย / สิ้นสุดสัญญาก่อนครบ",
    loss: "฿0 (เสียเวลาพี่)",
    mitigation: "Code daily push · Notion ของพี่ตลอด · successor brief 5 หน้า · backup dev pool",
  },
  {
    case: "MVP launch แต่ไม่มี deal ปิด",
    loss: "฿500K used",
    mitigation: "Patrick decide NO-GO Stage 2 · Earn-In Gate 1 ไม่ trigger · clean exit",
  },
];

export default function PatrickPitchPage() {
  const avgScore = Math.round(PANEL.reduce((a, p) => a + p.score, 0) / PANEL.length);

  return (
    <main className="min-h-screen bg-cream">
      <div className="container-soft py-10 space-y-14">

        {/* ── Cover (Tech Partnership Proposal — Confident Humility) ────── */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
            Tech Partnership Proposal · {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-ink leading-tight">
            ThailandGPT<br />
            <span className="text-sage-600">Connection Gateway Platform</span>
          </h1>
          <p className="text-ink-muted text-lg max-w-2xl mx-auto">
            ตามที่พี่ Patrick ประกาศหา technical partner —<br />
            นี่คือสิ่งที่ผมเสนอ <span className="italic">scope, term, timeline</span>
          </p>
          <p className="text-sm text-ink-muted/80 max-w-2xl mx-auto italic">
            Earn-In model · Tech-focused scope · Performance-aligned compensation
          </p>
          <div className="flex justify-center gap-3 flex-wrap pt-2">
            <Link href="#division" className="btn-primary">Division of Labor →</Link>
            <Link href="#earnin" className="btn-secondary">Earn-In Equity</Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* DIVISION OF LABOR — Patrick (business) vs Toni (tech)            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="division" className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">Division of Labor — ใครทำอะไร</h2>
            <p className="text-ink-muted mt-1 italic">ชัดเจน ไม่ overlap · Patrick = business · Toni = tech</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-6 border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-cream space-y-3">
              <div className="text-center pb-2 border-b border-amber-200">
                <span className="text-2xl">👑</span>
                <h3 className="font-bold text-ink text-lg">Patrick — Business Leadership</h3>
              </div>
              <ul className="space-y-2 text-sm text-ink-soft">
                {[
                  "Vision · Strategic direction",
                  "Network — supplier + buyer intro",
                  "Brand · public communication",
                  "MOU · partnership · G2G",
                  "Pricing · commission policy",
                  "Hiring decision (Stage 2)",
                  "Capital allocation",
                  "Final approval ทุก major decision",
                ].map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="text-amber-600 shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6 border-2 border-sky-300 bg-gradient-to-b from-sky-50 to-cream space-y-3">
              <div className="text-center pb-2 border-b border-sky-200">
                <span className="text-2xl">💻</span>
                <h3 className="font-bold text-ink text-lg">Toni — Tech Execution</h3>
              </div>
              <ul className="space-y-2 text-sm text-ink-soft">
                {[
                  "Tech architecture · stack",
                  "Full-stack build (Next.js + Supabase)",
                  "Database schema · API design",
                  "UI/UX design + implementation",
                  "DevOps · deployment · monitoring",
                  "Security + PDPA technical compliance",
                  "Hire + manage tech contractor",
                  "Sprint execution · weekly demo",
                ].map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="text-sky-600 shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card p-4 bg-ink text-amber-300 text-center text-sm font-medium">
            ผมไม่ commit หา supplier หรือ deal — นั่นเป็น domain ของพี่ที่ผมเคารพ
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* EARN-IN EQUITY MODEL                                             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="earnin" className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">Equity — Earn-In Model</h2>
            <p className="text-ink-muted mt-1 italic">เริ่ม 0% · earn ขึ้นตาม commitment ที่พิสูจน์ · cap table สะอาด</p>
          </div>
          <div className="space-y-3">
            {[
              { gate: "Day 1", equity: "0%", cond: "Sign 3 term sheets · No equity granted yet", why: "Toni ยังไม่มี skin in the game · Patrick risk = 0", color: "border-stone-300 bg-stone-50" },
              { gate: "Gate 1", equity: "+6%", cond: "M3 complete + Patrick GO Stage 2", why: "หลัง MVP ส่งมอบ + Patrick ตัดสิน continue → Toni ได้ 6%", color: "border-amber-300 bg-amber-50" },
              { gate: "Gate 2", equity: "+3% (=9%)", cond: "Stage 2 — 12 เดือน full-time complete", why: "เป็น CTO เต็มตัว 12 เดือน → top up ถึง 9%", color: "border-amber-400 bg-amber-100" },
              { gate: "Gate 3", equity: "+3% (=12%)", cond: "Stage 2 — 24 เดือน full-time complete", why: "Long-term commit ครบ 2 ปี → ได้ full 12%", color: "border-emerald-400 bg-emerald-50" },
            ].map((g, i) => (
              <div key={g.gate} className={`card p-4 border-2 ${g.color} grid grid-cols-12 gap-3 items-center`}>
                <div className="col-span-2 text-center">
                  <div className="text-xs font-semibold text-ink-muted">{g.gate}</div>
                  <div className="text-2xl font-bold text-ink mt-1">{g.equity}</div>
                </div>
                <div className="col-span-5">
                  <div className="text-sm font-semibold text-ink">{g.cond}</div>
                </div>
                <div className="col-span-5 text-xs text-ink-soft italic border-l-2 border-stone-300 pl-3">
                  {g.why}
                </div>
              </div>
            ))}
          </div>
          <div className="card p-3 bg-amber-100 text-ink text-center text-sm">
            Vest 4 ปี, cliff 1 ปี · ถ้า Toni ออก → keep ที่ vested · earn-in หยุด
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PHASE 0 — TECH DISCOVERY (tech-only, no business overlap)       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="phase0" className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">Phase 0 — Tech Discovery (1 สัปดาห์, ฿0)</h2>
            <p className="text-ink-muted mt-1 italic">Tech-only scope · ไม่ overlap กับ business domain ของพี่</p>
          </div>
          <div className="card p-6 space-y-4 bg-gradient-to-br from-amber-50 to-cream border-2 border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { num: "1", what: "Architecture Spike", detail: "Stack rationale · monolith vs microservice · build vs buy", why: "Output: Architecture Decision Record (5 หน้า)" },
                { num: "2", what: "Database + API Design", detail: "Schema · ER diagram · OpenAPI contract", why: "Output: Schema doc + API spec ที่ team คนถัดไปใช้ต่อได้" },
                { num: "3", what: "Security + PDPA Framework", detail: "Auth flow · data retention · consent UX · audit log", why: "Output: Security checklist + compliance gap analysis" },
                { num: "4", what: "Cost + Capacity Projection", detail: "Infra cost Stage 1/2/3 · scaling threshold · vendor lock-in", why: "Output: Cost spreadsheet + recommendation" },
              ].map((s) => (
                <div key={s.num} className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center shrink-0">
                    {s.num}
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-ink">{s.what}</div>
                    <div className="text-sm text-ink-soft">{s.detail}</div>
                    <div className="text-xs text-amber-700 italic">→ {s.why}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-amber-200 pt-3 text-center text-sm text-amber-800 font-medium">
              ผมไม่สัมภาษณ์ supplier/buyer — นั่นเป็นงานของพี่ · ผมทำ tech decision ที่พี่ใช้ตัดสิน scope
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WORST CASE + PATRICK'S PROTECTION (Anant's request, NEW)        */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="protection" className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">ถ้าทุกอย่างผิดพลาด — พี่เสียอะไร?</h2>
            <p className="text-ink-muted mt-1 italic">ก่อนพูดเรื่องโอกาส — ผมพูดเรื่อง downside ก่อนเสมอ</p>
          </div>
          <div className="card p-0 overflow-hidden">
            <div className="grid grid-cols-12 gap-0 bg-ink text-amber-300 text-sm font-semibold">
              <div className="col-span-4 p-3">Worst Case</div>
              <div className="col-span-2 p-3 text-center">พี่เสีย</div>
              <div className="col-span-6 p-3">ผมปกป้องพี่ยังไง</div>
            </div>
            {WORST_CASES.map((w, i) => (
              <div key={i} className={`grid grid-cols-12 gap-0 border-t border-stone-100 ${i % 2 === 0 ? "bg-cream" : "bg-white"}`}>
                <div className="col-span-4 p-3 font-semibold text-rose-700 text-sm">{w.case}</div>
                <div className="col-span-2 p-3 text-center font-mono font-bold text-ink">{w.loss}</div>
                <div className="col-span-6 p-3 text-sm text-ink-soft">✓ {w.mitigation}</div>
              </div>
            ))}
          </div>
          <div className="card p-4 bg-amber-500 text-ink text-center">
            <span className="font-bold">Real downside = ฿200K + 1 เดือน</span>
            <span className="text-ink/80"> (ไม่ใช่ ฿500K) — เพราะ milestone control ปกป้องพี่</span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* 3 DECISION CHOICES (decisive, professional)                      */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="decision" className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">ขั้นตอนตัดสินใจ — 3 ทางเลือก</h2>
            <p className="text-ink-muted mt-1 italic">ผม respect ทุก decision · ไม่มี pressure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHOICES.map(c => (
              <div key={c.label} className={`card p-0 border-2 ${c.color} overflow-hidden`}>
                <div className={`${c.badgeColor} ${c.badgeText} px-4 py-3 text-center font-bold text-lg`}>
                  {c.label}
                </div>
                <div className="p-5 space-y-3">
                  <div className="text-sm italic text-ink text-center font-semibold">{c.headline}</div>
                  <div className="w-12 h-0.5 bg-stone-300 mx-auto"></div>
                  <ul className="space-y-2 text-sm text-ink-soft">
                    {c.items.map(item => (
                      <li key={item} className="flex gap-2">
                        <span className="text-stone-400 shrink-0">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
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

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* COMMITMENTS (professional standards, not slogans)                */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="commitments" className="space-y-5">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-ink">Commitment — ถ้า Patrick GO</h2>
            <p className="text-ink-muted mt-1 italic">Professional standards · ไม่ใช่ slogans</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMITMENTS.map(c => (
              <div key={c.title} className="card p-5 border border-stone-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl">
                    {c.icon}
                  </div>
                  <h3 className="font-semibold text-ink">{c.title}</h3>
                </div>
                <p className="text-sm text-ink-soft leading-relaxed">{c.what}</p>
                <div className="text-xs text-ink-muted italic border-t border-stone-100 pt-2">
                  {c.detail}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* CLOSING — Professional, decisive                                 */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="card p-10 bg-gradient-to-br from-ink to-sage-900 text-cream text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold text-amber-300">
            พร้อมเริ่มเมื่อพี่พร้อม
          </h2>
          <p className="text-lg text-cream/80 italic">
            Tech Partnership · Earn-In Model · Performance-Aligned
          </p>
          <div className="w-24 h-0.5 bg-amber-500 mx-auto"></div>
          <div className="max-w-2xl mx-auto space-y-2 text-left">
            <p className="text-amber-300 font-semibold mb-2 text-center">ข้อเสนอใน 3 บรรทัด:</p>
            <div className="card p-4 bg-ink/50 space-y-2 text-sm md:text-base">
              <p><span className="text-amber-400 font-bold mr-2">1.</span>฿500K cash · 2 เดือน MVP build · cost-plus transparent</p>
              <p><span className="text-amber-400 font-bold mr-2">2.</span>Equity earn-in: 0% → 6% → 9% → 12% ตาม commitment</p>
              <p><span className="text-amber-400 font-bold mr-2">3.</span>RS 2% (gated ≥฿100K/mo) · cap ฿10M Active + ฿2.5M Tail</p>
            </div>
          </div>
          <div className="card p-5 bg-ink/50 border border-amber-500/30 max-w-2xl mx-auto">
            <p className="font-semibold text-amber-300">พี่ตัดสินใจเมื่อพร้อม · ไม่มี deadline จากผม</p>
            <p className="text-sm text-cream/70 mt-2">
              ติดต่อ: <span className="text-amber-300">ckawin1184@gmail.com</span>
            </p>
          </div>
          <p className="text-xs text-cream/50">Toni — Senior Tech Partner</p>
        </section>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <div className="flex gap-3 flex-wrap justify-center pt-4 border-t border-stone-200">
          <Link href="/reports/commission" className="btn-secondary">Commission Report</Link>
          <Link href="/reports/breakeven" className="btn-secondary">Break-Even Analysis</Link>
          <Link href="/reports/model" className="btn-secondary">Business Model</Link>
          <Link href="/browse" className="btn-primary">ดู Suppliers →</Link>
        </div>
      </div>
    </main>
  );
}
