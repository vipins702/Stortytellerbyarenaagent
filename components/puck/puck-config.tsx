"use client";

import type { Config } from "@measured/puck";

function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`relative overflow-hidden px-6 py-24 text-white ${className}`}><div className="mx-auto max-w-7xl">{children}</div></section>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex rounded-full border border-violet/40 bg-violet/15 px-3 py-1 text-xs font-black uppercase tracking-[.18em] text-violet-200">{children}</span>;
}

const fields = {
  text: { type: "text" as const },
  textarea: { type: "textarea" as const }
};

export const puckConfig: Config = {
  root: {
    fields: { title: { type: "text" } },
    render: ({ children }: any) => <>{children}</>
  },
  components: {
    Hero3D: {
      label: "3D Hero",
      fields: {
        eyebrow: fields.text,
        title: fields.text,
        titleHighlight: fields.text,
        subtitle: fields.text,
        primaryCta: fields.text,
        secondaryCta: fields.text,
        sceneType: { type: "select", options: [{ label: "Particles", value: "particles" }, { label: "Spline", value: "spline" }, { label: "None", value: "none" }] },
        fallbackImageUrl: fields.text
      },
      defaultProps: { eyebrow: "Introducing", title: "The Apex", titleHighlight: "in motion", subtitle: "A cinematic product page with depth, glow and story.", primaryCta: "Get access", secondaryCta: "Watch demo", sceneType: "particles", fallbackImageUrl: "" },
      render: (p: any) => <Shell className="min-h-[86vh] bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,.28),transparent_30%),radial-gradient(circle_at_20%_90%,rgba(34,211,238,.16),transparent_30%)]"><div className="grid items-center gap-12 lg:grid-cols-[1fr_.9fr]"><div><Pill>{p.eyebrow}</Pill><h1 className="mt-6 max-w-4xl text-6xl font-black leading-[.88] tracking-[-.075em] md:text-8xl">{p.title} <span className="gold-text">{p.titleHighlight}</span></h1><p className="mt-7 max-w-2xl text-xl leading-9 text-white/58">{p.subtitle}</p><div className="mt-8 flex gap-3"><button className="rounded-full bg-gradient-to-r from-violet to-cyan px-6 py-3 font-black text-white shadow-glow">{p.primaryCta}</button><button className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-black text-white">{p.secondaryCta}</button></div></div><div className="relative grid min-h-[460px] place-items-center rounded-[2.5rem] border border-white/10 bg-white/[.06] shadow-2xl"><div className="absolute h-72 w-72 rounded-full bg-violet/30 blur-3xl"/><span className="relative text-9xl">◈</span><p className="absolute bottom-8 text-sm font-bold uppercase tracking-[.18em] text-white/40">{p.sceneType} scene</p></div></div></Shell>
    },
    BentoGrid: {
      label: "Bento Grid",
      fields: { eyebrow: fields.text, title: fields.text, card1Title: fields.text, card1Body: fields.text, card2Title: fields.text, card2Body: fields.text, card3Title: fields.text, card3Body: fields.text },
      defaultProps: { eyebrow: "Why it works", title: "Built like a premium product system", card1Title: "Cinematic layouts", card1Body: "Every section has depth and rhythm.", card2Title: "98%", card2Body: "Launch satisfaction", card3Title: "Media first", card3Body: "Images, video and 3D assets." },
      render: (p: any) => <Shell><Pill>{p.eyebrow}</Pill><h2 className="mt-5 max-w-3xl text-5xl font-black tracking-[-.06em]">{p.title}</h2><div className="mt-10 grid auto-rows-[190px] gap-4 md:grid-cols-3"><article className="md:col-span-2 rounded-[2rem] border border-white/10 bg-white/[.06] p-7"><h3 className="text-3xl font-black">{p.card1Title}</h3><p className="mt-3 text-white/55">{p.card1Body}</p></article><article className="rounded-[2rem] border border-cyan/20 bg-cyan/10 p-7"><h3 className="text-5xl font-black gold-text">{p.card2Title}</h3><p className="mt-3 text-white/55">{p.card2Body}</p></article><article className="md:col-span-3 rounded-[2rem] border border-violet/20 bg-violet/10 p-7"><h3 className="text-3xl font-black">{p.card3Title}</h3><p className="mt-3 text-white/55">{p.card3Body}</p></article></div></Shell>
    },
    Marquee: {
      label: "Marquee",
      fields: { eyebrow: fields.text, items: fields.text },
      defaultProps: { eyebrow: "Trusted by", items: "Luminary, Apex, Scroll Story, No Code, Commerce, 3D" },
      render: (p: any) => <section className="overflow-hidden border-y border-white/10 py-12"><p className="mb-8 text-center text-xs font-black uppercase tracking-[.22em] text-white/35">{p.eyebrow}</p><div className="flex animate-[marquee_28s_linear_infinite] gap-4 whitespace-nowrap">{String(p.items).split(",").concat(String(p.items).split(",")).map((item, i) => <span key={i} className="rounded-full border border-white/10 bg-white/[.06] px-6 py-3 font-black text-white/70">{item.trim()}</span>)}</div><style jsx>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style></section>
    },
    Stats: {
      label: "Stats",
      fields: { title: fields.text, stat1: fields.text, label1: fields.text, stat2: fields.text, label2: fields.text, stat3: fields.text, label3: fields.text },
      defaultProps: { title: "Proof in numbers", stat1: "98%", label1: "Client satisfaction", stat2: "50K+", label2: "Visitors converted", stat3: "4.9★", label3: "Average rating" },
      render: (p: any) => <Shell><h2 className="text-center text-5xl font-black tracking-[-.06em]">{p.title}</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{[[p.stat1,p.label1],[p.stat2,p.label2],[p.stat3,p.label3]].map(([v,l],i)=><div key={i} className="rounded-[2rem] border border-white/10 bg-white/[.06] p-8 text-center"><b className="gold-text text-6xl">{v}</b><p className="mt-3 text-white/55">{l}</p></div>)}</div></Shell>
    },
    Pricing: {
      label: "Pricing",
      fields: { eyebrow: fields.text, title: fields.text },
      defaultProps: { eyebrow: "Pricing", title: "Choose your launch plan" },
      render: (p: any) => <Shell><div className="text-center"><Pill>{p.eyebrow}</Pill><h2 className="mt-5 text-5xl font-black tracking-[-.06em]">{p.title}</h2></div><div className="mt-10 grid gap-4 md:grid-cols-3">{["Starter","Pro","Business"].map((plan,i)=><div key={plan} className={`rounded-[2rem] border p-7 ${i===1?'border-cyan/40 bg-cyan/10':'border-white/10 bg-white/[.06]'}`}><h3 className="text-2xl font-black">{plan}</h3><p className="mt-4 text-5xl font-black">${[0,29,99][i]}<span className="text-sm text-white/45">/mo</span></p><button className="mt-6 w-full rounded-full bg-gradient-to-r from-violet to-cyan px-5 py-3 font-black">Choose</button></div>)}</div></Shell>
    },
    FAQ: {
      label: "FAQ",
      fields: { title: fields.text, q1: fields.text, a1: fields.text, q2: fields.text, a2: fields.text },
      defaultProps: { title: "Questions", q1: "Can I upload video?", a1: "Yes, MP4 and WebM are supported.", q2: "Can I sell products?", a2: "Yes, products, variants and checkout are included." },
      render: (p: any) => <Shell><h2 className="text-center text-5xl font-black tracking-[-.06em]">{p.title}</h2><div className="mx-auto mt-10 max-w-3xl space-y-3">{[[p.q1,p.a1],[p.q2,p.a2]].map(([q,a],i)=><details key={i} className="rounded-2xl border border-white/10 bg-white/[.06] p-5"><summary className="cursor-pointer font-black">{q}</summary><p className="mt-3 text-white/55">{a}</p></details>)}</div></Shell>
    },
    ScrollStory: {
      label: "Scroll Story",
      fields: { eyebrow: fields.text, title: fields.text, body: fields.text, mediaUrl: fields.text },
      defaultProps: { eyebrow: "Story", title: "A journey told in motion", body: "Guide visitors through a cinematic product sequence.", mediaUrl: "" },
      render: (p: any) => <Shell className="bg-[#070710]"><div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]"><div className="lg:sticky lg:top-24 lg:h-fit"><Pill>{p.eyebrow}</Pill><h2 className="mt-6 text-6xl font-black tracking-[-.07em]">{p.title}</h2><p className="mt-5 text-white/55">{p.body}</p></div><div className="grid h-[520px] place-items-center rounded-[2.5rem] border border-white/10 bg-white/[.06]">{p.mediaUrl ? <video src={p.mediaUrl} controls className="h-full w-full rounded-[2.5rem] object-cover"/> : <span className="text-8xl">◌</span>}</div></div></Shell>
    },
    ProductGrid: {
      label: "Products",
      fields: { title: fields.text },
      defaultProps: { title: "Featured products" },
      render: (p: any) => <Shell><h2 className="text-5xl font-black tracking-[-.06em]">{p.title}</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{[1,2,3].map(i=><div key={i} className="rounded-[2rem] border border-white/10 bg-white/[.06] p-5"><div className="h-44 rounded-[1.5rem] bg-gradient-to-br from-violet/40 to-cyan/20"/><b className="mt-5 block">Product {i}</b><p className="text-white/45">Connected to CMS products</p></div>)}</div></Shell>
    },
    CTA: {
      label: "Fullscreen CTA",
      fields: { title: fields.text, body: fields.text, primaryCta: fields.text },
      defaultProps: { title: "Launch a page that feels cinematic", body: "Turn your product story into a premium experience.", primaryCta: "Start building" },
      render: (p: any) => <Shell className="min-h-[70vh] grid place-items-center text-center"><h2 className="mx-auto max-w-4xl text-6xl font-black tracking-[-.07em]">{p.title}</h2><p className="mx-auto mt-5 max-w-2xl text-white/55">{p.body}</p><button className="mt-8 rounded-full bg-gradient-to-r from-violet to-cyan px-7 py-4 font-black">{p.primaryCta}</button></Shell>
    },
    Footer: {
      label: "Footer",
      fields: { logo: fields.text, tagline: fields.text },
      defaultProps: { logo: "ScrollStoryTeller", tagline: "Build cinematic product pages." },
      render: (p: any) => <footer className="border-t border-white/10 px-6 py-14"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6"><div><b className="text-xl">{p.logo}</b><p className="mt-2 text-white/45">{p.tagline}</p></div><div className="flex gap-4 text-sm text-white/45"><a>Privacy</a><a>Terms</a><a>Contact</a></div></div></footer>
    }
  }
};
