import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/v2/Header";
import { Footer } from "@/components/v2/Footer";
import { getSupplier, listDeals } from "@/lib/db/queries";
import { getCommissionTier, formatRate } from "@/lib/commission";

export const dynamic = "force-dynamic";

const CAT_EMOJI: Record<string, string> = {
  agriculture: "🌾", craft: "🎨", manufacturing: "🏭", seafood: "🐟",
  textile: "🧵", beverage: "🍵", wellness: "🌿",
};

export default async function SupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supplier = await getSupplier(id).catch(() => null);
  if (!supplier) notFound();

  const allDeals = await listDeals().catch(() => []);
  const supplierDeals = allDeals.filter((d) => d.supplier_id === id);
  const commission = getCommissionTier(supplier);

  return (
    <>
      <Header />
      <main className="pb-24">
        {/* Hero */}
        <section className="bg-white border-b border-stone-100">
          <div className="container-soft py-10 lg:py-14">
            <Link href="/browse" className="text-sm text-ink-muted hover:text-sage-600 inline-flex items-center gap-1 mb-6">
              ← กลับไปยังรายการ
            </Link>
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div className="w-20 h-20 rounded-3xl bg-cream-200 flex items-center justify-center text-5xl shrink-0">
                {CAT_EMOJI[supplier.category]}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="pill-cream">{supplier.region}</span>
                  {supplier.patrick_circle && <span className="pill-sage">⭐ วงในของ Patrick</span>}
                  {supplier.verified && (
                    <span className="pill-sage">
                      <span className="verified-tick !w-4 !h-4">✓</span> ตรวจสอบแล้ว
                    </span>
                  )}
                </div>
                <h1 className="text-title font-semibold text-ink leading-tight">
                  {supplier.name_th ?? supplier.name}
                </h1>
                {supplier.name_th && supplier.name && (
                  <div className="text-base text-ink-muted mt-1">{supplier.name}</div>
                )}
                <p className="mt-4 text-base text-ink-soft leading-relaxed max-w-3xl">
                  {supplier.description_th ?? supplier.description}
                </p>
              </div>
              <div className="md:w-64 shrink-0">
                <div className="card-soft text-center">
                  <div className="text-xs text-ink-muted mb-1">ค่าธรรมเนียมแพลตฟอร์ม</div>
                  <div className="text-3xl font-semibold text-sage-700">{formatRate(commission.rate)}</div>
                  <span className={`pill mt-2 ${commission.badge_color}`}>{commission.label_th}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4-signal trust grid */}
        <section className="container-soft mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Signal title="Tier" value={supplier.tier} sub={supplier.patrick_circle ? "Patrick's Circle" : undefined} />
            <Signal title="ผลงาน" value={`${supplier.performance_score}`} sub="คะแนน / 100" />
            <Signal title="รีวิว" value={supplier.review_avg.toFixed(1)} sub={`${supplier.review_count} รีวิว`} />
            <Signal title="ประสบการณ์" value={`${supplier.past_deals_count}`} sub={`ดีลที่ผ่านมา`} />
          </div>
        </section>

        {/* Tags + Certs */}
        <section className="container-soft mt-8 grid md:grid-cols-2 gap-4">
          <div className="card">
            <div className="section-eyebrow">ใบรับรอง</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {supplier.certifications.length === 0 && <span className="text-sm text-ink-muted">—</span>}
              {supplier.certifications.map((c) => (
                <span key={c} className="pill-sky">{c}</span>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="section-eyebrow">แท็ก</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {supplier.tags.map((t) => (
                <span key={t} className="pill-stone">#{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Past deals */}
        {supplierDeals.length > 0 && (
          <section className="container-soft mt-8">
            <div className="card">
              <h2 className="text-lg font-semibold text-ink mb-4">ดีลที่ผ่านมา ({supplierDeals.length})</h2>
              <div className="divide-y divide-stone-100">
                {supplierDeals.map((d) => (
                  <Link key={d.id} href={`/deals/${d.id}`} className="flex items-center justify-between py-3 hover:bg-cream-50 -mx-2 px-2 rounded-lg transition-colors">
                    <div>
                      <div className="font-mono text-xs text-ink-muted">{d.id}</div>
                      <div className="text-sm font-medium text-ink mt-0.5">{d.notes ?? "—"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-ink">${d.amount_usd.toLocaleString()}</div>
                      <div className="text-xs text-ink-muted">{d.status}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Action */}
        <section className="container-soft mt-8">
          <div className="card-soft text-center">
            <p className="text-sm text-ink-soft mb-4">สนใจซัพพลายรายนี้?</p>
            <button className="btn-primary">เปิดดีลใหม่ →</button>
            <p className="text-xs text-ink-muted mt-3">Demo only — ฟังก์ชันเปิดดีลจะเปิดให้ใช้งานใน Phase C</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Signal({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="card text-center">
      <div className="text-xs text-ink-muted uppercase tracking-wider">{title}</div>
      <div className="text-2xl font-semibold text-ink mt-1">{value}</div>
      {sub && <div className="text-xs text-ink-muted mt-1">{sub}</div>}
    </div>
  );
}
