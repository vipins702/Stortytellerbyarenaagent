export const premiumColorSystems = {
  arcticChrome: {
    name: "Arctic Chrome",
    palette: {
      base: "#06080F",
      surface: "#0A0D1A",
      accent: { primary: "#00D4FF", primaryGlow: "rgba(0, 212, 255, 0.3)", secondary: "#7B61FF", tertiary: "#00FFB2" },
      text: { primary: "#E8F4FF", secondary: "#7A9BB5" },
      gradient: { hero: "linear-gradient(135deg, #00D4FF 0%, #7B61FF 50%, #00FFB2 100%)" }
    }
  },
  obsidianGold: {
    name: "Obsidian Gold",
    palette: { base: "#0A0800", surface: "#0F0C00", accent: { primary: "#D4A853", primaryGlow: "rgba(212, 168, 83, 0.3)", secondary: "#C9A96E", tertiary: "#8B7355" }, text: { primary: "#F5F0E8", secondary: "#A89880" }, gradient: { hero: "linear-gradient(135deg, #D4A853 0%, #C9A96E 50%, #8B7355 100%)" } }
  },
  emberDark: {
    name: "Ember Dark",
    palette: { base: "#080500", surface: "#100A00", accent: { primary: "#FF4D00", primaryGlow: "rgba(255, 77, 0, 0.35)", secondary: "#FF9500", tertiary: "#FFD600" }, text: { primary: "#FFF8F0", secondary: "#A08060" }, gradient: { hero: "linear-gradient(135deg, #FF4D00 0%, #FF9500 50%, #FFD600 100%)" } }
  },
  roseNoir: {
    name: "Rose Noir",
    palette: { base: "#080408", surface: "#100810", accent: { primary: "#E879A0", primaryGlow: "rgba(232, 121, 160, 0.3)", secondary: "#C084FC", tertiary: "#FB923C" }, text: { primary: "#FDF0F8", secondary: "#9D7090" }, gradient: { hero: "linear-gradient(135deg, #E879A0 0%, #C084FC 50%, #FB923C 100%)" } }
  },
  malachite: {
    name: "Malachite",
    palette: { base: "#020A04", surface: "#040F06", accent: { primary: "#00C170", primaryGlow: "rgba(0, 193, 112, 0.3)", secondary: "#00FFB2", tertiary: "#7FD4A1" }, text: { primary: "#F0FFF5", secondary: "#6A9A7A" }, gradient: { hero: "linear-gradient(135deg, #00C170 0%, #00FFB2 50%, #7FD4A1 100%)" } }
  }
} as const;

export const defaultPremiumTheme = {
  preset: "arcticChrome",
  colorSystem: {
    base: "#05050A",
    surface: "#0D0D14",
    surfaceElevated: "#12121C",
    border: "rgba(139, 92, 246, 0.15)",
    borderStrong: "rgba(139, 92, 246, 0.4)",
    accent: {
      primary: "#8B5CF6",
      primaryGlow: "rgba(139, 92, 246, 0.35)",
      secondary: "#22D3EE",
      secondaryGlow: "rgba(34, 211, 238, 0.25)",
      tertiary: "#F59E0B",
      gradient: {
        hero: "linear-gradient(135deg, #8B5CF6 0%, #22D3EE 50%, #F59E0B 100%)",
        card: "linear-gradient(145deg, rgba(139,92,246,0.15) 0%, rgba(34,211,238,0.05) 100%)",
        text: "linear-gradient(90deg, #8B5CF6, #22D3EE)",
        mesh: "radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.2) 0%, transparent 50%)"
      }
    },
    text: { primary: "#F8FAFC", secondary: "#94A3B8", muted: "#475569", inverse: "#05050A" },
    semantic: { success: "#10B981", warning: "#F59E0B", error: "#EF4444" }
  },
  typography: {
    fonts: {
      display: { family: "Inter Tight", weights: [400, 500, 600, 700, 900] },
      heading: { family: "Inter Tight", weights: [400, 500, 700, 900] },
      body: { family: "Inter", weights: [300, 400, 500] },
      mono: { family: "JetBrains Mono", weights: [400, 500] }
    },
    scale: { xs: "0.75rem", sm: "0.875rem", base: "1rem", lg: "1.125rem", xl: "1.25rem", "2xl": "1.5rem", "3xl": "1.875rem", "4xl": "2.25rem", "5xl": "3rem", "6xl": "3.75rem", "7xl": "4.5rem", "8xl": "6rem", "9xl": "8rem" },
    tracking: { eyebrow: "0.2em", tight: "-0.03em", hero: "-0.05em" },
    leading: { display: "0.95", heading: "1.1", body: "1.7" }
  },
  depth: {
    shadows: {
      "glow-sm": "0 0 20px rgba(139, 92, 246, 0.3)",
      "glow-md": "0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(139, 92, 246, 0.15)",
      "glow-lg": "0 0 60px rgba(139, 92, 246, 0.5), 0 0 120px rgba(34, 211, 238, 0.2)",
      card: "0 25px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(139,92,246,0.1)",
      float: "0 50px 100px rgba(0,0,0,0.7), 0 0 40px rgba(139,92,246,0.2)",
      inset: "inset 0 1px 0 rgba(255,255,255,0.05)"
    },
    blur: { glass: "blur(20px) saturate(180%)", heavy: "blur(40px)", subtle: "blur(8px)" }
  },
  motion: {
    easing: { luxury: "cubic-bezier(0.19, 1, 0.22, 1)", spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", cinematic: "cubic-bezier(0.76, 0, 0.24, 1)", smooth: "cubic-bezier(0.4, 0, 0.2, 1)" },
    duration: { instant: "100ms", fast: "200ms", normal: "400ms", slow: "700ms", cinematic: "1200ms", epic: "2000ms" },
    reducedMotion: true
  },
  spacing: { sectionGap: "160px", sectionGapMobile: "80px", containerMax: "1440px", containerPadding: "clamp(1.5rem, 5vw, 6rem)" },
  threeD: { perspective: "1000px", cardTiltMax: "15deg", floatAmplitude: "20px", particleCount: 80, noiseIntensity: 0.4 }
} as const;

export const defaultAnimationContract = {
  preset: "luxury-reveal",
  entrance: { type: "fade-up", duration: 800, delay: 0, stagger: 100, easing: "luxury", threshold: 0.1, once: true },
  scroll: { type: "parallax", intensity: 0.35, start: "top bottom", end: "bottom top", scrubSmoothing: 1.2 },
  hover: { type: "glow", tiltMax: 12, glowColor: "#8B5CF6", magneticStrength: 0.3, transitionDuration: 300 },
  background: { type: "mesh-shift", fps: 60, interactive: true },
  textFx: { type: "gradient-reveal", splitBy: "words", staggerMs: 40 }
} as const;

export const defaultPageMetadata = {
  page: { title: "Apex — Premium Product Experience", description: "A cinematic product page built with ScrollStoryTeller.", favicon: "", ogImage: "", themeColor: "#05050A" },
  globalFx: { customCursor: { enabled: true, style: "circle", blendMode: "difference", trailEnabled: true, magneticElements: ["button", "a", ".magnetic"] }, pageTransition: { type: "fade", color: "#8B5CF6", duration: 800 }, smoothScroll: { enabled: true, library: "native", lerp: 0.08 }, noiseOverlay: { enabled: true, opacity: 0.04, animated: true }, loadingScreen: { enabled: false, style: "minimal", duration: 1200, exitAnimation: "fade" } },
  accessibility: { reducedMotion: true, focusRing: "#8B5CF6", skipLink: true, ariaLabels: true },
  performance: { lazyLoad: true, imageFormat: "webp", prefetch: true, criticalCSS: true }
} as const;
