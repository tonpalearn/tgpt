import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial Thai Luxury palette
        parchment: {
          DEFAULT: "#F5EFE5",
          50: "#FBF8F3",
          100: "#F5EFE5",
          200: "#EDE3D2",
          300: "#D8CFBE",
          400: "#B8AE99",
        },
        ink: {
          DEFAULT: "#1A1612",
          soft: "#3A322A",
          muted: "#7A7264",
        },
        emerald: {
          deep: "#0F3D2E",
          base: "#1B5942",
          glow: "#2D8462",
        },
        amber: {
          warm: "#C8932E",
          deep: "#9C6E1A",
          soft: "#E5BD6A",
        },
        terracotta: "#A04E2C",
        // Semantic aliases
        bg: "var(--bg)",
        surface: "var(--surface)",
        fg: "var(--fg)",
        border: "var(--border)",
        accent: "var(--accent)",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-instrument)", "var(--font-plex-thai)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        thai: ["var(--font-plex-thai)", "var(--font-instrument)", "system-ui"],
      },
      fontSize: {
        // Editorial display scale
        "display-2xl": ["clamp(3.5rem, 9vw, 7.5rem)", { lineHeight: "0.92", letterSpacing: "-0.04em" }],
        "display-xl": ["clamp(2.75rem, 6vw, 5.25rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(2rem, 4.5vw, 3.75rem)", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.625rem, 3vw, 2.5rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        editorial: "-0.025em",
        wide: "0.04em",
        wider: "0.12em",
        widest: "0.22em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "drift": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(2%, -3%, 0) scale(1.05)" },
        },
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 1.4s ease-out both",
        "shimmer": "shimmer 8s linear infinite",
        "drift-slow": "drift 22s ease-in-out infinite",
        "drift-slower": "drift 38s ease-in-out infinite",
        "ticker": "ticker 60s linear infinite",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.10 0 0 0 0 0.08 0 0 0 0 0.07 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
export default config;
