"use client";
import { useState, useMemo } from "react";

// ─── constants ────────────────────────────────────────────────────────────────
const USD_THB = 35;
const TONI_RS = 0.03;

const STAGE_COSTS = {
  s0: { one_time: 0, monthly: 0 },
  s1_onetime: {
    toni_service: 600_000,
    tech_hire: 240_000,       // optional
    pdpa: 125_000,
    kyb: 100_000,
    legal: 80_000,
    infra_setup: 50_000,
    buffer: 60_000,
  },
  s1_monthly: { infra: 3_500, legal: 7_000, misc: 3_500 }, // fixed only; Toni RS is variable
  s2_monthly: {
    toni_salary: 180_000,
    tech_staff: 90_000,
    sales_bd: 60_000,
    infra: 35_000,
    legal_acct: 22_500,
    marketing: 35_000,
  },
};

const S1_FIXED_MONTHLY = Object.values(STAGE_COSTS.s1_monthly).reduce((a, v) => a + v, 0); // 14,000
const S2_FIXED_MONTHLY = Object.values(STAGE_COSTS.s2_monthly).reduce((a, v) => a + v, 0); // 422,500

type Stage = "s0" | "s1" | "s2";

function fmt(n: number, decimals = 0) {
  return n.toLocaleString("th-TH", { maximumFractionDigits: decimals });
}
function fmtUSD(n: number) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

interface SliderProps {
  label: string;
  sublabel?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  accent?: string;
}

function Slider({ label, sublabel, value, min, max, step, format, onChange, accent = "accent-[#5B7A61]" }: SliderProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <div>
          <span className="text-sm font-medium text-ink">{label}</span>
          {sublabel && <span className="text-xs text-ink-muted ml-1.5">{sublabel}</span>}
        </div>
        <span className="text-sm font-semibold text-ink font-mono">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-full cursor-pointer ${accent}`}
      />
      <div className="flex justify-between text-[10px] text-ink-muted">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  large?: boolean;
}

function MetricCard({ label, value, sub, color = "text-ink", large }: MetricCardProps) {
  return (
    <div className="bg-white/70 rounded-xl p-3 space-y-0.5">
      <div className="text-[11px] text-ink-muted uppercase tracking-wide">{label}</div>
      <div className={`font-semibold ${large ? "text-xl" : "text-base"} ${color} font-mono leading-tight`}>{value}</div>
      {sub && <div className="text-[11px] text-ink-muted">{sub}</div>}
    </div>
  );
}

export default function InvestmentSimulator() {
  const [stage, setStage] = useState<Stage>("s1");
  const [includeTechHire, setIncludeTechHire] = useState(true);

  // Supply inputs
  const [suppliers, setSuppliers] = useState(20);
  const [buyers, setBuyers] = useState(12);
  const [dealsPerMonth, setDealsPerMonth] = useState(6);
  const [avgDealUSD, setAvgDealUSD] = useState(35_000);
  const [circlePercent, setCirclePercent] = useState(30);   // % of deals that are Patrick's Circle

  // Revenue model
  const [commissionRate, setCommissionRate] = useState(4.0); // override; weighted below
  const [onboardingFeeThb, setOnboardingFeeThb] = useState(5_000);
  const [buyerBadgeUSD, setBuyerBadgeUSD] = useState(300);
  const [newSuppliersPerMo, setNewSuppliersPerMo] = useState(3);
  const [newBuyersPerMo, setNewBuyersPerMo] = useState(2);

  // ─── derived ───────────────────────────────────────────────────────────────
  const calc = useMemo(() => {
    // Weighted avg commission rate
    const circleFrac = circlePercent / 100;
    const weightedRate = circleFrac * 0.030 + (1 - circleFrac) * (commissionRate / 100);

    // Monthly GMV
    const monthly_gmv_usd = dealsPerMonth * avgDealUSD;
    const monthly_gmv_thb = monthly_gmv_usd * USD_THB;

    // Commission
    const monthly_comm_usd = monthly_gmv_usd * weightedRate;
    const monthly_comm_thb = monthly_comm_usd * USD_THB;

    // Toni RS
    const monthly_toni_rs_thb = monthly_comm_thb * TONI_RS;

    // Patrick commission net (before ops)
    const monthly_patrick_comm_thb = monthly_comm_thb * (1 - TONI_RS);

    // Onboarding + badge revenue
    const monthly_onboarding_thb = newSuppliersPerMo * onboardingFeeThb;
    const monthly_badge_thb = newBuyersPerMo * buyerBadgeUSD * USD_THB;
    const monthly_other_revenue_thb = monthly_onboarding_thb + monthly_badge_thb;

    // Total monthly revenue to Patrick
    const monthly_total_revenue_thb = monthly_patrick_comm_thb + monthly_other_revenue_thb;

    // Stage costs
    const s1_onetime =
      STAGE_COSTS.s1_onetime.toni_service +
      (includeTechHire ? STAGE_COSTS.s1_onetime.tech_hire : 0) +
      STAGE_COSTS.s1_onetime.pdpa +
      STAGE_COSTS.s1_onetime.kyb +
      STAGE_COSTS.s1_onetime.legal +
      STAGE_COSTS.s1_onetime.infra_setup +
      STAGE_COSTS.s1_onetime.buffer;

    const monthly_ops =
      stage === "s0" ? 0 :
      stage === "s1" ? S1_FIXED_MONTHLY + monthly_toni_rs_thb :
      S2_FIXED_MONTHLY + monthly_toni_rs_thb;

    const monthly_patrick_net = monthly_total_revenue_thb - monthly_ops;

    // Payback
    const payback_months =
      stage === "s0" ? null :
      monthly_patrick_net > 0 ? Math.ceil(s1_onetime / monthly_patrick_net) : null;

    // 12-month cumulative
    const cum_12mo = monthly_patrick_net * 12 - (stage === "s0" ? 0 : s1_onetime);
    const cum_36mo = monthly_patrick_net * 36 - (stage === "s0" ? 0 : s1_onetime);

    // Year 1 simple commission revenue
    const annual_commission_thb = monthly_comm_thb * 12;
    const annual_gmv_thb = monthly_gmv_thb * 12;

    return {
      weightedRate,
      monthly_gmv_usd,
      monthly_gmv_thb,
      monthly_comm_usd,
      monthly_comm_thb,
      monthly_toni_rs_thb,
      monthly_patrick_comm_thb,
      monthly_onboarding_thb,
      monthly_badge_thb,
      monthly_other_revenue_thb,
      monthly_total_revenue_thb,
      monthly_ops,
      monthly_patrick_net,
      s1_onetime,
      payback_months,
      cum_12mo,
      cum_36mo,
      annual_commission_thb,
      annual_gmv_thb,
    };
  }, [
    stage, includeTechHire, suppliers, buyers, dealsPerMonth, avgDealUSD,
    circlePercent, commissionRate, onboardingFeeThb, buyerBadgeUSD,
    newSuppliersPerMo, newBuyersPerMo,
  ]);

  const stageItems = [
    { id: "s0" as Stage, label: "Stage 0", sublabel: "Demo ฟรี" },
    { id: "s1" as Stage, label: "Stage 1", sublabel: "MVP ฿1.3M" },
    { id: "s2" as Stage, label: "Stage 2", sublabel: "Scale ฿423K/mo" },
  ];

  const isProfit = calc.monthly_patrick_net > 0;
  const profitColor = isProfit ? "text-emerald-600" : "text-rose-500";
  const pbLabel = calc.payback_months == null
    ? "ไม่คืนทุนใน 3 ปี"
    : calc.payback_months > 60
    ? "> 5 ปี"
    : `${calc.payback_months} เดือน`;

  return (
    <div className="card p-0 overflow-hidden border border-stone-100 shadow-soft">
      {/* ── Header bar ────────────────────────────────────────────── */}
      <div className="bg-ink px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-cream font-semibold text-base">Investment Simulator</div>
          <div className="text-cream/60 text-xs">ลาก slider เพื่อดู ROI แบบ real-time</div>
        </div>
        {/* Stage tabs */}
        <div className="flex rounded-xl overflow-hidden border border-cream/20">
          {stageItems.map(s => (
            <button
              key={s.id}
              onClick={() => setStage(s.id)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                stage === s.id
                  ? "bg-sage-500 text-cream"
                  : "text-cream/60 hover:text-cream hover:bg-white/10"
              }`}
            >
              {s.label}
              <div className="text-[10px] opacity-70">{s.sublabel}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] divide-y lg:divide-y-0 lg:divide-x divide-stone-100">

        {/* ── LEFT: Inputs ──────────────────────────────────────────── */}
        <div className="p-6 space-y-6 bg-stone-50/30">

          {/* Stage costs summary */}
          {stage !== "s0" && (
            <div className={`rounded-xl p-4 border ${stage === "s1" ? "bg-amber-50 border-amber-200" : "bg-sky-50 border-sky-200"}`}>
              <div className={`text-xs font-semibold mb-2 ${stage === "s1" ? "text-amber-800" : "text-sky-800"}`}>
                {stage === "s1" ? "Stage 1 — ต้นทุน (Patrick จ่ายครั้งเดียว)" : "Stage 2 — ต้นทุนรายเดือน"}
              </div>
              {stage === "s1" && (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-amber-700">Toni Service Fee</span>
                    <span className="font-mono font-semibold text-amber-800">฿600,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-700 flex items-center gap-1.5">
                      Tech Hire (optional)
                      <input type="checkbox" checked={includeTechHire}
                        onChange={e => setIncludeTechHire(e.target.checked)}
                        className="rounded" />
                    </span>
                    <span className={`font-mono font-semibold ${includeTechHire ? "text-amber-800" : "text-amber-400 line-through"}`}>
                      ฿240,000
                    </span>
                  </div>
                  {[
                    ["PDPA Setup", "฿125,000"],
                    ["KYB / Verification", "฿100,000"],
                    ["Legal (TOS + term sheets)", "฿80,000"],
                    ["Infra + Buffer", "฿110,000"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-amber-700">{k}</span>
                      <span className="font-mono text-amber-800">{v}</span>
                    </div>
                  ))}
                  <div className="border-t border-amber-300 pt-1 flex justify-between">
                    <span className="font-semibold text-amber-800">รวม Patrick ลงทุน</span>
                    <span className="font-mono font-bold text-amber-900">฿{fmt(calc.s1_onetime)}</span>
                  </div>
                  <div className="flex justify-between text-amber-600">
                    <span>+ Monthly ops (fixed)</span>
                    <span className="font-mono">฿{fmt(S1_FIXED_MONTHLY)}/เดือน</span>
                  </div>
                  <div className="flex justify-between text-amber-600">
                    <span>+ Toni RS (variable)</span>
                    <span className="font-mono">3% × commission</span>
                  </div>
                </div>
              )}
              {stage === "s2" && (
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {[
                    ["Toni Salary", "฿180,000"],
                    ["Tech Staff (1)", "฿90,000"],
                    ["Sales / BD", "฿60,000"],
                    ["Infra Scale", "฿35,000"],
                    ["Legal / Accounting", "฿22,500"],
                    ["Marketing", "฿35,000"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-sky-700">{k}</span>
                      <span className="font-mono text-sky-800">{v}</span>
                    </div>
                  ))}
                  <div className="col-span-2 border-t border-sky-300 pt-1 flex justify-between">
                    <span className="font-semibold text-sky-800">รวม Fixed/เดือน</span>
                    <span className="font-mono font-bold text-sky-900">฿{fmt(S2_FIXED_MONTHLY)}/mo</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Supply sliders */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Supply & Demand</div>
            <Slider label="Suppliers บน Platform" value={suppliers} min={5} max={100} step={1}
              format={v => `${v} ราย`} onChange={setSuppliers} />
            <Slider label="Buyers บน Platform" value={buyers} min={3} max={60} step={1}
              format={v => `${v} ราย`} onChange={setBuyers} />
            <Slider label="Open Demands" sublabel="(ณ เวลาใดก็ได้)" value={Math.round(buyers * 0.6)} min={1} max={40} step={1}
              format={v => `${v} รายการ`} onChange={() => {}} />
          </div>

          {/* Deal sliders */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Deal Flow</div>
            <Slider label="Deals Closed / เดือน" value={dealsPerMonth} min={1} max={25} step={1}
              format={v => `${v} deals`} onChange={setDealsPerMonth} />
            <Slider label="Avg GMV / deal" value={avgDealUSD} min={5_000} max={150_000} step={1_000}
              format={v => fmtUSD(v)} onChange={setAvgDealUSD} />
            <Slider label="Patrick's Circle %" sublabel="(rate 3.0%)" value={circlePercent} min={0} max={100} step={5}
              format={v => `${v}%`} onChange={setCirclePercent} />
            <Slider label="Commission Rate (non-Circle avg)" value={commissionRate} min={3.0} max={5.5} step={0.1}
              format={v => `${v.toFixed(1)}%`} onChange={setCommissionRate} />
          </div>

          {/* Revenue model sliders */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Revenue Model</div>
            <Slider label="Supplier Onboarding Fee" value={onboardingFeeThb} min={0} max={10_000} step={500}
              format={v => `฿${fmt(v)}`} onChange={setOnboardingFeeThb} />
            <Slider label="New Suppliers / เดือน" value={newSuppliersPerMo} min={0} max={20} step={1}
              format={v => `${v} ราย`} onChange={setNewSuppliersPerMo} />
            <Slider label="Verified Buyer Badge" value={buyerBadgeUSD} min={0} max={1_000} step={50}
              format={v => fmtUSD(v) + "/ปี"} onChange={setBuyerBadgeUSD} />
            <Slider label="New Buyers / เดือน" value={newBuyersPerMo} min={0} max={10} step={1}
              format={v => `${v} ราย`} onChange={setNewBuyersPerMo} />
          </div>
        </div>

        {/* ── RIGHT: Outputs ────────────────────────────────────────── */}
        <div className="p-6 space-y-5 bg-cream/50">

          {/* Main KPIs */}
          <div>
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">รายได้รายเดือน</div>
            <div className="grid grid-cols-2 gap-2">
              <MetricCard label="GMV / เดือน" value={`฿${fmt(calc.monthly_gmv_thb)}`} sub={fmtUSD(calc.monthly_gmv_usd)} large />
              <MetricCard label="Commission / เดือน" value={`฿${fmt(calc.monthly_comm_thb)}`}
                sub={`rate ${(calc.weightedRate * 100).toFixed(2)}%`} color="text-sage-600" large />
              <MetricCard label="Toni RS / เดือน" value={`฿${fmt(calc.monthly_toni_rs_thb)}`} sub="3% of commission" color="text-amber-600" />
              <MetricCard label="Onboarding + Badge" value={`฿${fmt(calc.monthly_other_revenue_thb)}`} sub="/เดือน" />
            </div>
          </div>

          {/* Patrick net */}
          <div className={`rounded-xl p-4 ${isProfit ? "bg-emerald-50 border border-emerald-200" : "bg-rose-50 border border-rose-200"}`}>
            <div className={`text-xs font-semibold mb-1 ${isProfit ? "text-emerald-700" : "text-rose-700"}`}>
              Patrick Net / เดือน (หลังหัก ops + Toni RS)
            </div>
            <div className={`text-3xl font-bold ${profitColor} font-mono`}>
              {calc.monthly_patrick_net >= 0 ? "+" : ""}฿{fmt(Math.abs(calc.monthly_patrick_net))}
            </div>
            <div className="text-xs text-ink-muted mt-1">
              Revenue ฿{fmt(calc.monthly_total_revenue_thb)} − Ops ฿{fmt(calc.monthly_ops)}
            </div>
          </div>

          {/* Payback + cumulative */}
          <div>
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Payback & Cumulative</div>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-white/70 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <div className="text-[11px] text-ink-muted uppercase tracking-wide">Payback Period</div>
                  <div className={`font-bold text-xl font-mono ${calc.payback_months && calc.payback_months <= 12 ? "text-emerald-600" : calc.payback_months && calc.payback_months <= 24 ? "text-amber-600" : "text-rose-500"}`}>
                    {stage === "s0" ? "N/A" : pbLabel}
                  </div>
                </div>
                {calc.payback_months && calc.payback_months <= 36 && (
                  <div className={`text-3xl ${calc.payback_months <= 12 ? "text-emerald-500" : "text-amber-500"}`}>
                    {calc.payback_months <= 12 ? "🟢" : "🟡"}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/70 rounded-xl p-3">
                  <div className="text-[11px] text-ink-muted">Year 1 Cumulative</div>
                  <div className={`font-semibold text-base font-mono ${calc.cum_12mo >= 0 ? "text-sage-600" : "text-rose-500"}`}>
                    {calc.cum_12mo >= 0 ? "+" : ""}฿{fmt(Math.abs(calc.cum_12mo))}
                  </div>
                </div>
                <div className="bg-white/70 rounded-xl p-3">
                  <div className="text-[11px] text-ink-muted">Year 3 Cumulative</div>
                  <div className={`font-semibold text-base font-mono ${calc.cum_36mo >= 0 ? "text-sage-700" : "text-rose-500"}`}>
                    {calc.cum_36mo >= 0 ? "+" : ""}฿{fmt(Math.abs(calc.cum_36mo))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini bar chart — monthly revenue breakdown */}
          <div>
            <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Revenue Breakdown</div>
            <div className="space-y-2">
              {[
                { label: "Patrick Commission Net", value: calc.monthly_patrick_comm_thb, color: "bg-sage-400", total: calc.monthly_total_revenue_thb },
                { label: "Supplier Onboarding", value: calc.monthly_onboarding_thb, color: "bg-amber-300", total: calc.monthly_total_revenue_thb },
                { label: "Buyer Badge", value: calc.monthly_badge_thb, color: "bg-sky-300", total: calc.monthly_total_revenue_thb },
                { label: "Ops Cost (−)", value: calc.monthly_ops, color: "bg-rose-300", total: calc.monthly_total_revenue_thb },
              ].map(row => {
                const pct = calc.monthly_total_revenue_thb > 0 ? Math.min((row.value / calc.monthly_total_revenue_thb) * 100, 100) : 0;
                return (
                  <div key={row.label} className="space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-ink-muted">{row.label}</span>
                      <span className="font-mono text-ink">฿{fmt(row.value)}</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full`} style={{ width: `${Math.max(pct, row.value > 0 ? 1 : 0)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform overview */}
          <div className="bg-white/50 rounded-xl p-3 text-xs space-y-1 border border-stone-100">
            <div className="font-semibold text-ink mb-2">Platform Overview (inputs)</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-ink-muted">
              <span>Suppliers</span><span className="font-semibold text-ink text-right">{suppliers} ราย</span>
              <span>Buyers</span><span className="font-semibold text-ink text-right">{buyers} ราย</span>
              <span>Deals/mo</span><span className="font-semibold text-ink text-right">{dealsPerMonth}</span>
              <span>Avg Deal</span><span className="font-semibold text-ink text-right">{fmtUSD(avgDealUSD)}</span>
              <span>Circle %</span><span className="font-semibold text-ink text-right">{circlePercent}%</span>
              <span>Eff. Rate</span><span className="font-semibold text-sage-600 text-right">{(calc.weightedRate * 100).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
