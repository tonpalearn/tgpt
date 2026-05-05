import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/v2/Header";
import { Footer } from "@/components/v2/Footer";
import { getDeal, getDealEvents, getSupplier, getBuyer } from "@/lib/db/queries";
import { formatRate } from "@/lib/commission";
import type { DealStatus } from "@/lib/db/types";

export const dynamic = "force-dynamic";

const STATUS_STEPS: { key: DealStatus; th: string }[] = [
  { key: "opened",      th: "เปิดดีล" },
  { key: "negotiating", th: "ต่อรอง" },
  { key: "agreed",      th: "ตกลง" },
  { key: "verifying",   th: "ตรวจสอบ" },
  { key: "paid",        th: "ชำระเงิน" },
  { key: "closed",      th: "สำเร็จ" },
];

function stepIndex(status: DealStatus): number {
  const i = STATUS_STEPS.findIndex((s) => s.key === status);
  return i >= 0 ? i : 0;
}

const ACTOR_STYLE: Record<string, string> = {
  buyer:    "bg-clay-100 text-clay-600",
  supplier: "bg-sage-100 text-sage-700",
  platform: "bg-stone-100 text-stone-600",
  patrick:  "bg-sky-soft text-sky-deep",
};

const ACTOR_LABEL: Record<string, string> = {
  buyer: "ผู้ซื้อ", supplier: "ซัพพลาย", platform: "ระบบ", patrick: "Patrick",
};

export default async function DealRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = await getDeal(id).catch(() => null);
  if (!deal) notFound();

  const [events, supplier, buyer] = await Promise.all([
    getDealEvents(deal.id).catch(() => []),
    getSupplier(deal.supplier_id).catch(() => null),
    getBuyer(deal.buyer_id).catch(() => null),
  ]);

  const currentStep = stepIndex(deal.status);
  const isCancelled = deal.status === "cancelled";
  const isDisputed = deal.status === "disputed";

  return (
    <>
      <Header />
      <main className="pb-24">
        <section className="bg-white border-b border-stone-100">
          <div className="container-soft py-8">
            <Link href="/deals" className="text-sm text-ink-muted hover:text-sage-600 inline-flex items-center gap-1 mb-4">
              ← กลับไปยังรายการดีล
            </Link>
            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="font-mono text-sm text-ink-muted">{deal.id}</span>
              {isCancelled && <span className="pill-stone">ยกเลิกแล้ว</span>}
              {isDisputed && <span className="pill-clay">⚠ มีข้อพิพาท</span>}
            </div>
            <h1 className="text-title font-semibold text-ink">{deal.notes ?? "Deal Room"}</h1>
            <div className="mt-3 flex flex-wrap gap-6 text-sm text-ink-soft">
              <div><span className="text-ink-muted">มูลค่า:</span> <span className="font-semibold text-ink">${deal.amount_usd.toLocaleString()}</span></div>
              <div><span className="text-ink-muted">ค่าธรรมเนียม:</span> <span className="font-semibold text-sage-700">${deal.commission_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })} ({formatRate(deal.commission_rate)})</span></div>
              <div><span className="text-ink-muted">เริ่ม:</span> {new Date(deal.opened_at).toLocaleDateString("th-TH")}</div>
            </div>
          </div>
        </section>

        {/* Pipeline */}
        {!isCancelled && (
          <section className="container-soft mt-8">
            <div className="card">
              <div className="section-eyebrow mb-4">สถานะดีล</div>
              <div className="grid grid-cols-6 gap-2">
                {STATUS_STEPS.map((step, i) => {
                  const done = i < currentStep;
                  const active = i === currentStep && !isDisputed;
                  return (
                    <div key={step.key} className="text-center">
                      <div className={`relative h-2 rounded-full mb-2 ${
                        done ? "bg-sage-500" : active ? "bg-clay-400" : "bg-stone-100"
                      }`}>
                        {active && <div className="absolute inset-0 rounded-full bg-clay-400 animate-soft-pulse" />}
                      </div>
                      <div className={`text-xs ${active ? "font-semibold text-clay-600" : done ? "text-sage-700" : "text-ink-muted"}`}>
                        {step.th}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Two-column: timeline + sidebar */}
        <section className="container-soft mt-6 grid lg:grid-cols-3 gap-4">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-lg font-semibold text-ink mb-4">ไทม์ไลน์ ({events.length})</h2>
              {events.length === 0 ? (
                <p className="text-sm text-ink-muted">ยังไม่มีกิจกรรม</p>
              ) : (
                <div className="space-y-4">
                  {events.map((ev) => (
                    <div key={ev.id} className="flex gap-3">
                      <div className={`shrink-0 w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-semibold ${ACTOR_STYLE[ev.actor] ?? "bg-stone-100"}`}>
                        {ACTOR_LABEL[ev.actor]?.[0] ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 text-xs text-ink-muted mb-0.5">
                          <span className="font-medium text-ink-soft">{ACTOR_LABEL[ev.actor] ?? ev.actor}</span>
                          <span>·</span>
                          <span>{ev.event_type}</span>
                          <span>·</span>
                          <span>{new Date(ev.occurred_at).toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" })}</span>
                        </div>
                        {ev.message && (
                          <div className="text-sm text-ink leading-relaxed bg-cream-50 rounded-soft px-3 py-2 inline-block max-w-full">
                            {ev.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — counterparties */}
          <aside className="space-y-4">
            {supplier && (
              <Link href={`/suppliers/${supplier.id}`} className="card card-hover block">
                <div className="section-eyebrow">ซัพพลาย</div>
                <div className="font-semibold text-ink mt-1">{supplier.name_th ?? supplier.name}</div>
                <div className="text-xs text-ink-muted mt-1">{supplier.region}</div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {supplier.patrick_circle && <span className="pill-sage">⭐ Patrick</span>}
                  {supplier.verified && <span className="pill-sage">✓ ตรวจสอบ</span>}
                </div>
              </Link>
            )}
            {buyer && (
              <div className="card">
                <div className="section-eyebrow">ผู้ซื้อ</div>
                <div className="font-semibold text-ink mt-1">{buyer.name}</div>
                <div className="text-xs text-ink-muted mt-1">{buyer.country} · {buyer.industry}</div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {buyer.verified && <span className="pill-sage">✓ ตรวจสอบ</span>}
                  <span className="pill-stone">{buyer.size}</span>
                </div>
              </div>
            )}

            <div className="card-soft text-center text-xs text-ink-muted">
              ฟังก์ชันส่งข้อความ + เปลี่ยนสถานะ จะเปิดให้ใช้งานใน Phase C
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
