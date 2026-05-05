import { listDeals, listSuppliers, isSupabaseConfigured } from "@/lib/db/queries";
import { getCommissionTier, COMMISSION_TIERS, formatRate } from "@/lib/commission";
import type { Deal, Supplier } from "@/lib/db/types";
import Link from "next/link";

// ─── projection constants ───────────────────────────────────────────────────
const USD_THB = 35;
const AVG_COMMISSION_RATE = 0.038;
const TONI_RS_RATE = 0.03;      // 3% revenue share on platform commission
const STAGE1_SERVICE = 600000;  // ฿600K fixed

const MONTHLY_GMV_USD: Record<number, number> = {
  1: 0, 2: 0,                                     // MVP build — no revenue
  3: 100000, 4: 180000, 5: 250000, 6: 320000,     // launch ramp
  7: 480000, 8: 640000, 9: 800000,                 // traction
  10: 1000000, 11: 1150000, 12: 1300000,           // year 1 close
  13: 1600000, 14: 1800000, 15: 2000000,
  16: 2200000, 17: 2400000, 18: 2600000,
  19: 3000000, 20: 3200000, 21: 3400000,
  22: 3600000, 23: 3800000, 24: 4000000,           // year 2 close
  25: 4200000, 26: 4300000, 27: 4400000,
  28: 4500000, 29: 4600000, 30: 4700000,
  31: 4800000, 32: 4900000, 33: 5000000,
  34: 5100000, 35: 5200000, 36: 5400000,           // year 3 close
};

function buildProjection() {
  let cumulativeCommissionUSD = 0;
  let cumulativeToniRS_USD = 0;
  let cumulativeGMV = 0;
  const rows = [];

  for (let m = 1; m <= 36; m++) {
    const gmv = MONTHLY_GMV_USD[m] ?? 0;
    const comm = gmv * AVG_COMMISSION_RATE;
    const toniRS = comm * TONI_RS_RATE;
    cumulativeGMV += gmv;
    cumulativeCommissionUSD += comm;
    cumulativeToniRS_USD += toniRS;
    if (m % 3 === 0 || m <= 3) {
      rows.push({ m, gmv, comm, toniRS, cumulativeCommissionUSD, cumulativeToniRS_USD, cumulativeGMV });
    }
  }
  return { rows, totalGMV: cumulativeGMV, totalComm: cumulativeCommissionUSD, totalToniRS: cumulativeToniRS_USD };
}

// ─── static fallback data when Supabase not connected ──────────────────────
const STATIC_DEALS: (Deal & { supplier_name?: string })[] = [
  { id: "deal-001", supplier_id: "sup-001", buyer_id: "buy-005", demand_id: null, status: "closed", amount_usd: 86000, commission_rate: 0.035, commission_usd: 3010, notes: null, opened_at: "", agreed_at: "", paid_at: "", closed_at: "", cancelled_at: null, supplier_name: "Khun Wichai Durian Estate" },
  { id: "deal-002", supplier_id: "sup-002", buyer_id: "buy-001", demand_id: null, status: "closed", amount_usd: 54000, commission_rate: 0.040, commission_usd: 2160, notes: null, opened_at: "", agreed_at: "", paid_at: "", closed_at: "", cancelled_at: null, supplier_name: "Siam Premium Rice Cooperative" },
  { id: "deal-003", supplier_id: "sup-005", buyer_id: "buy-002", demand_id: null, status: "closed", amount_usd: 128000, commission_rate: 0.030, commission_usd: 3840, notes: null, opened_at: "", agreed_at: "", paid_at: "", closed_at: "", cancelled_at: null, supplier_name: "Lanna Silk Atelier" },
  { id: "deal-004", supplier_id: "sup-009", buyer_id: "buy-018", demand_id: null, status: "closed", amount_usd: 92000, commission_rate: 0.035, commission_usd: 3220, notes: null, opened_at: "", agreed_at: "", paid_at: "", closed_at: "", cancelled_at: null, supplier_name: "Sukhothai Celadon Atelier" },
  { id: "deal-005", supplier_id: "sup-015", buyer_id: "buy-011", demand_id: null, status: "closed", amount_usd: 215000, commission_rate: 0.030, commission_usd: 6450, notes: null, opened_at: "", agreed_at: "", paid_at: "", closed_at: "", cancelled_at: null, supplier_name: "Nakhon Pathom Orchid Exporters" },
  { id: "deal-006", supplier_id: "sup-020", buyer_id: "buy-018", demand_id: null, status: "closed", amount_usd: 64000, commission_rate: 0.035, commission_usd: 2240, notes: null, opened_at: "", agreed_at: "", paid_at: "", closed_at: "", cancelled_at: null, supplier_name: "Ayutthaya Silver Atelier" },
  { id: "deal-007", supplier_id: "sup-003", buyer_id: "buy-017", demand_id: null, status: "closed", amount_usd: 24000, commission_rate: 0.040, commission_usd: 960, notes: null, opened_at: "", agreed_at: "", paid_at: "", closed_at: "", cancelled_at: null, supplier_name: "Chiang Rai Tea Atelier" },
  { id: "deal-008", supplier_id: "sup-006", buyer_id: "buy-013", demand_id: null, status: "paid", amount_usd: 18000, commission_rate: 0.045, commission_usd: 810, notes: null, opened_at: "", agreed_at: "", paid_at: "", closed_at: null, cancelled_at: null, supplier_name: "Ratchaburi Coconut Estates" },
  { id: "deal-009", supplier_id: "sup-013", buyer_id: "buy-009", demand_id: "dem-006", status: "agreed", amount_usd: 42000, commission_rate: 0.040, commission_usd: 1680, notes: null, opened_at: "", agreed_at: "", paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Chiang Mai Wellness Botanicals" },
  { id: "deal-010", supplier_id: "sup-008", buyer_id: "buy-014", demand_id: null, status: "verifying", amount_usd: 88000, commission_rate: 0.040, commission_usd: 3520, notes: null, opened_at: "", agreed_at: null, paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Trang Tiger Prawn Hatchery" },
  { id: "deal-011", supplier_id: "sup-002", buyer_id: "buy-005", demand_id: "dem-001", status: "negotiating", amount_usd: 24000, commission_rate: 0.040, commission_usd: 960, notes: null, opened_at: "", agreed_at: null, paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Siam Premium Rice Cooperative" },
  { id: "deal-012", supplier_id: "sup-005", buyer_id: "buy-018", demand_id: "dem-002", status: "negotiating", amount_usd: 62000, commission_rate: 0.035, commission_usd: 2170, notes: null, opened_at: "", agreed_at: null, paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Lanna Silk Atelier" },
  { id: "deal-013", supplier_id: "sup-003", buyer_id: "buy-003", demand_id: "dem-003", status: "negotiating", amount_usd: 16000, commission_rate: 0.040, commission_usd: 640, notes: null, opened_at: "", agreed_at: null, paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Chiang Rai Tea Atelier" },
  { id: "deal-014", supplier_id: "sup-015", buyer_id: "buy-011", demand_id: "dem-007", status: "negotiating", amount_usd: 75000, commission_rate: 0.030, commission_usd: 2250, notes: null, opened_at: "", agreed_at: null, paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Nakhon Pathom Orchid Exporters" },
  { id: "deal-015", supplier_id: "sup-007", buyer_id: "buy-017", demand_id: null, status: "opened", amount_usd: 12000, commission_rate: 0.045, commission_usd: 540, notes: null, opened_at: "", agreed_at: null, paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Nan Highland Coffee Roasters" },
  { id: "deal-016", supplier_id: "sup-017", buyer_id: "buy-019", demand_id: null, status: "opened", amount_usd: 18000, commission_rate: 0.045, commission_usd: 810, notes: null, opened_at: "", agreed_at: null, paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Yasothon Indigo Cotton Studio" },
  { id: "deal-017", supplier_id: "sup-013", buyer_id: "buy-004", demand_id: null, status: "opened", amount_usd: 9500, commission_rate: 0.045, commission_usd: 427.5, notes: null, opened_at: "", agreed_at: null, paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Chiang Mai Wellness Botanicals" },
  { id: "deal-018", supplier_id: "sup-018", buyer_id: "buy-016", demand_id: null, status: "cancelled", amount_usd: 6000, commission_rate: 0.050, commission_usd: 0, notes: null, opened_at: "", agreed_at: null, paid_at: null, closed_at: null, cancelled_at: "", supplier_name: "Hua Hin Craft Brewery" },
  { id: "deal-019", supplier_id: "sup-014", buyer_id: "buy-012", demand_id: null, status: "disputed", amount_usd: 22000, commission_rate: 0.045, commission_usd: 990, notes: null, opened_at: "", agreed_at: "", paid_at: null, closed_at: null, cancelled_at: null, supplier_name: "Mae Hong Son Hemp Atelier" },
];

function fmt(usd: number) {
  return usd.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
function fmtTHB(usd: number) {
  return (usd * USD_THB).toLocaleString("th-TH", { maximumFractionDigits: 0 });
}

const STATUS_LABEL: Record<string, { th: string; color: string }> = {
  closed:      { th: "ปิดสำเร็จ",   color: "bg-emerald-100 text-emerald-800" },
  paid:        { th: "รับเงินแล้ว",  color: "bg-sky-100 text-sky-800" },
  agreed:      { th: "ตกลงแล้ว",    color: "bg-amber-100 text-amber-800" },
  verifying:   { th: "ตรวจสอบ",     color: "bg-violet-100 text-violet-800" },
  negotiating: { th: "กำลังต่อรอง", color: "bg-orange-100 text-orange-800" },
  opened:      { th: "เปิดดีล",     color: "bg-stone-100 text-stone-700" },
  cancelled:   { th: "ยกเลิก",      color: "bg-red-50 text-red-500" },
  disputed:    { th: "พิพาท",       color: "bg-red-100 text-red-700" },
};

function commissionIncluded(status: string) {
  return ["closed", "paid", "agreed", "verifying", "negotiating", "opened"].includes(status);
}
function isBooked(status: string) { return status === "closed"; }
function isNearBooked(status: string) { return ["paid", "agreed"].includes(status); }
function isPipeline(status: string) { return ["verifying", "negotiating", "opened"].includes(status); }

export default async function CommissionReportPage() {
  let deals: (Deal & { supplier_name?: string })[] = STATIC_DEALS;
  let isLive = false;

  if (isSupabaseConfigured()) {
    try {
      const [rawDeals, suppliers] = await Promise.all([listDeals(), listSuppliers()]);
      const supMap = Object.fromEntries(suppliers.map((s: Supplier) => [s.id, s.name]));
      deals = rawDeals.map((d: Deal) => ({ ...d, supplier_name: supMap[d.supplier_id] }));
      isLive = true;
    } catch {
      // fallback to static
    }
  }

  // ─── aggregate ───────────────────────────────────────────────────────────
  const booked    = deals.filter(d => isBooked(d.status));
  const nearBook  = deals.filter(d => isNearBooked(d.status));
  const pipeline  = deals.filter(d => isPipeline(d.status));
  const active    = deals.filter(d => commissionIncluded(d.status));

  const sum = (arr: typeof deals) => arr.reduce((a, d) => a + d.commission_usd, 0);
  const gmv = (arr: typeof deals) => arr.reduce((a, d) => a + d.amount_usd, 0);

  const bookedComm    = sum(booked);
  const nearBookComm  = sum(nearBook);
  const pipelineComm  = sum(pipeline);
  const totalComm     = bookedComm + nearBookComm + pipelineComm;

  // ─── tier breakdown ───────────────────────────────────────────────────────
  const tierStats = COMMISSION_TIERS.map(t => {
    const tierDeals = active.filter(d => {
      const rate = d.commission_rate;
      return Math.abs(rate - t.rate) < 0.001;
    });
    return {
      ...t,
      dealCount: tierDeals.length,
      gmvUSD: gmv(tierDeals),
      commUSD: sum(tierDeals),
    };
  }).filter(t => t.dealCount > 0);

  // ─── projection ──────────────────────────────────────────────────────────
  const { rows: projRows, totalGMV: proj36GMV, totalComm: proj36Comm, totalToniRS: proj36ToniRS } = buildProjection();
  const toniTotal36 = STAGE1_SERVICE + proj36ToniRS * USD_THB;
  const patrickROI = (proj36Comm * USD_THB) / 1300000; // vs ฿1.3M max invest

  const maxGMV = Math.max(...projRows.map(r => r.gmv));

  return (
    <main className="min-h-screen bg-cream">
      <div className="container-soft py-10 space-y-10">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/" className="text-sm text-ink-muted hover:text-ink">หน้าแรก</Link>
              <span className="text-ink-muted">/</span>
              <span className="text-sm text-ink">Commission Report</span>
            </div>
            <h1 className="text-2xl font-semibold text-ink">รายงาน Commission</h1>
            <p className="text-ink-muted text-sm mt-1">
              ภาพรวม commission จากดีลทั้งหมด · Projection 36 เดือน · Patrick ROI · Toni Earnings
            </p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${isLive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {isLive ? "🟢 Live Data" : "🟡 Demo Data"}
          </div>
        </div>

        {/* ── Commission Tier Table ─────────────────────────────────────── */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-lg">📊 ตาราง Commission Tier</h2>
          <p className="text-sm text-ink-muted">อัตรา commission แบ่งตาม Tier ของ Supplier — ยิ่ง Trust สูง ยิ่งได้ rate ต่ำ (เป็น reward)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-3 px-4 text-ink-muted font-medium">Tier</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium">ชื่อไทย</th>
                  <th className="text-right py-3 px-4 text-ink-muted font-medium">อัตรา Commission</th>
                  <th className="text-left py-3 px-4 text-ink-muted font-medium">เงื่อนไข</th>
                  <th className="text-right py-3 px-4 text-ink-muted font-medium">ดีลในระบบ</th>
                  <th className="text-right py-3 px-4 text-ink-muted font-medium">GMV (USD)</th>
                  <th className="text-right py-3 px-4 text-ink-muted font-medium">Commission (USD)</th>
                </tr>
              </thead>
              <tbody>
                {COMMISSION_TIERS.map((tier, i) => {
                  const stat = tierStats.find(t => Math.abs(t.rate - tier.rate) < 0.001);
                  return (
                    <tr key={i} className="border-b border-stone-50 hover:bg-sage-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`pill text-xs ${tier.badge_color}`}>{tier.label}</span>
                      </td>
                      <td className="py-3 px-4 text-ink-soft">{tier.label_th}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-ink">{formatRate(tier.rate)}</td>
                      <td className="py-3 px-4 text-ink-muted text-xs">
                        {i === 0 ? "Patrick รับรองส่วนตัว" :
                         i === 1 ? "Score ≥ 90" :
                         i === 2 ? "Score 75–89" :
                         i === 3 ? "Score 60–74" :
                         "Score < 60 / ใหม่"}
                      </td>
                      <td className="py-3 px-4 text-right text-ink">{stat?.dealCount ?? 0}</td>
                      <td className="py-3 px-4 text-right font-mono text-ink">${fmt(stat?.gmvUSD ?? 0)}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-sage-600">${fmt(stat?.commUSD ?? 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-sage-50/50">
                  <td colSpan={4} className="py-3 px-4 font-semibold text-ink">รวมทั้งหมด (ดีลที่ active)</td>
                  <td className="py-3 px-4 text-right font-semibold text-ink">{active.length}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-ink">${fmt(gmv(active))}</td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-sage-700">${fmt(totalComm)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ── Current Deal Commission Summary ──────────────────────────── */}
        <section className="space-y-4">
          <h2 className="font-semibold text-ink text-lg">💰 Commission ปัจจุบัน (จากดีลจริงในระบบ)</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Booked */}
            <div className="card p-5 border-l-4 border-emerald-400">
              <div className="text-xs text-ink-muted uppercase tracking-wide mb-2">ปิดสำเร็จ (Booked)</div>
              <div className="text-2xl font-semibold text-ink">${fmt(bookedComm)}</div>
              <div className="text-sm text-ink-muted mt-0.5">≈ ฿{fmtTHB(bookedComm)}</div>
              <div className="text-xs text-ink-muted mt-2">GMV ${fmt(gmv(booked))} · {booked.length} ดีล</div>
              <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                ✅ เงินอยู่ใน Platform แล้ว
              </div>
            </div>

            {/* Near-booked */}
            <div className="card p-5 border-l-4 border-amber-400">
              <div className="text-xs text-ink-muted uppercase tracking-wide mb-2">ใกล้ปิด (Paid + Agreed)</div>
              <div className="text-2xl font-semibold text-ink">${fmt(nearBookComm)}</div>
              <div className="text-sm text-ink-muted mt-0.5">≈ ฿{fmtTHB(nearBookComm)}</div>
              <div className="text-xs text-ink-muted mt-2">GMV ${fmt(gmv(nearBook))} · {nearBook.length} ดีล</div>
              <div className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
                ⏳ รอ 1-2 สัปดาห์
              </div>
            </div>

            {/* Pipeline */}
            <div className="card p-5 border-l-4 border-sky-400">
              <div className="text-xs text-ink-muted uppercase tracking-wide mb-2">Pipeline (กำลังดำเนินการ)</div>
              <div className="text-2xl font-semibold text-ink">${fmt(pipelineComm)}</div>
              <div className="text-sm text-ink-muted mt-0.5">≈ ฿{fmtTHB(pipelineComm)}</div>
              <div className="text-xs text-ink-muted mt-2">GMV ${fmt(gmv(pipeline))} · {pipeline.length} ดีล</div>
              <div className="mt-3 text-xs text-sky-700 bg-sky-50 rounded-lg px-3 py-2">
                📋 อยู่ระหว่างดำเนินการ
              </div>
            </div>
          </div>

          {/* Total bar */}
          <div className="card p-5 bg-sage-50/50">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-xs text-ink-muted uppercase tracking-wide mb-1">Commission รวมทั้งหมด (ศักยภาพ)</div>
                <div className="text-3xl font-semibold text-ink">${fmt(totalComm)}</div>
                <div className="text-base text-ink-muted">≈ ฿{fmtTHB(totalComm)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-ink-muted mb-1">GMV รวม</div>
                <div className="text-xl font-semibold text-ink">${fmt(gmv(active))}</div>
                <div className="text-sm text-ink-muted">≈ ฿{fmtTHB(gmv(active))}</div>
              </div>
            </div>
            <div className="mt-4 h-3 bg-stone-100 rounded-full overflow-hidden flex">
              <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(bookedComm / totalComm) * 100}%` }} />
              <div className="bg-amber-400 h-full transition-all" style={{ width: `${(nearBookComm / totalComm) * 100}%` }} />
              <div className="bg-sky-300 h-full transition-all" style={{ width: `${(pipelineComm / totalComm) * 100}%` }} />
            </div>
            <div className="flex gap-4 mt-2 text-xs text-ink-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />ปิดแล้ว</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />ใกล้ปิด</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-300 inline-block" />Pipeline</span>
            </div>
          </div>
        </section>

        {/* ── Deal Table ────────────────────────────────────────────────── */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold text-ink text-lg">📋 รายการดีลทั้งหมด</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-2 px-3 text-ink-muted font-medium">Deal ID</th>
                  <th className="text-left py-2 px-3 text-ink-muted font-medium">Supplier</th>
                  <th className="text-left py-2 px-3 text-ink-muted font-medium">Status</th>
                  <th className="text-right py-2 px-3 text-ink-muted font-medium">GMV (USD)</th>
                  <th className="text-right py-2 px-3 text-ink-muted font-medium">Rate</th>
                  <th className="text-right py-2 px-3 text-ink-muted font-medium">Commission (USD)</th>
                  <th className="text-right py-2 px-3 text-ink-muted font-medium">Commission (฿)</th>
                </tr>
              </thead>
              <tbody>
                {deals.filter(d => !["cancelled", "disputed"].includes(d.status)).map(d => {
                  const st = STATUS_LABEL[d.status];
                  return (
                    <tr key={d.id} className="border-b border-stone-50 hover:bg-sage-50/30 transition-colors">
                      <td className="py-2 px-3 font-mono text-xs text-ink-muted">
                        <Link href={`/deals/${d.id}`} className="hover:text-sage-600 transition-colors">{d.id}</Link>
                      </td>
                      <td className="py-2 px-3 text-ink text-xs">{d.supplier_name ?? d.supplier_id}</td>
                      <td className="py-2 px-3">
                        <span className={`pill text-xs ${st?.color ?? "bg-stone-100 text-stone-700"}`}>{st?.th ?? d.status}</span>
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-ink">${fmt(d.amount_usd)}</td>
                      <td className="py-2 px-3 text-right font-mono text-ink-soft">{formatRate(d.commission_rate)}</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-sage-600">${fmt(d.commission_usd)}</td>
                      <td className="py-2 px-3 text-right font-mono text-ink-soft">฿{fmtTHB(d.commission_usd)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink-muted">* ดีลที่ยกเลิก / พิพาท ไม่แสดงในตาราง</p>
        </section>

        {/* ── 36-Month Projection ───────────────────────────────────────── */}
        <section className="card p-6 space-y-6">
          <div>
            <h2 className="font-semibold text-ink text-lg">📈 Projection 36 เดือน</h2>
            <p className="text-sm text-ink-muted mt-1">
              สมมติ avg commission rate {formatRate(AVG_COMMISSION_RATE)} · USD/THB {USD_THB} · Toni RS {formatRate(TONI_RS_RATE)} ของ commission
            </p>
          </div>

          {/* Mini bar chart for GMV */}
          <div>
            <div className="text-xs text-ink-muted mb-2 uppercase tracking-wide">GMV รายเดือน (USD)</div>
            <div className="flex items-end gap-0.5 h-16">
              {projRows.map((r) => {
                const h = maxGMV > 0 ? (r.gmv / maxGMV) * 100 : 0;
                return (
                  <div
                    key={r.m}
                    className="flex-1 bg-sage-300 hover:bg-sage-500 rounded-t-sm transition-colors relative group"
                    style={{ height: `${Math.max(h, 2)}%` }}
                    title={`M${r.m}: $${fmt(r.gmv)}`}
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-ink text-cream text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      M{r.m}: ${fmt(r.gmv)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-ink-muted mt-1">
              <span>M1</span><span>M12</span><span>M24</span><span>M36</span>
            </div>
          </div>

          {/* Projection table — quarterly */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-2 px-3 text-ink-muted font-medium">เดือน</th>
                  <th className="text-right py-2 px-3 text-ink-muted font-medium">GMV/เดือน (USD)</th>
                  <th className="text-right py-2 px-3 text-ink-muted font-medium">Commission/เดือน</th>
                  <th className="text-right py-2 px-3 text-ink-muted font-medium">Commission สะสม</th>
                  <th className="text-right py-2 px-3 text-ink-muted font-medium">Toni RS/เดือน</th>
                  <th className="text-right py-2 px-3 text-ink-muted font-medium">Toni RS สะสม (฿)</th>
                </tr>
              </thead>
              <tbody>
                {projRows.map((r, i) => {
                  const isYearEnd = r.m === 12 || r.m === 24 || r.m === 36;
                  return (
                    <tr
                      key={r.m}
                      className={`border-b border-stone-50 ${isYearEnd ? "bg-sage-50/60 font-semibold" : "hover:bg-sage-50/20"} transition-colors`}
                    >
                      <td className="py-2 px-3 text-ink">
                        {isYearEnd ? `🎯 เดือน ${r.m} (ปีที่ ${r.m / 12})` : `เดือน ${r.m}`}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-ink">${fmt(r.gmv)}</td>
                      <td className="py-2 px-3 text-right font-mono text-sage-600">${fmt(r.comm)}</td>
                      <td className="py-2 px-3 text-right font-mono text-sage-700">${fmt(r.cumulativeCommissionUSD)}</td>
                      <td className="py-2 px-3 text-right font-mono text-amber-600">${fmt(r.toniRS)}</td>
                      <td className="py-2 px-3 text-right font-mono text-amber-700">฿{fmtTHB(r.cumulativeToniRS_USD)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-ink text-cream">
                  <td className="py-3 px-3 font-semibold">รวม 36 เดือน</td>
                  <td className="py-3 px-3 text-right font-mono">${fmt(proj36GMV)}</td>
                  <td className="py-3 px-3 text-right font-mono text-sage-200">${fmt(proj36Comm)}</td>
                  <td className="py-3 px-3 text-right font-mono text-sage-200">${fmt(proj36Comm)}</td>
                  <td className="py-3 px-3 text-right font-mono text-amber-300">${fmt(proj36ToniRS)}</td>
                  <td className="py-3 px-3 text-right font-mono text-amber-300">฿{fmtTHB(proj36ToniRS)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* ── Patrick ROI + Toni Earnings ──────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patrick ROI */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-ink text-lg">👑 Patrick — ROI Simulation</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span className="text-sm text-ink-muted">เงินลงทุน Stage 1 (max)</span>
                <span className="font-semibold text-ink">฿1,300,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span className="text-sm text-ink-muted">Commission Platform รวม 36 เดือน</span>
                <span className="font-semibold text-sage-600">฿{fmtTHB(proj36Comm)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span className="text-sm text-ink-muted">Patrick net (หลังหัก Toni RS 3%)</span>
                <span className="font-semibold text-sage-700">฿{fmtTHB(proj36Comm * 0.97)}</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-800">ROI (36 เดือน)</span>
                  <span className="text-2xl font-bold text-emerald-700">{(patrickROI * 0.97).toFixed(0)}×</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-emerald-600">Payback period (โดยประมาณ)</span>
                  <span className="text-sm font-semibold text-emerald-700">~เดือน 8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-emerald-600">+ Equity 88% (ถ้า Toni ถือ 12%)</span>
                  <span className="text-xs text-emerald-600">ไม่รวมในตัวเลขนี้</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-ink-muted">* สมมติ GMV ตาม conservative ramp scenario · ตัวเลขจริงขึ้นอยู่กับ deal volume</p>
          </div>

          {/* Toni Earnings */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-ink text-lg">🧑‍💻 Toni — Earnings Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <div>
                  <div className="text-sm font-medium text-ink">Stage 1 Service Fee</div>
                  <div className="text-xs text-ink-muted">3 milestone · 2 เดือน</div>
                </div>
                <span className="font-semibold text-ink">฿600,000</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <div>
                  <div className="text-sm font-medium text-ink">Revenue Share (RS)</div>
                  <div className="text-xs text-ink-muted">3% × commission รวม 36 เดือน</div>
                </div>
                <span className="font-semibold text-amber-600">฿{fmtTHB(proj36ToniRS)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <div>
                  <div className="text-sm font-medium text-ink">Tail Right (ถ้า trigger)</div>
                  <div className="text-xs text-ink-muted">1% × commission เดือน 37-60 (conditional)</div>
                </div>
                <span className="text-sm text-ink-muted">TBD</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <div>
                  <div className="text-sm font-medium text-ink">Equity 12%</div>
                  <div className="text-xs text-ink-muted">4yr/1yr cliff · มูลค่าขึ้นกับ valuation</div>
                </div>
                <span className="text-sm text-ink-muted">Exit-based</span>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-amber-800">รายรับสะสม (Service + RS)</span>
                  <span className="text-2xl font-bold text-amber-700">฿{(toniTotal36).toLocaleString("th-TH", { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-amber-600">ต่อเดือน (เฉลี่ย Month 3-36)</span>
                  <span className="text-sm font-semibold text-amber-700">฿{((toniTotal36 - STAGE1_SERVICE) / 33).toLocaleString("th-TH", { maximumFractionDigits: 0 })}/เดือน</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-amber-600">Month 36 RS เดือนนั้นอย่างเดียว</span>
                  <span className="text-sm font-semibold text-amber-700">
                    ฿{(MONTHLY_GMV_USD[36] * AVG_COMMISSION_RATE * TONI_RS_RATE * USD_THB).toLocaleString("th-TH", { maximumFractionDigits: 0 })}/เดือน
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-ink-muted">* ไม่รวม Stage 2 salary ฿180K/mo (contract แยก) · ไม่รวม equity exit value</p>
          </div>
        </section>

        {/* ── Bottom CTA ────────────────────────────────────────────────── */}
        <div className="flex gap-3 flex-wrap">
          <Link href="/deals" className="btn-primary">ดูดีลทั้งหมด →</Link>
          <Link href="/browse" className="btn-secondary">ค้นหา Supplier →</Link>
        </div>
      </div>
    </main>
  );
}
