import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-plex-thai",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ThailandGPT — Local Verify, Global Confidence",
  description:
    "The National Execution Layer for verified Thai supply. Connecting global demand to verified Thai capability through human-verified intelligence.",
  metadataBase: new URL("https://tgpt-demo.vercel.app"),
  openGraph: {
    title: "ThailandGPT — Local Verify, Global Confidence",
    description:
      "Mock prototype demonstrating the National Execution Layer concept. Stage 0 internal demo.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} ${plexThai.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
