"use client";

import { motion } from "framer-motion";
import { CountUpNumber, getTheme, SectionHeader } from "@/components/renderers/shared/PremiumPrimitives";

export function StatsRenderer({ props = {}, theme }: { props: any; theme?: any }) {
  const c = getTheme(theme);
  const items = props.items?.length ? props.items : [
    { value: "98%", label: "Client satisfaction", description: "Based on premium launches", suffix: "%", icon: "✦" },
    { value: "50K+", label: "Visitors converted", icon: "↗" },
    { value: "4.9★", label: "Average rating", icon: "★" }
  ];
  return <section className="relative overflow-hidden px-6 py-24" style={{ background: props.backgroundFx === "gradient" ? `radial-gradient(ellipse at center, ${c.accent.primaryGlow}, ${c.base} 62%)` : c.base }}><div className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: c.accent.primaryGlow }} /><div className="relative z-10 mx-auto max-w-7xl"><SectionHeader eyebrow={props.eyebrow} title={props.title || "Proof in numbers"} theme={theme} className="mb-14" /><div className={`grid gap-5 ${props.layout === "row" ? "md:grid-cols-3" : "md:grid-cols-3"}`}>{items.map((stat: any, i: number) => <StatCard key={i} stat={stat} index={i} theme={theme} scattered={props.layout === "scattered"} />)}</div></div></section>;
}

function StatCard({ stat, index, theme, scattered }: { stat: any; index: number; theme?: any; scattered?: boolean }) {
  const c = getTheme(theme);
  return <motion.div initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: .7, delay: index * .1, ease: [0.19, 1, 0.22, 1] }} className="relative overflow-hidden rounded-[2rem] border p-8 text-center backdrop-blur-xl" style={{ marginTop: scattered && index % 2 ? 32 : 0, borderColor: c.border, background: `linear-gradient(145deg, ${c.surfaceElevated}, ${c.surface})` }}>
    <div className="absolute left-[20%] right-[20%] top-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${c.accent.primary}, transparent)` }} />
    {stat.icon && <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl text-xl" style={{ background: c.accent.primaryGlow, color: c.accent.primary }}>{stat.icon}</div>}
    <CountUpNumber value={`${stat.prefix || ""}${stat.value}${stat.suffix && !String(stat.value).includes(stat.suffix) ? stat.suffix : ""}`} className="gold-text text-6xl font-black tracking-[-.06em]" />
    <p className="mt-4 font-black" style={{ color: c.text.primary }}>{stat.label}</p>
    {stat.description && <p className="mt-2 text-sm leading-6" style={{ color: c.text.muted }}>{stat.description}</p>}
  </motion.div>;
}
