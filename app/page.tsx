import Link from "next/link";
import { Header } from "@/components/v2/Header";
import { Footer } from "@/components/v2/Footer";
import { SupplierCard } from "@/components/v2/SupplierCard";
import { listSuppliers, listDeals, isSupabaseConfigured } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const configured = isSupabaseConfigured();
  let suppliers: Awaited<ReturnType<typeof listSuppliers>> = [];
  let dealCount = 0;
  let buyerCountries = 0;
  let supplierCount = 0;

  if (configured) {
    try {
      suppliers = await listSuppliers();
      const deals = await listDeals();
      dealCount = deals.length;
      supplierCount = suppliers.length;
      buyerCountries = new Set(deals.map((d) => d.buyer_id)).size;
    } catch {
      // gracefully degrade
    }
  }

  const featured = suppliers.filter((s) => s.patrick_circle).slice(0, 3);
  const trending = suppliers.filter((s) => !s.patrick_circle).slice(0, 6);

  return (
    <>
      <Header />
      <main className="pb-24">
        {/* Hero */}
        <section className="mesh-warm">
          <div className="container-soft pt-16 pb-20 lg:pt-24 lg:pb-28">
            <div className="max-w-3xl">
              <span className="pill-sage mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-500 animate-soft-pulse" />
                ยินดีต้อนรับ — เวอร์ชันใหม่ ใช้งานง่ายกว่าเดิม
              </span>
              <h1 className="text-hero font-semibold text-ink text-balance leading-tight mt-2">
                เชื่อม <span className="text-sage-600">ความต้องการระดับโลก</span><br />
                กับซัพพลายไทย<wbr /> ที่ <span className="text-clay-500">ตรวจสอบแล้ว</span>
              </h1>
              <p className="mt-6 text-lg lg:text-xl text-ink-soft text-pretty max-w-2xl leading-relaxed">
                แพลตฟอร์มที่ช่วยให้ผู้ซื้อต่างชาติเจอซัพพลายไทยที่เชื่อถือได้ — ตรวจสอบโดย Patrick&apos;s Network เอง ไม่ใช่แค่ AI
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/browse" className="btn-primary">
                  เริ่มค้นหาซัพพลาย
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h9m0 0L8 4M12 8l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Link>
                <Link href="/demands" className="btn-secondary">
                  ดูความต้องการของผู้ซื้อ
                </Link>
              </div>
            </div>

            {/* Stats row */}
            {configured && (
              <div className="mt-16 grid grid-cols-3 gap-3 max-w-2xl">
                <Stat num={supplierCount.toString().padStart(2, "0")} label="ซัพพลายที่ตรวจสอบ" />
                <Stat num={dealCount.toString().padStart(2, "0")} label="ดีลในระบบ" />
                <Stat num={buyerCountries.toString().padStart(2, "0")} label="ผู้ซื้อทั่วโลก" />
              </div>
            )}
          </div>
        </section>

        {/* Setup hint if Supabase missing */}
        {!configured && (
          <section className="container-soft -mt-10">
            <div className="card border-clay-200 bg-clay-50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚙️</span>
                <div className="flex-1">
                  <div className="font-semibold text-ink mb-1">ยังไม่ได้เชื่อม Supabase</div>
                  <p className="text-sm text-ink-soft mb-3">
                    เพิ่ม <code className="px-1.5 py-0.5 bg-white rounded text-xs">NEXT_PUBLIC_SUPABASE_URL</code> และ{" "}
                    <code className="px-1.5 py-0.5 bg-white rounded text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ใน{" "}
                    <code className="px-1.5 py-0.5 bg-white rounded text-xs">.env.local</code> แล้วรัน SQL ใน{" "}
                    <code className="px-1.5 py-0.5 bg-white rounded text-xs">supabase/migrations/0001_init.sql</code> + <code className="px-1.5 py-0.5 bg-white rounded text-xs">seed.sql</code>
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* How it works — 3 simple steps */}
        <section className="container-soft mt-20">
          <div className="text-center mb-12">
            <div className="section-eyebrow">3 ขั้นตอนง่ายๆ</div>
            <h2 className="text-title font-semibold text-ink">ใช้งานยังไง</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { num: "1", icon: "🔍", title: "ค้นหา", body: "บอกเราว่าต้องการอะไร — เราจะแนะนำซัพพลายที่ตรงที่สุด" },
              { num: "2", icon: "✓", title: "ตรวจสอบ", body: "ดูคะแนนผลงาน, รีวิว, ใบรับรอง — ทุกอย่างโปร่งใส" },
              { num: "3", icon: "🤝", title: "เชื่อมต่อ", body: "เปิดดีลในแพลตฟอร์ม คุยกับซัพพลายโดยตรง" },
            ].map((step) => (
              <div key={step.num} className="card text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-sage-100 flex items-center justify-center text-3xl mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-semibold text-sage-600 mb-1">ขั้นที่ {step.num}</div>
                <div className="text-lg font-semibold text-ink mb-2">{step.title}</div>
                <p className="text-sm text-ink-soft leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured (Patrick's Circle) */}
        {featured.length > 0 && (
          <section className="container-soft mt-20">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="section-eyebrow">⭐ วงในของ Patrick</div>
                <h2 className="text-title font-semibold text-ink">ซัพพลายที่ Patrick รับรองเอง</h2>
              </div>
              <Link href="/browse?circle=1" className="text-sm text-sage-600 hover:text-sage-700">
                ดูทั้งหมด →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((s) => <SupplierCard key={s.id} supplier={s} />)}
            </div>
          </section>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <section className="container-soft mt-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="section-eyebrow">📈 กำลังเป็นที่นิยม</div>
                <h2 className="text-title font-semibold text-ink">ซัพพลายอื่นๆ ที่น่าสนใจ</h2>
              </div>
              <Link href="/browse" className="text-sm text-sage-600 hover:text-sage-700">
                ดูทั้งหมด →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trending.map((s) => <SupplierCard key={s.id} supplier={s} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="card-soft text-center py-5">
      <div className="stat-num">{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
