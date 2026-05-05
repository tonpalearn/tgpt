import Link from "next/link";
import { Header } from "@/components/v2/Header";
import { Footer } from "@/components/v2/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-soft py-24 text-center">
        <div className="text-7xl mb-6">🌾</div>
        <h1 className="text-title font-semibold text-ink">ไม่พบหน้านี้</h1>
        <p className="mt-3 text-base text-ink-soft max-w-md mx-auto">
          หน้าที่คุณกำลังหาอาจถูกย้ายหรือไม่มีอยู่ ลองกลับไปหน้าหลักดู
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">กลับหน้าหลัก</Link>
          <Link href="/browse" className="btn-secondary">ค้นหาซัพพลาย</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
