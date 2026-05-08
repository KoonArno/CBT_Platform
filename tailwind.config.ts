import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F9FC",
        screen: "#FFFFFF",
        ink: {
          DEFAULT: "#1A2340",
          muted: "#6B7A9A",
          faint: "#9BABC4",
        },
        rule: "#C0CAD8",
        brand: {
          DEFAULT: "#3B75E8",
          dark: "#1C3FAA",
          tint: "#EEF4FF",
          tab: "#C8DCFC",
        },
        accent: {
          orange: "#E8923A",
          yellow: "#F5C840",
          purple: "#7c3aed",
          teal: "#0891b2",
        },
        state: {
          good: "#16a34a",
          goodBg: "#f0fdf4",
          warn: "#d97706",
          warnBg: "#fffbeb",
          bad: "#dc2626",
          badBg: "#fef2f2",
          orangeBg: "#fff7ed",
          purpleBg: "#f5f3ff",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px rgba(26,35,64,0.08)",
        cardHover: "0 6px 28px rgba(26,35,64,0.14)",
        sidebar: "2px 0 14px rgba(26,35,64,0.05)",
      },
      borderRadius: {
        card: "14px",
      },
      letterSpacing: {
        eyebrow: "0.07em",
      },
    },
  },
  plugins: [],
};

export default config;
