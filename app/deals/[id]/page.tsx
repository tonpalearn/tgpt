import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/brand/Header";
import { DemoBadge } from "@/components/brand/DemoBadge";
import { getDeal, getSupplier } from "@/lib/mock-data.server";
import { cn, formatUSD } from "@/lib/utils";

const STATUS_FLOW: Array<{ key: string; label: string; th: string }> = [
  { key: "opened", label: "Opened", th: "เปิด" },
  { key: "negotiating", label: "Negotiating", th: "เจรจา" },
  { key: "agreed", label: "Agreed", th: "ตกลง" },
  { key: "verifying", label: "Verifying", th: "ตรวจสอบ" },
  { key: "paid", label: "Paid", th: "ชำระ" },
  { key: "closed", label: "Closed", th: "ปิด" },
];

export default async function DealRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deal = getDeal(id);
  if (!deal) notFound();
  const supplier = getSupplier(deal.supplierId);

  const currentIdx = STATUS_FLOW.findIndex((s) => s.key === deal.status);

  return (
    <>
      <DemoBadge />
      <Header />

      <main className="border-t border-parchment-300 max-w-[1480px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        {/* Header strip */}
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-10">
          <div>
            <Link href={supplier ? `/suppliers/${supplier.id}` : "/"} className="text-[0.65rem] uppercase tracking-[0.22em] font-mono text-ink-muted hover:text-emerald-deep transition-colors">
              ← {supplier?.businessName ?? "Catalogue"}
            </Link>
            <h1 className="font-display text-display-lg text-ink mt-2 leading-tight" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
              Deal Room <span className="text-ink-muted">/ {deal.id}</span>
            </h1>
          </div>
          <div className="text-right">
            <div className="eyebrow mb-1">Deal value</div>
            <div className="figure-num font-display text-4xl text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 30" }}>
              {formatUSD(deal.amount)}
            </div>
          </div>
        </div>

        {/* Status pipeline — Roman numeral steps echo Protocol */}
        <div className="border border-parchment-300 bg-parchment-50 p-6 lg:p-8 mb-10">
          <div className="eyebrow mb-5">Pipeline status</div>
          <ol className="grid grid-cols-2 lg:grid-cols-6 gap-px bg-parchment-300">
            {STATUS_FLOW.map((s, i) => {
              const isActive = i === currentIdx;
              const isPast = i < currentIdx;
              return (
                <li
                  key={s.key}
                  className={cn(
                    "p-4 transition-colors duration-300",
                    isActive ? "bg-emerald-deep text-amber-soft" : isPast ? "bg-emerald-deep/15 text-emerald-deep" : "bg-parchment-50 text-ink-muted"
                  )}
                >
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    {isActive && <span className="w-1.5 h-1.5 bg-amber-warm rounded-full animate-pulse" />}
                    {isPast && <span className="text-xs">✓</span>}
                  </div>
                  <div className="font-display text-base" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>{s.label}</div>
                  <div className="text-[0.6rem] uppercase tracking-[0.18em] mt-1 opacity-70 font-mono">{s.th}</div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Left — chat thread mock */}
          <div>
            <div className="eyebrow mb-4">Deal-room thread (mock)</div>
            <div className="space-y-4">
              <Message
                from="buyer"
                name={deal.buyerName}
                country={deal.buyerCountry}
                time="08:42"
                text="Confirmed: 50 tonnes premium Monthong, FOB Laem Chabang, monthly Apr–Jul. Need GAP + GlobalG.A.P. cert pack for compliance review."
              />
              <Message
                from="supplier"
                name={supplier?.businessName ?? ""}
                country="TH"
                time="09:15"
                text="ยืนยันได้ครับ ส่ง cert pack ภายใน 24 ชม. ทั้ง GAP และ GlobalG.A.P. valid ถึง 2027 (Q1). ราคา USD 4.80/kg FOB ตามที่คุยไว้ครับ"
              />
              <Message
                from="platform"
                name="ThailandGPT · Verifier"
                country="TH"
                time="11:02"
                text="Field verification dispatched. Expected confirmation < 48h. Cold-chain capacity flagged at 84% (peak Apr–Aug) — recommend confirming logistics slot now."
              />
              <Message
                from="buyer"
                name={deal.buyerName}
                country={deal.buyerCountry}
                time="14:38"
                text="Logistics slot via partner forwarder confirmed. Awaiting field verification before LC issuance."
              />
            </div>

            <div className="mt-6 border border-parchment-300 p-3 flex items-center gap-3 text-xs text-ink-muted">
              <span className="font-mono uppercase tracking-wider text-ink-muted shrink-0">»</span>
              <span className="italic">Demo thread — no real messages are sent.</span>
            </div>
          </div>

          {/* Right — sidebar */}
          <aside className="space-y-6">
            <div className="border border-ink/85 bg-parchment-50 p-6">
              <div className="eyebrow mb-3">Counterparty</div>
              <div className="font-display text-xl text-ink mb-1" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
                {deal.buyerName}
              </div>
              <div className="text-xs text-ink-muted font-mono mb-5">{deal.buyerCountry} · KYC mock</div>

              <div className="space-y-3 text-sm">
                <Row k="Product" v={deal.productDescription} />
                <Row k="Currency" v={deal.currency} />
                <Row k="Created" v={deal.createdAt} />
                <Row k="Sign-off" v={deal.patrickSignOff ? "Patrick (high-value)" : "Not required"} />
              </div>
            </div>

            <div className="border border-amber-warm bg-amber-warm/10 p-6">
              <div className="eyebrow mb-3 text-amber-deep">Patrick&apos;s desk</div>
              <p className="text-sm text-ink leading-relaxed">
                {deal.patrickSignOff
                  ? "This deal exceeds the high-value threshold. Patrick&apos;s sign-off will be requested before payment release."
                  : "This deal sits below the high-value threshold. Standard close — no Patrick sign-off required."}
              </p>
            </div>

            <div className="text-xs text-ink-muted leading-relaxed">
              No real escrow, KYC, or payment is wired in Stage 0. Each pipeline stage is a UI demonstration of the closed-loop transaction architecture planned for Stage 2 MVP.
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-parchment-300 pb-2 last:border-b-0">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-muted shrink-0">{k}</span>
      <span className="text-right text-ink">{v}</span>
    </div>
  );
}

function Message({
  from,
  name,
  country,
  time,
  text,
}: {
  from: "buyer" | "supplier" | "platform";
  name: string;
  country: string;
  time: string;
  text: string;
}) {
  const tone = {
    buyer: { dot: "bg-amber-warm", label: "Buyer", color: "text-amber-deep", border: "border-amber-warm/40" },
    supplier: { dot: "bg-emerald-deep", label: "Supplier", color: "text-emerald-deep", border: "border-emerald-deep/30" },
    platform: { dot: "bg-ink", label: "Platform", color: "text-ink", border: "border-ink/30" },
  }[from];

  return (
    <article className={cn("border bg-parchment-50/70 p-5", tone.border)}>
      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className={cn("w-2 h-2 rounded-full", tone.dot)} />
          <span className={cn("font-mono text-[0.65rem] uppercase tracking-[0.2em]", tone.color)}>
            {tone.label}
          </span>
          <span className="font-display text-base text-ink" style={{ fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1" }}>
            {name}
          </span>
          <span className="text-[0.65rem] font-mono text-ink-muted">· {country}</span>
        </div>
        <span className="font-mono text-xs text-ink-muted">{time}</span>
      </div>
      <p className="text-base leading-relaxed text-ink-soft">{text}</p>
    </article>
  );
}
