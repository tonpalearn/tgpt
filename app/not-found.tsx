import Link from "next/link";
import { Header } from "@/components/brand/Header";
import { DemoBadge } from "@/components/brand/DemoBadge";

export default function NotFound() {
  return (
    <>
      <DemoBadge />
      <Header />
      <main className="border-t border-parchment-300 max-w-[1480px] mx-auto px-6 lg:px-12 py-32 lg:py-48 text-center">
        <div className="eyebrow mb-6 justify-center">Section ∅ / Empty</div>
        <h1 className="font-display text-display-2xl text-ink leading-[0.92]" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
          The page <em className="not-italic text-emerald-deep">does not exist</em>.
        </h1>
        <p className="mt-8 text-lg text-ink-soft max-w-xl mx-auto">
          The terminal could not match this route to a verified surface. Return home, or open the catalogue.
        </p>
        <div className="mt-12 flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary">Return home</Link>
          <Link href="/chat" className="btn-ghost">Open the terminal</Link>
        </div>
      </main>
    </>
  );
}
