"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type PremiumTheme = any;

export function getTheme(theme?: PremiumTheme) {
  const colorSystem = theme?.colorSystem || theme?.palette || {};
  return {
    base: colorSystem.base || "#05050A",
    surface: colorSystem.surface || "#0D0D14",
    surfaceElevated: colorSystem.surfaceElevated || "#12121C",
    border: colorSystem.border || "rgba(139, 92, 246, 0.16)",
    borderStrong: colorSystem.borderStrong || "rgba(139, 92, 246, 0.42)",
    accent: {
      primary: colorSystem.accent?.primary || "#8B5CF6",
      primaryGlow: colorSystem.accent?.primaryGlow || "rgba(139, 92, 246, 0.35)",
      secondary: colorSystem.accent?.secondary || "#22D3EE",
      secondaryGlow: colorSystem.accent?.secondaryGlow || "rgba(34, 211, 238, 0.24)",
      tertiary: colorSystem.accent?.tertiary || "#F59E0B",
      gradient: colorSystem.accent?.gradient || colorSystem.gradient || {}
    },
    text: {
      primary: colorSystem.text?.primary || "#F8FAFC",
      secondary: colorSystem.text?.secondary || "#94A3B8",
      muted: colorSystem.text?.muted || "#64748B",
      inverse: colorSystem.text?.inverse || "#05050A"
    },
    typography: theme?.typography || {},
    spacing: theme?.spacing || {}
  };
}

export function SectionHeader({ eyebrow, title, body, align = "center", theme, className = "" }: { eyebrow?: string; title?: string; body?: string; align?: "left" | "center"; theme?: PremiumTheme; className?: string }) {
  const c = getTheme(theme);
  return <div className={`${align === "center" ? "text-center" : "text-left"} ${className}`}>
    {eyebrow && <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55 }} className="text-xs font-black uppercase tracking-[.22em]" style={{ color: c.accent.primary }}>{eyebrow}</motion.p>}
    {title && <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .75, delay: .08, ease: [0.19, 1, 0.22, 1] }} className={`mt-4 text-5xl font-black leading-[.95] tracking-[-.07em] md:text-7xl ${align === "center" ? "mx-auto max-w-4xl" : "max-w-4xl"}`} style={{ color: c.text.primary }}>{title}</motion.h2>}
    {body && <p className={`mt-5 text-lg leading-8 ${align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}`} style={{ color: c.text.secondary }}>{body}</p>}
  </div>;
}

export function PremiumButton({ label = "Get started", variant = "primary", theme }: { label?: string; variant?: "primary" | "ghost"; theme?: PremiumTheme }) {
  const c = getTheme(theme);
  const [hovered, setHovered] = useState(false);
  const style = variant === "primary"
    ? { background: `linear-gradient(135deg, ${c.accent.primary}, ${c.accent.secondary})`, color: "white", boxShadow: hovered ? `0 14px 45px ${c.accent.primaryGlow}` : `0 8px 28px ${c.accent.primaryGlow}` }
    : { background: "rgba(255,255,255,.06)", color: c.text.primary, border: `1px solid ${c.borderStrong}`, boxShadow: hovered ? `0 0 28px ${c.accent.primaryGlow}` : "none" };
  return <button onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="rounded-full px-6 py-3 text-sm font-black transition-transform duration-300 hover:-translate-y-0.5" style={style}>{label}</button>;
}

export function BackgroundFxLayer({ fx, theme }: { fx?: any; theme?: PremiumTheme }) {
  const c = getTheme(theme);
  const type = fx?.type || "mesh-gradient";
  if (type === "none") return null;
  return <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-[12%] top-[8%] h-[520px] w-[520px] rounded-full blur-3xl" style={{ background: c.accent.primaryGlow, opacity: fx?.intensity ?? .65 }} />
    <div className="absolute -right-[8%] top-[22%] h-[460px] w-[460px] rounded-full blur-3xl" style={{ background: c.accent.secondaryGlow, opacity: .75 }} />
    <div className="absolute bottom-[-20%] left-[35%] h-[520px] w-[520px] rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${c.accent.tertiary}33, transparent 65%)` }} />
    {type === "grid" && <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(${c.border} 1px, transparent 1px), linear-gradient(90deg, ${c.border} 1px, transparent 1px)`, backgroundSize: "48px 48px" }} />}
  </div>;
}

export function NoiseOverlay({ opacity = .035 }: { opacity?: number }) {
  return <div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ opacity, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />;
}

export function CountUpNumber({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const numeric = Number(String(value).replace(/[^0-9.]/g, "")) || 0;
  const prefix = String(value).match(/^[^0-9]*/)?.[0] || "";
  const suffix = String(value).replace(/^[^0-9]*/, "").replace(/[0-9.,]/g, "");
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const frames = 80;
    const id = window.setInterval(() => {
      frame += 1;
      const ease = 1 - Math.pow(1 - frame / frames, 3);
      setDisplay(Math.round(numeric * ease * 10) / 10);
      if (frame >= frames) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [inView, numeric]);
  return <span ref={ref} className={className}>{prefix}{display.toLocaleString()}{suffix}</span>;
}

export function AvatarStack({ avatars = [] }: { avatars?: string[] }) {
  const list = avatars.length ? avatars : ["", "", "", ""];
  return <div className="flex">{list.slice(0, 5).map((avatar, i) => <div key={i} className="h-9 w-9 rounded-full border-2 border-[#05050A]" style={{ marginLeft: i ? -10 : 0, background: avatar ? `url(${avatar}) center/cover` : `linear-gradient(135deg, hsl(${i * 55 + 220} 80% 60%), hsl(${i * 55 + 185} 80% 55%))`, zIndex: list.length - i }} />)}</div>;
}
