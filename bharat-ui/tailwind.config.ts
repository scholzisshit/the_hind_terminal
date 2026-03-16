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
        abyss: "#0A0A0A",
        panel: "#0D0F14",
        border: "#1A1D26",
        cyan: {
          DEFAULT: "#4DD2D2",
          dim: "#279898",
          muted: "#134D4D",
        },
        saffron: {
          DEFAULT: "#F2A65A",
          dim: "#B27131",
          muted: "#593818",
        },
        emerald: {
          DEFAULT: "#4DE6A1",
          dim: "#27B273",
          muted: "#135939",
        },
        crimson: {
          DEFAULT: "#F25C75",
          dim: "#B23A4E",
          muted: "#591D27",
        },
        gold: {
          DEFAULT: "#F2D14D",
          dim: "#B29527",
          muted: "#594A13",
        },
        violet: {
          DEFAULT: "#9A73E6",
          dim: "#6B49B2",
          muted: "#352459",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-pattern": "40px 40px",
      },
      animation: {
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan-line 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "ticker": "ticker 20s linear infinite",
      },
      keyframes: {
        "pulse-ring": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.15)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0,255,255,0.3)" },
          "100%": { boxShadow: "0 0 20px rgba(0,255,255,0.7), 0 0 40px rgba(0,255,255,0.3)" },
        },
        ticker: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
