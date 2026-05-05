import Link from "next/link";
import { Header } from "@/components/v2/Header";
import { Footer } from "@/components/v2/Footer";
import { listDemands, listBuyers } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

const CAT_LABEL_TH: Record<string, string> = {
  agriculture: "เกษตร",
  craft: "งานหัตถกรรม",
  manufacturing: "การผลิต",
  seafood: "อาหารทะเล",
  textile: "สิ่งทอ",
  beverage: "เครื่องดื่ม",
  wellness: "สุขภาพ",
};

export default async function DemandsPage() {
  let demands: Awaited<ReturnType<typeof listDemands>> = [];
  let buyersById: Map<string, Awaited<ReturnType<typeof listBuyers>>[number]> = new Map();
  try {
    demands = await listDemands({ status: "open" });
    const buyers = await listBuyers();
    buyersById = new Map(buyers.map((b) => [b.id, b]));
  } catch {
    /* graceful degrade */
  }

  return (
    <>
      <Header />
      <main className="pb-24">
        <section className="mesh-warm">
          <div className="container-soft pt-12 pb-10">
            <div className="section-eyebrow">📋 Demand Board</div>
            <h1 className="text-title font-semibold text-ink">ผู้ซื้อกำลังหาอะไรอยู่</h1>
            <p className="mt-2 text-base text-ink-soft max-w-2xl">
              {demands.length} ความต้องการที่เปิดอยู่ — จากผู้ซื้อทั่วโลกที่ตรวจสอบแล้ว
            </p>
          </div>
        </section>

        <div className="container-soft mt-8 grid md:grid-cols-2 gap-4">
          {demands.map((d) => {
            const buyer = buyersById.get(d.buyer_id);
            return (
              <div key={d.id} className="card card-hover">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="pill-cream">{CAT_LABEL_TH[d.category] ?? d.category}</span>
                    <h3 className="text-lg font-semibold text-ink mt-2">{d.title}</h3>
                  </div>
                  {d.budget_usd_max && (
                    <div className="text-right">
                      <div className="text-xs text-ink-muted">งบประมาณ</div>
                      <div className="font-semibold text-sage-700">
                        ${d.budget_usd_min?.toLocaleString()}–${d.budget_usd_max.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
                {d.quantity_text && (
                  <div className="text-sm text-ink-soft mb-2">📦 {d.quantity_text}</div>
                )}
                {d.description && (
                  <p className="text-sm text-ink-soft mb-4 leading-relaxed">{d.description}</p>
                )}

                {buyer && (
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <Link href={`/buyers/${buyer.id}`} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-2xl bg-clay-100 flex items-center justify-center text-base">
                        {buyer.country_code ? flag(buyer.country_code) : "🌍"}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-ink group-hover:text-sage-700 transition-colors">
                          {buyer.name}
                        </div>
                        <div className="text-xs text-ink-muted">{buyer.country} · {buyer.size}</div>
                      </div>
                    </Link>
                    {buyer.verified && <span className="verified-tick">✓</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}

function flag(code: string) {
  // Convert ISO country code to flag emoji
  const upper = code.toUpperCase();
  if (upper.length !== 2) return "🌍";
  return String.fromCodePoint(...upper.split("").map((c) => 0x1f1a5 + c.charCodeAt(0)));
}
