import type { Config } from "tailwindcss";

/**
 * v.2 — Soft, rounded, friendly Thai design system
 * Palette: warm cream + soft sage + warm clay + ink
 * Typography: IBM Plex Sans Thai (single friendly font)
 * Shapes: rounded-2xl/3xl/full
 *
 * v.1 (editorial Thai luxury) preserved in /frontend-v1/
 */
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm cream base (background scale)
        cream: {
          DEFAULT: "#FBF7F0",
          50: "#FEFCF8",
          100: "#FBF7F0",
          200: "#F4ECDD",
          300: "#E8DCC2",
          400: "#D4C29F",
        },
        // Soft sage (primary accent — friendly green)
        sage: {
          DEFAULT: "#7B9E89",
          50: "#F1F5F2",
          100: "#DCE8E0",
          200: "#B8D0C0",
          300: "#94B8A0",
          400: "#7B9E89",
          500: "#5E8470",
          600: "#476859",
          700: "#344D43",
        },
        // Warm clay (secondary accent — soft warmth)
        clay: {
          DEFAULT: "#C8896B",
          50: "#FBF1EC",
          100: "#F5DDD0",
          200: "#EBC0A8",
          300: "#DCA384",
          400: "#C8896B",
          500: "#AC6F53",
          600: "#8A5841",
        },
        // Soft stone (muted text + borders)
        stone: {
          DEFAULT: "#A89F94",
          50: "#F5F2EE",
          100: "#E8E3DC",
          200: "#D2C9BD",
          300: "#B8AC9B",
          400: "#A89F94",
          500: "#867D71",
          600: "#665E54",
        },
        // Deep ink (text)
        ink: {
          DEFAULT: "#3D3833",
          soft: "#5E5650",
          muted: "#867D71",
        },
        // Subtle warning + success
        sky: {
          soft: "#D9EAF1",
          DEFAULT: "#7BA9BD",
          deep: "#4D7E92",
        },
      },
      fontFamily: {
        // Single friendly font for everything (Thai + Latin)
        sans: ["var(--font-plex-thai)", "system-ui", "sans-serif"],
        thai: ["var(--font-plex-thai)", "system-ui"],
        // Reserved for occasional display use
        display: ["var(--font-plex-thai)", "system-ui"],
      },
      fontSize: {
        // Friendly scale — bigger and more readable
        "hero": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "title": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.25", letterSpacing: "-0.005em" }],
        "section": ["clamp(1.5rem, 2.5vw, 2rem)", { lineHeight: "1.3" }],
      },
      borderRadius: {
        // Generous rounding throughout
        "soft": "1rem",
        "softer": "1.5rem",
        "softest": "2rem",
      },
      boxShadow: {
        // Subtle, never harsh
        "soft": "0 1px 2px rgba(61, 56, 51, 0.04), 0 4px 12px rgba(61, 56, 51, 0.04)",
        "softer": "0 2px 4px rgba(61, 56, 51, 0.05), 0 8px 24px rgba(61, 56, 51, 0.06)",
        "lifted": "0 10px 30px rgba(61, 56, 51, 0.08), 0 4px 8px rgba(61, 56, 51, 0.04)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
        "soft-pulse": "soft-pulse 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
