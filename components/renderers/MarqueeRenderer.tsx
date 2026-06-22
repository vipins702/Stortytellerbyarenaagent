"use client";

import { getTheme } from "@/components/renderers/shared/PremiumPrimitives";

export function MarqueeRenderer({ props = {}, theme }: { props: any; theme?: any }) {
  const c = getTheme(theme);
  const speed = props.speed === "slow" ? 60 : props.speed === "fast" ? 20 : 34;
  const rows = Number(props.rows || 1);
  const items = props.items?.length ? props.items : [{ type: "text", value: "Product Launch" }, { type: "tag", value: "Scroll Story" }, { type: "tag", value: "3D" }, { type: "text", value: "Commerce" }];
  return <section className="overflow-hidden border-y py-14" style={{ background: c.base, borderColor: c.border }}>
    {props.eyebrow && <p className="mb-9 text-center text-xs font-black uppercase tracking-[.24em]" style={{ color: c.text.muted }}>{props.eyebrow}</p>}
    {Array.from({ length: rows }).map((_, row) => <div key={row} className="relative mb-5 last:mb-0 overflow-hidden"><div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40" style={{ background: `linear-gradient(to right, ${c.base}, transparent)` }} /><div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40" style={{ background: `linear-gradient(to left, ${c.base}, transparent)` }} /><div className="flex w-max gap-4" style={{ animation: `${row % 2 ? "marqueeReverse" : "marquee"} ${speed}s linear infinite` }}>{[...items, ...items, ...items].map((item: any, i: number) => <MarqueeItem key={`${row}-${i}`} item={item} theme={theme} />)}</div></div>)}
    <style jsx>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-33.333%)}} @keyframes marqueeReverse{from{transform:translateX(-33.333%)}to{transform:translateX(0)}}`}</style>
  </section>;
}

function MarqueeItem({ item, theme }: { item: any; theme?: any }) {
  const c = getTheme(theme);
  if (item.type === "image") return <div className="h-20 w-48 shrink-0 overflow-hidden rounded-2xl border" style={{ borderColor: c.border }}><img src={item.value || item.url} alt="" className="h-full w-full object-cover" /></div>;
  if (item.type === "logo") return <div className="grid h-16 min-w-44 shrink-0 place-items-center rounded-2xl border px-6" style={{ borderColor: c.border, background: c.surface }}><img src={item.value} alt={item.url || "Logo"} className="max-h-7 opacity-70 grayscale" /></div>;
  if (item.type === "tag") return <div className="shrink-0 rounded-full border px-6 py-3 text-sm font-black" style={{ borderColor: `${c.accent.primary}55`, background: c.accent.primaryGlow, color: c.accent.primary }}># {item.value}</div>;
  return <div className="shrink-0 rounded-full border px-6 py-3 text-sm font-black" style={{ borderColor: c.border, background: c.surface, color: c.text.secondary }}>{item.value}</div>;
}
