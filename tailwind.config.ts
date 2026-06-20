import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#05050A",
        champagne: "#0B0B12",
        gold: "#8B5CF6",
        cyan: "#22D3EE",
        violet: "#8B5CF6",
        charcoal: "#F8FAFC",
        ink: "#05050A",
        panel: "#0D0D15"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-inter)", "Inter", "Geist", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        luxury: "0 28px 100px rgba(0, 0, 0, 0.42)",
        glow: "0 0 70px rgba(139, 92, 246, 0.34), 0 0 120px rgba(34, 211, 238, 0.12)"
      },
      keyframes: {
        shimmer: { "0%": { transform: "translateX(-100%)" }, "100%": { transform: "translateX(100%)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } }
      },
      animation: {
        shimmer: "shimmer 2.8s infinite",
        float: "float 6s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
export default config;
