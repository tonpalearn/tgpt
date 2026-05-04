import { Header } from "@/components/brand/Header";
import { DemoBadge } from "@/components/brand/DemoBadge";
import { Hero } from "@/components/landing/Hero";
import { Pillars } from "@/components/landing/Pillars";
import { Protocol } from "@/components/landing/Protocol";
import { Cascading } from "@/components/landing/Cascading";
import { Network } from "@/components/landing/Network";
import { Roadmap } from "@/components/landing/Roadmap";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <>
      <DemoBadge />
      <Header />
      <main>
        <Hero />
        <Pillars />
        <Protocol />
        <Cascading />
        <Network />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}
