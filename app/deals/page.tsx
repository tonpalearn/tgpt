import Link from "next/link";
import { Header } from "@/components/v2/Header";
import { Footer } from "@/components/v2/Footer";
import { listDeals, listSuppliers, listBuyers } from "@/lib/db/queries";
import type { DealStatus } from "@/lib/db/types";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<DealStatus, { th: string; pill: string }> = {
  opened:      { th: "เพิ่งเปิด",        pill: "pill-cream" },
  negotiating: { th: "กำลังต่อรอง",      pill: "pill-clay" },
  agreed:      { th: "ตกลงแล้ว",        pill: "pill-sky" },
  verifying:   { th: "กำลังตรวจสอบ",     pill: "pill-clay" },
  paid:        { th: "ชำระเงินแล้ว",     pill: "pill-sage" },
  closed:      { th: "✓ สำเร็จ",         pill: "pill-sage" },
  cancelled:   { th: "ยกเลิก",          pill: "pill-stone" },
  disputed:    { th: "⚠ มีข้อพิพาท",     pill: "pill-clay" },
};

const STATUS_ORDER: DealStatus[] = [
  "negotiating", "agreed", "verifying", "paid", "opened", "closed", "disputed", "cancelled",
];

export default async function DealsPage() {
  let deals: Awaited<ReturnType<typeof listDeals>> = [];
  let suppliers: Awaited<ReturnType<typeof listSuppliers>> = [];
  let buyers: Awaited<ReturnType<typeof listBuyers>> = [];
  try {
    [deals, suppliers, buyers] = await Promise.all([listDeals(), listSuppliers(), listBuyers()]);
  } catch { /* graceful */ }

  const supById = new Map(suppliers.map((s) => [s.id, s]));
  const buyById = new Map(buyers.map((b) => [b.id, b]));

  const grouped = STATUS_ORDER
    .map((status) => ({ status, items: deals.filter((d) => d.status === status) }))
    .filter((g) => g.items.length > 0);

  const totalCommission = deals
    .filter((d) => d.status === "closed" || d.status === "paid")
    .reduce((sum, d) => sum + d.commission_usd, 0);

  return (
    <>
      <Header />
      <main className="pb-24">
        <section className="mesh-warm">
          <div className="container-soft pt-12 pb-10">
            <div className="section-eyebrow">🤝 ดีลทั้งหมด</div>
            <h1 className="text-title font-semibold text-ink">ดีลในระบบ</h1>
            <p className="mt-2 text-base text-ink-soft max-w-2xl">
              {deals.length} ดีล — รวมค่าธรรมเนียมที่บันทึกได้ <span className="font-semibold text-sage-700">${totalCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </p>
          </div>
        </section>

        <div className="container-soft mt-8 space-y-10">
          {grouped.map(({ status, items }) => (
            <section key={status}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold text-ink">{STATUS_LABEL[status].th}</h2>
                <span className="pill-stone">{items.length}</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((d) => {
                  const sup = supById.get(d.supplier_id);
                  const buy = buyById.get(d.buyer_id);
                  return (
                    <Link key={d.id} href={`/deals/${d.id}`} className="card card-hover block">
                      <div className="flex items-center justify-between mb-3">
                        <span className={STATUS_LABEL[d.status].pill}>{STATUS_LABEL[d.status].th}</span>
                        <span className="font-mono text-xs text-ink-muted">{d.id}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-ink-muted w-12">ซัพ:</span>
                          <span className="font-medium text-ink truncate">{sup?.name_th ?? sup?.name ?? d.supplier_id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-ink-muted w-12">ผู้ซื้อ:</span>
                          <span className="font-medium text-ink truncate">{buy?.name ?? d.buyer_id}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-stone-100 flex items-end justify-between">
                        <div>
                          <div className="text-xs text-ink-muted">มูลค่า</div>
                          <div className="text-lg font-semibold text-ink">${d.amount_usd.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-ink-muted">ค่าธรรมเนียม</div>
                          <div className="text-base font-semibold text-sage-700">${d.commission_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
