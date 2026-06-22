"use client";

import { motion } from "framer-motion";
import { getTheme, SectionHeader } from "@/components/renderers/shared/PremiumPrimitives";

const sizeMap: Record<string, string> = {
  "2x2": "md:col-span-2 md:row-span-2 min-h-[390px]",
  "2x1": "md:col-span-2 min-h-[190px]",
  "1x2": "md:row-span-2 min-h-[390px]",
  "1x1": "min-h-[190px]"
};

export function BentoGridRenderer({ props = {}, theme }: { props: any; theme?: any }) {
  const c = getTheme(theme);
  const cards = props.cards?.length ? props.cards : [
    { id: "1", size: "2x1", type: "feature", title: "Cinematic layouts", body: "Layered sections with glow, depth and media rhythm.", accentColor: c.accent.primary, backgroundFx: "glass", hoverFx: "tilt", badge: "Premium" },
    { id: "2", size: "1x1", type: "stat", title: "98%", body: "Launch confidence", accentColor: c.accent.secondary, backgroundFx: "gradient", hoverFx: "glow" },
    { id: "3", size: "1x1", type: "quote", title: "Bespoke", body: "Feels like a custom campaign.", accentColor: c.accent.tertiary, backgroundFx: "noise", hoverFx: "scale" }
  ];
  return <section className="px-6 py-24" style={{ background: c.base }}><div className="mx-auto max-w-7xl"><SectionHeader eyebrow={props.eyebrow} title={props.title || "Built like a premium product system"} theme={theme} align="left" className="mb-12" /><div className="grid auto-rows-[190px] gap-4 md:grid-cols-3">{cards.map((card: any, i: number) => <BentoCard key={card.id || i} card={card} index={i} theme={theme} />)}</div></div></section>;
}

function BentoCard({ card, index, theme }: { card: any; index: number; theme?: any }) {
  const c = getTheme(theme);
  const accent = card.accentColor || c.accent.primary;
  const bg = card.backgroundFx === "gradient" ? `linear-gradient(145deg, ${accent}22, ${c.surface})` : card.backgroundFx === "noise" ? c.surfaceElevated : "rgba(255,255,255,.055)";
  return <motion.article initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: index * .08, ease: [0.19, 1, 0.22, 1] }} whileHover={{ y: -6, rotateX: card.hoverFx === "tilt" ? 3 : 0, rotateY: card.hoverFx === "tilt" ? -3 : 0 }} className={`${sizeMap[card.size] || sizeMap["1x1"]} group relative overflow-hidden rounded-[2rem] border p-6 backdrop-blur-xl`} style={{ borderColor: c.border, background: bg, boxShadow: card.hoverFx === "glow" ? `0 0 60px ${accent}22` : "none" }}>
    <div className="absolute right-0 top-0 h-32 w-32 rounded-full blur-2xl transition-opacity group-hover:opacity-100" style={{ background: `${accent}33`, opacity: .4 }} />
    {card.badge && <span className="rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-widest" style={{ borderColor: `${accent}55`, color: accent, background: `${accent}18` }}>{card.badge}</span>}
    {card.mediaUrl && (card.type === "video" ? <video src={card.mediaUrl} className="absolute inset-0 h-full w-full object-cover opacity-50" muted autoPlay loop playsInline /> : <img src={card.mediaUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />)}
    <div className="relative z-10 flex h-full flex-col justify-end"><h3 className={`${card.type === "stat" ? "text-6xl gold-text" : "text-2xl text-white"} font-black tracking-[-.05em]`}>{card.title}</h3><p className="mt-3 max-w-md leading-7 text-white/55">{card.body}</p></div>
  </motion.article>;
}
