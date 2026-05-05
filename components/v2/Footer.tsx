export function Footer() {
  return (
    <footer className="border-t border-stone-100 bg-white mt-24">
      <div className="container-soft py-12">
        <div className="grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-sage-500 flex items-center justify-center text-white font-semibold">T</div>
              <div className="font-semibold text-ink">ThailandGPT</div>
            </div>
            <p className="text-ink-muted leading-relaxed">
              เชื่อมความต้องการระดับโลกกับซัพพลายไทยที่ตรวจสอบแล้ว — โปร่งใส เชื่อถือได้
            </p>
          </div>
          <div>
            <div className="font-medium text-ink mb-3">ผลิตภัณฑ์</div>
            <ul className="space-y-2 text-ink-soft">
              <li><a href="/browse" className="hover:text-sage-600">ค้นหาซัพพลาย</a></li>
              <li><a href="/demands" className="hover:text-sage-600">ดู Demand</a></li>
              <li><a href="/deals" className="hover:text-sage-600">ดีล</a></li>
              <li><a href="/dashboard" className="hover:text-sage-600">รายงาน</a></li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-ink mb-3">สำหรับ Patrick</div>
            <ul className="space-y-2 text-ink-soft">
              <li><a href="/present" className="hover:text-sage-600">Stage 0 Review Deck</a></li>
              <li><a href="#" className="hover:text-sage-600">Demo script</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
          <span>© Mock prototype · Stage 0.5 · No real PII / no real transactions</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
            v2.0 — soft design
          </span>
        </div>
      </div>
    </footer>
  );
}
