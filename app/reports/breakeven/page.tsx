import Link from "next/link";

// ─── constants ──────────────────────────────────────────────────────────────
const USD_THB = 35;
const PATRICK_INVEST_THB = 1_300_000;
const PATRICK_INVEST_USD = PATRICK_INVEST_THB / USD_THB;

// Monthly platform fixed cost (infra + legal maintenance, post-Stage 1)
const MONTHLY_OPEX_USD = 400;

// Commission tier rates (weighted by typical supplier mix)
// Patrick's Circle 3% / Top Performer 3.5% / Reliable 4% / Building 4.5%
// Realistic mix early stage: mostly Reliable + Building → avg ~4%
const AVG_COMMISSION_RATE = 0.04;
const TONI_RS = 0.03; // 3% of commission → Patrick net = 97%

// ─── deal size buckets ──────────────────────────────────────────────────────
const DEAL_SIZES = [
  { label: "เล็ก (Small)",    avg_usd: 8_000,   example: "ชา / น้ำมันสมุนไพร / สินค้า sample" },
  { label: "กลาง (Medium)",   avg_usd: 25_000,  example: "ข้าว / กาแฟ / ผ้า / เซรามิก" },
  { label: "ใหญ่ (Large)",    avg_usd: 80_000,  example: "กล้วยไม้ recurring / ไหม / อาหารทะเล" },
  { label: "Mix (ประมาณการ)", avg_usd: 35_000,  example: "เฉลี่ยจริงในระบบ (deal-001 ถึง deal-019)" },
];

// ─── scenario definitions ────────────────────────────────────────────────────
interface Scenario {
  id: string;
  name: string;
  name_th: string;
  color: string;
  accent: string;
  deals_per_month: number;
  avg_deal_usd: number;
  suppliers: number;
  buyers: number;
  open_demands: number;
  // derived per deal: how often does each supplier close a deal?
  supplier_deal_freq_mo: number; // deals per supplier per month
}

const SCENARIOS: Scenario[] = [
  {
    id: "survival",
    name: "Survival",
    name_th: "ยืนได้ (Ops cover only)",
    color: "border-stone-400",
    accent: "bg-stone-50",
    deals_per_month: 1,
    avg_deal_usd: 25_000,
    suppliers: 5,
    buyers: 3,
    open_demands: 2,
    supplier_deal_freq_mo: 0.2, // 1 deal per 5 months per supplier
  },
  {
    id: "lean",
    name: "Lean",
    name_th: "Lean (คืนทุนช้า)",
    color: "border-amber-400",
    accent: "bg-amber-50",
    deals_per_month: 3,
    avg_deal_usd: 25_000,
    suppliers: 12,
    buyers: 8,
    open_demands: 5,
    supplier_deal_freq_mo: 0.25, // 1 deal per 4 months
  },
  {
    id: "target",
    name: "Target ⭐",
    name_th: "เป้าหมาย (คืนทุน ~8 เดือน)",
    color: "border-sage-500",
    accent: "bg-sage-50",
    deals_per_month: 6,
    avg_deal_usd: 35_000,
    suppliers: 20,
    buyers: 12,
    open_demands: 8,
    supplier_deal_freq_mo: 0.3, // 1 deal per 3.3 months
  },
  {
    id: "scale",
    name: "Scale",
    name_th: "Scale (คืนทุน ~4 เดือน)",
    color: "border-sky-500",
    accent: "bg-sky-50",
    deals_per_month: 12,
    avg_deal_usd: 40_000,
    suppliers: 40,
    buyers: 25,
    open_demands: 15,
    supplier_deal_freq_mo: 0.3,
  },
];

function calcScenario(s: Scenario) {
  const monthly_gmv_usd = s.deals_per_month * s.avg_deal_usd;
  const monthly_comm_usd = monthly_gmv_usd * AVG_COMMISSION_RATE;
  const monthly_toni_rs_usd = monthly_comm_usd * TONI_RS;
  const monthly_patrick_net_usd = monthly_comm_usd * (1 - TONI_RS) - MONTHLY_OPEX_USD;
  const breakeven_months = monthly_patrick_net_usd > 0
    ? Math.ceil(PATRICK_INVEST_USD / monthly_patrick_net_usd)
    : Infinity;
  const annual_gmv_usd = monthly_gmv_usd * 12;
  const annual_comm_usd = monthly_comm_usd * 12;
  const annual_toni_rs_thb = monthly_toni_rs_usd * 12 * USD_THB;
  return {
    monthly_gmv_usd,
    monthly_comm_usd,
    monthly_toni_rs_usd,
    monthly_patrick_net_usd,
    breakeven_months,
    annual_gmv_usd,
    annual_comm_usd,
    annual_toni_rs_thb,
    viable: monthly_patrick_net_usd > 0,
  };
}

// ─── per-deal-size break-even table ─────────────────────────────────────────
function calcBreakevenDeals(avg_usd: number) {
  const comm_per_deal = avg_usd * AVG_COMMISSION_RATE;
  const patrick_net_per_deal = comm_per_deal * (1 - TONI_RS);
  const deals_to_breakeven = Math.ceil(PATRICK_INVEST_USD / patrick_net_per_deal);
  return { comm_per_deal, patrick_net_per_deal, deals_to_breakeven };
}

// ─── helper formatters ───────────────────────────────────────────────────────
function usd(n: number) { return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 }); }
function thb(n: number) { return "฿" + n.toLocaleString("th-TH", { maximumFractionDigits: 0 }); }

// ─── page ────────────────────────────────────────────────────────────────────
export default function BreakevenPage() {
  const targetScenario = SCENARIOS.find(s => s.id === "target")!;
  const targetCalc = calcScenario(targetScenario);

  return (
    <main className="min-h-screen bg-cream">
      <div className="container-soft py-10 space-y-10">

        {/* ── Breadcrumb + Title ────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-1 text-sm text-ink-muted">
            <Link href="/" className="hover:text-ink">หน้าแรก</Link>
            <span>/</span>
            <Link href="/reports/commission" className="hover:text-ink">Commission Report</Link>
            <span>/</span>
            <span className="text-ink">Break-Even Analysis</span>
          </div>
          <h1 className="text-2xl font-semibold text-ink">Break-Even Analysis</h1>
          <p className="text-ink-muted text-sm mt-1">
            ต้องมีดีลกี่ดีล Supplier กี่ราย Buyer กี่คน ถึงจะทำให้ Platform นี้คุ้มทุน
          </p>
        </div>

        {/* ── Investment Context ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card p-5">
            <div className="text-xs text-ink-muted uppercase tracking-wide mb-2">เงินลงทุน Patrick (Stage 1)</div>
            <div className="text-2xl font-semibold text-ink">{thb(PATRICK_INVEST_THB)}</div>
            <div className="text-sm text-ink-muted">= {usd(PATRICK_INVEST_USD)}</div>
            <div className="mt-3 text-xs text-ink-muted space-y-1">
              <div className="flex justify-between"><span>Toni service fee</span><span>฿600,000</span></div>
              <div className="flex justify-between"><span>Tech hire (optional)</span><span>฿240,000</span></div>
              <div className="flex justify-between"><span>PDPA + KYB</span><span>฿150K–300K</span></div>
              <div className="flex justify-between"><span>Legal + Infra</span><span>฿130,000</span></div>
            </div>
          </div>
          <div className="card p-5">
            <div className="text-xs text-ink-muted uppercase tracking-wide mb-2">ต้นทุน Platform/เดือน (หลัง launch)</div>
            <div className="text-2xl font-semibold text-ink">{usd(MONTHLY_OPEX_USD)}</div>
            <div className="text-sm text-ink-muted">≈ {thb(MONTHLY_OPEX_USD * USD_THB)}</div>
            <div className="mt-3 text-xs text-ink-muted space-y-1">
              <div className="flex justify-between"><span>Infra (Vercel + Supabase)</span><span>$100</span></div>
              <div className="flex justify-between"><span>Admin/Legal maintenance</span><span>$200</span></div>
              <div className="flex justify-between"><span>Misc (email, SMS)</span><span>$100</span></div>
            </div>
          </div>
          <div className="card p-5 bg-sage-50/60">
            <div className="text-xs text-ink-muted uppercase tracking-wide mb-2">โครงสร้าง Commission</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-muted">Avg rate (realistic mix)</span>
                <span className="font-semibold text-ink">4.0%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Toni RS (3% of commission)</span>
                <span className="font-semibold text-amber-600">0.12% of GMV</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Patrick net per 4% commission</span>
                <span className="font-semibold text-sage-600">3.88% of GMV</span>
              </div>
              <div className="mt-2 pt-2 border-t border-stone-100 text-xs text-ink-muted">
                Patrick's Circle (3%) = Toni RS 0.09% / Top Performer (3.5%) = 0.105% / Reliable (4%) = 0.12%
              </div>
            </div>
          </div>
        </div>

        {/* ── Break-Even by Deal Size ───────────────────────────────────── */}
        <section className="card p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-ink text-lg">🎯 ต้องกี่ดีลถึงคืนทุน Patrick?</h2>
            <p className="text-sm text-ink-muted mt-1">
              คำนวณแบบ "รวมทั้งโปรเจกต์" — ต้องปิดดีลรวมกันเท่าไร ถึงจะคืน {thb(PATRICK_INVEST_THB)} ทั้งหมด
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-3 px-4 text-ink-muted font-medium">ประเภทดีล</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium">ตัวอย่างสินค้า</th>
                  <th className="text-right py-3 px-4 text-ink-muted font-medium">Avg GMV/ดีล</th>
                  <th className="text-right py-3 px-4 text-ink-muted font-medium">Commission/ดีล (4%)</th>
                  <th className="text-right py-3 px-4 text-ink-muted font-medium">Patrick net/ดีล</th>
                  <th className="text-right py-3 px-4 text-ink-muted font-medium text-rose-600">ดีลที่ต้องปิด</th>
                </tr>
              </thead>
              <tbody>
                {DEAL_SIZES.map((ds, i) => {
                  const be = calcBreakevenDeals(ds.avg_usd);
                  const isMix = i === DEAL_SIZES.length - 1;
                  return (
                    <tr
                      key={ds.label}
                      className={`border-b border-stone-50 transition-colors ${isMix ? "bg-sage-50/60 font-semibold" : "hover:bg-stone-50/50"}`}
                    >
                      <td className="py-3 px-4 text-ink">
                        {isMix && <span className="mr-1">⭐</span>}{ds.label}
                      </td>
                      <td className="py-3 px-4 text-ink-muted text-xs">{ds.example}</td>
                      <td className="py-3 px-4 text-right font-mono text-ink">{usd(ds.avg_usd)}</td>
                      <td className="py-3 px-4 text-right font-mono text-sage-600">{usd(be.comm_per_deal)}</td>
                      <td className="py-3 px-4 text-right font-mono text-sage-700">{usd(be.patrick_net_per_deal)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 text-lg">
                        {be.deals_to_breakeven}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            ⭐ <strong>ข้อสรุป:</strong> ถ้า average deal = $35,000 (Mix จริง) →
            ต้องปิดให้ได้ <strong>27 ดีล</strong> รวม (ทุก status = closed)
            ถึงจะคืนทุน Patrick ฿1.3M ทั้งหมด
          </div>
        </section>

        {/* ── Scenario Cards ────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div>
            <h2 className="font-semibold text-ink text-lg">📐 4 Scenarios — Supplier / Buyer / ดีล ที่ต้องมี</h2>
            <p className="text-sm text-ink-muted mt-1">
              แต่ละ scenario ต้องการ Supplier / Buyer ขั้นต่ำเท่าไร และ Patrick คืนทุนในกี่เดือน
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENARIOS.map(s => {
              const c = calcScenario(s);
              const isTarget = s.id === "target";
              return (
                <div
                  key={s.id}
                  className={`card p-6 border-l-4 ${s.color} ${isTarget ? "ring-2 ring-sage-300" : ""} space-y-4`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-ink text-base">{s.name}</div>
                      <div className="text-sm text-ink-muted">{s.name_th}</div>
                    </div>
                    {isTarget && (
                      <span className="pill text-xs bg-sage-100 text-sage-700">แนะนำ</span>
                    )}
                  </div>

                  {/* Core targets */}
                  <div className={`rounded-xl p-4 ${s.accent} grid grid-cols-3 gap-3 text-center`}>
                    <div>
                      <div className="text-2xl font-bold text-ink">{s.suppliers}</div>
                      <div className="text-xs text-ink-muted mt-1">Suppliers<br />ขั้นต่ำ</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-ink">{s.buyers}</div>
                      <div className="text-xs text-ink-muted mt-1">Buyers<br />ขั้นต่ำ</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-ink">{s.open_demands}</div>
                      <div className="text-xs text-ink-muted mt-1">Open<br />Demands</div>
                    </div>
                  </div>

                  {/* Deal metrics */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ink-muted">ดีล/เดือน</span>
                      <span className="font-semibold text-ink">{s.deals_per_month} deals</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Avg deal size</span>
                      <span className="font-mono text-ink">{usd(s.avg_deal_usd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">GMV/เดือน</span>
                      <span className="font-mono text-ink">{usd(c.monthly_gmv_usd)}</span>
                    </div>
                    <div className="flex justify-between border-t border-stone-100 pt-2">
                      <span className="text-ink-muted">Commission/เดือน</span>
                      <span className="font-mono text-sage-600">{usd(c.monthly_comm_usd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Toni RS/เดือน</span>
                      <span className="font-mono text-amber-600">{usd(c.monthly_toni_rs_usd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-muted">Patrick net/เดือน</span>
                      <span className={`font-mono ${c.monthly_patrick_net_usd > 0 ? "text-sage-700" : "text-rose-500"}`}>
                        {c.viable ? usd(c.monthly_patrick_net_usd) : "ติดลบ"}
                      </span>
                    </div>
                  </div>

                  {/* Payback */}
                  <div className={`rounded-xl p-3 text-center ${c.breakeven_months <= 12 ? "bg-emerald-50" : c.breakeven_months <= 24 ? "bg-amber-50" : "bg-rose-50"}`}>
                    <div className={`text-2xl font-bold ${c.breakeven_months <= 12 ? "text-emerald-700" : c.breakeven_months <= 24 ? "text-amber-700" : "text-rose-600"}`}>
                      {c.viable ? `${c.breakeven_months} เดือน` : "ไม่คืนทุน"}
                    </div>
                    <div className="text-xs text-ink-muted mt-0.5">Payback period</div>
                    <div className="text-xs text-ink-muted">(หลัง launch = เดือน 3)</div>
                  </div>

                  {/* Freq note */}
                  <div className="text-xs text-ink-muted border-t border-stone-100 pt-2">
                    แต่ละ Supplier ปิดดีลได้ประมาณ{" "}
                    <strong>1 ดีล ทุก {Math.round(1 / s.supplier_deal_freq_mo)} เดือน</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Minimum Viable Platform ───────────────────────────────────── */}
        <section className="card p-6 space-y-6">
          <h2 className="font-semibold text-ink text-lg">🔑 Minimum Viable Platform (MVP คืนทุน)</h2>
          <p className="text-sm text-ink-muted">
            นี่คือตัวเลขที่เล็กที่สุดที่ยังทำให้ Platform นี้สร้างกำไรได้จริง — ใช้เป็น KPI สำหรับ Toni ใน Stage 1
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Supply side */}
            <div>
              <div className="text-sm font-semibold text-ink mb-3">Supply Side (Suppliers)</div>
              <div className="space-y-3">
                {[
                  { metric: "Total Suppliers on Platform", min: 20, target: 30, icon: "🏭", note: "ขั้นต่ำให้ Buyer มีตัวเลือก" },
                  { metric: "Verified Suppliers", min: 15, target: 25, icon: "✅", note: "KYC + เอกสารครบ" },
                  { metric: "Patrick's Circle", min: 3, target: 6, icon: "⭐", note: "วงในที่ปิดดีลได้เร็ว" },
                  { metric: "Suppliers ที่ active (ดีลใน 90 วัน)", min: 10, target: 20, icon: "🔥", note: "Engagement จริง" },
                  { metric: "Category ที่ cover", min: 4, target: 7, icon: "📦", note: "ag, textile, craft, beverage..." },
                ].map(row => (
                  <div key={row.metric} className="flex items-center gap-3">
                    <span className="text-lg w-7 shrink-0">{row.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink">{row.metric}</div>
                      <div className="text-xs text-ink-muted">{row.note}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-ink-muted">Min / Target</div>
                      <div className="font-semibold text-ink text-sm">{row.min} / {row.target}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demand side */}
            <div>
              <div className="text-sm font-semibold text-ink mb-3">Demand Side (Buyers)</div>
              <div className="space-y-3">
                {[
                  { metric: "Total Buyers on Platform", min: 10, target: 20, icon: "🌍", note: "กระจาย region ที่หลากหลาย" },
                  { metric: "Verified Buyers", min: 8, target: 15, icon: "✅", note: "KYB + ประวัติธุรกิจ" },
                  { metric: "Open Demands ณ เวลาใดเวลาหนึ่ง", min: 5, target: 12, icon: "📋", note: "Supply matching target" },
                  { metric: "Repeat Buyers (ดีล ≥ 2 ครั้ง)", min: 3, target: 8, icon: "🔁", note: "สัญญาณ trust + quality" },
                  { metric: "Avg buyer spend/order (USD)", min: 15_000, target: 35_000, icon: "💰", note: "ถ้าต่ำกว่า $10K จะไม่คุ้ม" },
                ].map(row => (
                  <div key={row.metric} className="flex items-center gap-3">
                    <span className="text-lg w-7 shrink-0">{row.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-ink">{row.metric}</div>
                      <div className="text-xs text-ink-muted">{row.note}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-ink-muted">Min / Target</div>
                      <div className="font-semibold text-ink text-sm">
                        {typeof row.min === "number" && row.min >= 1000
                          ? `${usd(row.min)} / ${usd(row.target)}`
                          : `${row.min} / ${row.target}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deal flow targets */}
          <div>
            <div className="text-sm font-semibold text-ink mb-3">Deal Flow KPI (Monthly)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left py-2 px-3 text-ink-muted font-medium">KPI</th>
                    <th className="text-center py-2 px-3 text-ink-muted font-medium">Minimum</th>
                    <th className="text-center py-2 px-3 text-ink-muted font-medium">Target ⭐</th>
                    <th className="text-center py-2 px-3 text-ink-muted font-medium">Scale</th>
                    <th className="text-left py-2 px-3 text-ink-muted font-medium">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { kpi: "New Matches/เดือน", min: "3", target: "8", scale: "20+", note: "AI match supplier ↔ buyer" },
                    { kpi: "Deals Opened/เดือน", min: "2", target: "6", scale: "15+", note: "จาก match → เปิดดีล" },
                    { kpi: "Deals Closed/เดือน", min: "1", target: "4", scale: "10+", note: "Conversion ~50-60%" },
                    { kpi: "GMV Closed/เดือน (USD)", min: "$25K", target: "$140K", scale: "$400K+", note: "avg deal × closed count" },
                    { kpi: "Commission/เดือน (USD)", min: "$1,000", target: "$5,600", scale: "$16K+", note: "4% avg" },
                    { kpi: "Toni RS/เดือน (USD)", min: "$30", target: "$168", scale: "$480+", note: "3% of commission" },
                    { kpi: "Patrick net/เดือน (USD)", min: "$570", target: "$5,232", scale: "$15.1K+", note: "หลังหัก Toni + ops" },
                  ].map(row => (
                    <tr key={row.kpi} className="border-b border-stone-50 hover:bg-stone-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-ink">{row.kpi}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-rose-600">{row.min}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-semibold text-sage-600">{row.target}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-sky-600">{row.scale}</td>
                      <td className="py-2.5 px-3 text-ink-muted text-xs">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Timeline to Breakeven ─────────────────────────────────────── */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-lg">📅 Timeline คืนทุน (Target Scenario)</h2>
          <p className="text-sm text-ink-muted">
            สมมติ {targetScenario.deals_per_month} deals/เดือน · avg {usd(targetScenario.avg_deal_usd)}/deal · เริ่ม revenue เดือน 3 หลัง Stage 1 kick-off
          </p>
          <div className="space-y-2">
            {[
              { mo: "M1–M2", label: "Stage 1 MVP Build", note: "ไม่มี revenue — Toni build + setup", commission: 0, cumulative: 0, invested: PATRICK_INVEST_USD, color: "bg-stone-200" },
              { mo: "M3",    label: "Soft Launch", note: "เริ่ม match ครั้งแรก — 1-2 deals", commission: 2 * 35_000 * 0.04 * 0.97, cumulative: 2 * 35_000 * 0.04 * 0.97, invested: PATRICK_INVEST_USD, color: "bg-amber-200" },
              { mo: "M6",    label: "Growing", note: `${targetScenario.deals_per_month} deals/mo sustained`, commission: 4 * 35_000 * 0.04 * 0.97, cumulative: 4 * 35_000 * 0.04 * 0.97 * 4, invested: PATRICK_INVEST_USD, color: "bg-amber-300" },
              { mo: "M8",    label: "Break-even", note: "Patrick คืนทุน ฿1.3M ณ จุดนี้", commission: targetCalc.monthly_patrick_net_usd, cumulative: PATRICK_INVEST_USD, invested: PATRICK_INVEST_USD, color: "bg-emerald-300" },
              { mo: "M12",   label: "Year 1 Close", note: "Pure profit — ทุก baht เป็น upside", commission: targetCalc.monthly_patrick_net_usd, cumulative: targetCalc.monthly_patrick_net_usd * 12, invested: PATRICK_INVEST_USD, color: "bg-emerald-400" },
              { mo: "M36",   label: "Year 3 Target", note: "Scale — platform self-sustaining", commission: 12 * 40_000 * 0.04 * 0.97, cumulative: PATRICK_INVEST_USD * 96, invested: PATRICK_INVEST_USD, color: "bg-sage-500" },
            ].map((row, i) => {
              const pct = Math.min((row.cumulative / PATRICK_INVEST_USD) * 100, 100);
              const recovered = row.cumulative >= row.invested;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 text-right text-sm font-mono text-ink-muted shrink-0">{row.mo}</div>
                  <div className={`w-3 h-3 rounded-full shrink-0 ${row.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-ink">{row.label}</span>
                      {recovered && row.mo !== "M1–M2" && row.mo !== "M3" && row.mo !== "M6" && (
                        <span className="pill text-xs bg-emerald-100 text-emerald-700">คืนทุน</span>
                      )}
                    </div>
                    <div className="text-xs text-ink-muted">{row.note}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-mono font-semibold text-sage-600">
                      {row.commission > 0 ? `+${usd(row.commission)}/mo` : "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Summary Box for Patrick ───────────────────────────────────── */}
        <section className="card p-6 bg-ink text-cream space-y-4">
          <h2 className="font-semibold text-lg">สรุปสำหรับ Patrick (1 หน้า)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-cream/60 text-xs uppercase tracking-wide">คืนทุน ฿1.3M ต้องมี</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream/80">จำนวนดีลรวม</span>
                  <span className="font-semibold text-cream">27 deals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Suppliers ขั้นต่ำ</span>
                  <span className="font-semibold text-cream">20 ราย</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Buyers ขั้นต่ำ</span>
                  <span className="font-semibold text-cream">12 ราย</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Open Demands</span>
                  <span className="font-semibold text-cream">8 รายการ</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-cream/60 text-xs uppercase tracking-wide">Target KPI รายเดือน</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream/80">Deals closed/mo</span>
                  <span className="font-semibold text-cream">4–6 deals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Avg GMV/deal</span>
                  <span className="font-semibold text-cream">$35,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Commission/mo</span>
                  <span className="font-semibold text-sage-300">$5,600</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Patrick net/mo</span>
                  <span className="font-semibold text-sage-300">$5,232</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-cream/60 text-xs uppercase tracking-wide">Patrick ROI</div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream/80">Payback period</span>
                  <span className="font-semibold text-emerald-300">~8 เดือน</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Year 1 net profit</span>
                  <span className="font-semibold text-emerald-300">฿1.8M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Year 3 net (cumulative)</span>
                  <span className="font-semibold text-emerald-300">฿125M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Toni เพิ่มมาเสริม</span>
                  <span className="font-semibold text-amber-300">฿3.87M RS</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-cream/20 pt-4 text-sm text-cream/70">
            ⚠️ สมมติ avg commission rate 4.0% · USD/THB 35 · deal conversion 50% · ตัวเลขจริงขึ้นกับ Patrick's network quality + Toni's execution speed
          </div>
        </section>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/reports/commission" className="btn-secondary">← Commission Report</Link>
          <Link href="/deals" className="btn-primary">ดูดีลทั้งหมด →</Link>
        </div>
      </div>
    </main>
  );
}
