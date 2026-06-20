import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F8F6F0",
        champagne: "#F8F6F0",
        gold: "#D4AF37",
        charcoal: "#1a1a1a"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"]
      },
      boxShadow: {
        luxury: "0 24px 80px rgba(26, 26, 26, 0.12)",
        glow: "0 0 80px rgba(212, 175, 55, 0.22)"
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
