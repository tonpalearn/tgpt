// Slide deck data for /present route — same content as STAGE-0-REVIEW-DECK.md
// Each slide has a kind that drives the layout component.

export type SlideKind =
  | "cover"
  | "agenda"
  | "ask"
  | "mission"
  | "problem"
  | "pillars"
  | "cascading"
  | "what-built"
  | "journey-buyer"
  | "journey-supplier"
  | "journey-patrick"
  | "roadmap"
  | "budget"
  | "timeline"
  | "resource"
  | "risks"
  | "opportunities"
  | "asks"
  | "questions"
  | "closing";

export interface Slide {
  kind: SlideKind;
  section?: string;
  title: string;
  subtitle?: string;
}

export const SLIDES: Slide[] = [
  { kind: "cover", title: "Stage 0 Demo Review", subtitle: "Internal review · 1-on-1 · 30 min + Q&A" },
  { kind: "agenda", section: "Section 00", title: "Agenda · 30 นาที" },
  { kind: "ask", section: "Section 00", title: "ทำไมผมเรียกประชุมวันนี้" },
  { kind: "mission", section: "Section 01", title: "Mission Recap — ขอ confirm" },
  { kind: "problem", section: "Section 01", title: "ปัญหาเชิงโครงสร้างที่เราแก้" },
  { kind: "pillars", section: "Section 01", title: "Five Pillars (Protocol = Moat)" },
  { kind: "cascading", section: "Section 01", title: "Strategic Layer — Cascading Demand" },
  { kind: "what-built", section: "Section 02", title: "สิ่งที่ผมทำใน Stage 0" },
  { kind: "journey-buyer", section: "Section 03", title: "User Journey — Buyer (International HNW)" },
  { kind: "journey-supplier", section: "Section 03", title: "User Journey — Supplier (Thai)" },
  { kind: "journey-patrick", section: "Section 03", title: "User Journey — Patrick's Touchpoints" },
  { kind: "roadmap", section: "Section 04", title: "4-Stage Roadmap" },
  { kind: "budget", section: "Section 04", title: "Budget Breakdown" },
  { kind: "timeline", section: "Section 04", title: "Timeline + Critical Path" },
  { kind: "resource", section: "Section 05", title: "Resource — Toni's vs Patrick's Plate" },
  { kind: "risks", section: "Section 05", title: "Top 5 Risks (จาก Panel A)" },
  { kind: "opportunities", section: "Section 05", title: "Strategic Opportunities (จาก Panel B)" },
  { kind: "asks", section: "Section 06", title: "สิ่งที่ผมต้องการจากพี่" },
  { kind: "questions", section: "Section 07", title: "5 คำถามปิดท้าย" },
  { kind: "closing", section: "End", title: "ขอบคุณครับ" },
];
