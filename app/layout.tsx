import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-plex-thai",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ThailandGPT — เชื่อมโลกกับซัพพลายไทยที่ตรวจสอบแล้ว",
  description:
    "Connection Gateway Platform — global demand meets verified Thai supply, simply.",
  metadataBase: new URL("https://tgpt-demo.vercel.app"),
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={plexThai.variable}>
      <body>{children}</body>
    </html>
  );
}
