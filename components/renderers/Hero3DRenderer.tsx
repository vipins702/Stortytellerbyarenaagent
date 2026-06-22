"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";
import { AvatarStack, BackgroundFxLayer, getTheme, NoiseOverlay, PremiumButton } from "@/components/renderers/shared/PremiumPrimitives";

export function Hero3DRenderer({ props = {}, animation, theme }: { props: any; animation?: any; theme?: any }) {
  const c = getTheme(theme);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 22 });
  const sy = useSpring(my, { stiffness: 80, damping: 22 });
  const rotateY = useTransform(sx, [-1, 1], [-10, 10]);
  const rotateX = useTransform(sy, [-1, 1], [8, -8]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      mx.set((e.clientX / window.innerWidth - .5) * 2);
      my.set((e.clientY / window.innerHeight - .5) * 2);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const scene = props.scene || { type: props.sceneType || "particles" };
  const badge = props.badge || { text: "Now available", icon: "sparkle" };
  const cta = props.cta || { primary: props.primaryCta || "Get access", secondary: props.secondaryCta || "Watch demo" };
  const socialProof = props.socialProof || { count: "2,400+", label: "brands launched", avatars: [] };

  return <section className="relative grid min-h-screen items-center overflow-hidden px-6 py-24 lg:grid-cols-[1fr_.95fr] lg:px-[clamp(2rem,5vw,6rem)]" style={{ background: c.base, color: c.text.primary }}>
    <BackgroundFxLayer fx={props.backgroundFx || { type: "mesh-gradient", intensity: .7 }} theme={theme} />
    <NoiseOverlay opacity={0.045} />
    <motion.div className="relative z-10 max-w-4xl" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}>
      {badge && <motion.div initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .6, delay: .1 }} className="mb-8 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-xl" style={{ borderColor: c.borderStrong, background: c.accent.primaryGlow }}><span>✦</span><span className="text-xs font-black uppercase tracking-[.18em]" style={{ color: c.accent.primary }}>{badge.text}</span><span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: c.accent.primary }} /></motion.div>}
      {props.eyebrow && <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }} className="mb-4 text-xs font-black uppercase tracking-[.22em]" style={{ color: c.accent.primary }}>{props.eyebrow}</motion.p>}
      <h1 className="text-6xl font-black leading-[.88] tracking-[-.08em] md:text-8xl xl:text-9xl">
        {props.title || "The Apex"} {props.titleHighlight && <span style={{ background: c.accent.gradient?.text || `linear-gradient(90deg, ${c.accent.primary}, ${c.accent.secondary})`, WebkitBackgroundClip: "text", color: "transparent" }}>{props.titleHighlight}</span>}
      </h1>
      {props.subtitle && <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .55 }} className="mt-7 max-w-2xl text-xl font-medium leading-9" style={{ color: c.text.secondary }}>{props.subtitle}</motion.p>}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .7 }} className="mt-9 flex flex-wrap gap-3"><PremiumButton label={cta.primary} variant="primary" theme={theme} />{cta.secondary && <PremiumButton label={cta.secondary} variant="ghost" theme={theme} />}</motion.div>
      {socialProof && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="mt-12 flex items-center gap-4 border-t pt-7" style={{ borderColor: c.border }}><AvatarStack avatars={socialProof.avatars} /><p className="text-sm" style={{ color: c.text.secondary }}><b style={{ color: c.text.primary }}>{socialProof.count}</b> {socialProof.label}</p></motion.div>}
    </motion.div>
    <motion.div className="relative z-10 mt-12 h-[520px] lg:mt-0" style={{ rotateX, rotateY, transformPerspective: 1000 }}>
      <div className="relative grid h-full place-items-center overflow-hidden rounded-[2.5rem] border backdrop-blur-2xl" style={{ borderColor: c.border, background: `linear-gradient(145deg, ${c.accent.primaryGlow}, rgba(255,255,255,.035))`, boxShadow: `0 50px 120px rgba(0,0,0,.55), 0 0 80px ${c.accent.primaryGlow}` }}>
        {scene.fallbackImageUrl ? <img src={scene.fallbackImageUrl} alt="3D scene fallback" className="h-full w-full object-cover" /> : <ParticleScene primary={c.accent.primary} secondary={c.accent.secondary} />}
        <div className="absolute bottom-7 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-white/50">{scene.type || "particles"} scene</div>
      </div>
    </motion.div>
  </section>;
}

function ParticleScene({ primary, secondary }: { primary: string; secondary: string }) {
  return <div className="relative h-full w-full overflow-hidden"><div className="absolute inset-0" style={{ background: `radial-gradient(circle at 35% 35%, ${primary}55, transparent 26%), radial-gradient(circle at 70% 68%, ${secondary}44, transparent 28%)` }} />{Array.from({ length: 42 }).map((_, i) => <span key={i} className="absolute h-1.5 w-1.5 animate-float rounded-full" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 61) % 100}%`, background: i % 2 ? primary : secondary, opacity: .25 + (i % 5) * .09, animationDelay: `${-(i % 9)}s` }} />)}<div className="absolute left-1/2 top-1/2 grid h-64 w-64 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[3rem] border border-white/10 bg-white/10 text-8xl shadow-2xl backdrop-blur-xl">◈</div></div>;
}
