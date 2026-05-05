import { Header } from "@/components/v2/Header";
import { Footer } from "@/components/v2/Footer";
import { SupplierCard } from "@/components/v2/SupplierCard";
import { listSuppliers } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  let suppliers: Awaited<ReturnType<typeof listSuppliers>> = [];
  let error: string | null = null;
  try {
    suppliers = await listSuppliers();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <>
      <Header />
      <main className="pb-24">
        <section className="mesh-warm">
          <div className="container-soft pt-12 pb-10">
            <div className="section-eyebrow">ค้นหาซัพพลาย</div>
            <h1 className="text-title font-semibold text-ink">
              ซัพพลายไทยที่ตรวจสอบแล้ว
            </h1>
            <p className="mt-2 text-base text-ink-soft max-w-2xl">
              {suppliers.length} ราย — เรียงตามคะแนนผลงาน. ทุกรายตรวจสอบโดย Patrick&apos;s Network
            </p>
          </div>
        </section>

        <div className="container-soft mt-8">
          {error && (
            <div className="card border-clay-200 bg-clay-50 mb-6">
              <div className="font-semibold text-ink mb-1">ไม่สามารถโหลดข้อมูลได้</div>
              <p className="text-sm text-ink-soft">{error}</p>
            </div>
          )}

          {suppliers.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suppliers.map((s) => <SupplierCard key={s.id} supplier={s} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
