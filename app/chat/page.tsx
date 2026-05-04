import { Header } from "@/components/brand/Header";
import { DemoBadge } from "@/components/brand/DemoBadge";
import { Terminal } from "@/components/chat/Terminal";
import { SUPPLIERS } from "@/lib/mock-data.server";

const SAMPLE_QUERIES = [
  "I need 50 tonnes of premium Monthong durian, export-grade for Dubai, monthly Apr–Jul.",
  "Sourcing organic GI Surin Hom Mali rice — 120 tonnes for a Singapore premium grocer, halal-certified preferred.",
  "Looking for handwoven Lanna silk supplier for 800 metres of bespoke interior fabric for a GCC luxury hotel project.",
  "Single-origin Thai oolong tea, 180 kg, hospitality grade, for a London tea house — what's available?",
  "I want certified halal mango from Thailand, 40 tonnes, for UAE distribution.",
];

export default function ChatPage() {
  return (
    <>
      <DemoBadge />
      <Header />
      <main className="border-t border-parchment-300">
        <Terminal suppliers={SUPPLIERS} sampleQueries={SAMPLE_QUERIES} />
      </main>
    </>
  );
}
