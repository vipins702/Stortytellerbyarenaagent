"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";
import { defaultSections, products } from "@/lib/data";
import type { SectionType, SiteSection } from "@/lib/types";

const library: { type: SectionType; label: string; description: string }[] = [
  { type: "hero", label: "Hero", description: "Premium headline and CTA" },
  { type: "features", label: "Features", description: "Three glass feature cards" },
  { type: "gallery", label: "Gallery", description: "Editorial image grid" },
  { type: "products", label: "Products", description: "Commerce product cards" },
  { type: "lead", label: "Lead form", description: "Email capture block" }
];

function newSection(type: SectionType): SiteSection {
  return { id: crypto.randomUUID(), type, title: type === "hero" ? "Maison Lumière" : `${type[0].toUpperCase()}${type.slice(1)} section`, body: "Edit this premium copy inline and customize your story." };
}

export function VisualBuilder() {
  const [sections, setSections] = useState<SiteSection[]>(defaultSections);
  const [siteName, setSiteName] = useState("Maison Lumière");
  const [aiOpen, setAiOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const progress = useMemo(() => (loading ? "Generating layout, copy and sections…" : "Ready"), [loading]);

  function add(type: SectionType) { setSections((current) => [...current, newSection(type)]); }
  function remove(id: string) { setSections((current) => current.filter((section) => section.id !== id)); }
  function move(index: number, dir: -1 | 1) {
    setSections((current) => {
      const next = [...current];
      const target = index + dir;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  function update(id: string, patch: Partial<SiteSection>) { setSections((current) => current.map((s) => s.id === id ? { ...s, ...patch } : s)); }
  async function generate() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSiteName(prompt.toLowerCase().includes("saas") ? "Aurelia Cloud" : "Maison Aurelia");
    setSections([
      { ...newSection("hero"), title: prompt.toLowerCase().includes("saas") ? "Aurelia Cloud" : "Maison Aurelia", body: prompt || "AI-generated premium website." },
      newSection("features"), newSection("gallery"), newSection("products"), newSection("lead")
    ]);
    setLoading(false); setAiOpen(false);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Visual Builder</h1><p className="mt-2 text-charcoal/60">Add sections, edit inline, reorder and publish.</p></div>
        <div className="flex gap-2"><Button variant="light" onClick={() => alert("Static HTML export queued for this website.")}>Export code</Button><Button variant="gold" onClick={() => setAiOpen(true)}><Sparkles className="h-4 w-4" /> AI generate</Button></div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[280px_1fr_290px]">
        <Card className="p-4"><h2 className="mb-4 font-black">Component library</h2><div className="grid gap-3">{library.map((item) => <button key={item.type} draggable onDragStart={(e) => e.dataTransfer.setData("section", item.type)} onClick={() => add(item.type)} className="rounded-3xl border border-black/10 bg-white/70 p-4 text-left transition hover:border-gold/50"><b>{item.label}</b><p className="mt-1 text-sm text-charcoal/55">{item.description}</p></button>)}</div></Card>
        <Card className="min-h-[720px] overflow-hidden p-3"><div onDragOver={(e) => e.preventDefault()} onDrop={(e) => add((e.dataTransfer.getData("section") || "hero") as SectionType)} className="min-h-[690px] rounded-[24px] border border-black/10 bg-white p-3">{sections.map((section, index) => <CanvasSection key={section.id} section={section} index={index} update={update} remove={remove} move={move} />)}<div className="mt-3 rounded-3xl border border-dashed border-gold/60 bg-gold/5 p-5 text-center text-sm font-bold text-[#765813]">Drop sections here</div></div></Card>
        <Card className="p-4"><h2 className="mb-4 font-black">Design system</h2><label className="text-xs font-black uppercase tracking-widest text-charcoal/45">Website name</label><input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3" /><div className="mt-5"><p className="text-xs font-black uppercase tracking-widest text-charcoal/45">Luxury presets</p><div className="mt-3 flex gap-2">{["#D4AF37", "#C89B7B", "#8B7DFF", "#111111"].map((c) => <span key={c} className="h-9 w-9 rounded-full border-2 border-white shadow" style={{ background: c }} />)}</div></div><div className="mt-5 rounded-3xl border border-black/10 bg-white/65 p-4"><b>3D model uploader</b><p className="mt-2 text-sm text-charcoal/55">MVP placeholder for GLB/GLTF upload. Production: Uploadthing + React Three Fiber.</p><input className="mt-3 text-sm" type="file" accept=".glb,.gltf" /></div></Card>
      </div>
      {aiOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-xl"><Card className="w-full max-w-2xl p-6"><div className="flex justify-between gap-4"><h2 className="font-serif text-4xl font-black tracking-[-.04em]">AI Website Generator</h2><Button variant="ghost" onClick={() => setAiOpen(false)}>Close</Button></div><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={5} placeholder="Luxury skincare storefront with product cards, gallery and lead capture…" className="mt-5 w-full rounded-3xl border border-black/10 bg-white/75 p-4" /><p className="mt-3 text-sm text-charcoal/55">{progress}</p><Button className="mt-5" variant="gold" disabled={loading} onClick={generate}>{loading ? "Generating…" : "Generate website"}</Button></Card></div>}
    </div>
  );
}

function CanvasSection({ section, index, update, remove, move }: { section: SiteSection; index: number; update: (id: string, patch: Partial<SiteSection>) => void; remove: (id: string) => void; move: (index: number, dir: -1 | 1) => void }) {
  return <section className="group relative mb-3 overflow-hidden rounded-[24px] border border-black/10 bg-white"><div className="absolute right-3 top-3 z-10 hidden gap-1 group-hover:flex"><Button className="h-8 w-8 p-0" variant="dark" onClick={() => move(index, -1)}><ArrowUp className="h-3 w-3" /></Button><Button className="h-8 w-8 p-0" variant="dark" onClick={() => move(index, 1)}><ArrowDown className="h-3 w-3" /></Button><Button className="h-8 w-8 p-0" variant="dark" onClick={() => remove(section.id)}><Trash2 className="h-3 w-3" /></Button></div><SectionPreview section={section} update={update} /></section>;
}

function SectionPreview({ section, update }: { section: SiteSection; update: (id: string, patch: Partial<SiteSection>) => void }) {
  if (section.type === "products") return <div className="p-10"><h2 contentEditable suppressContentEditableWarning onBlur={(e) => update(section.id, { title: e.currentTarget.innerText })} className="font-serif text-4xl font-black tracking-[-.04em]">{section.title}</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{products.map((p) => <div key={p.id} className="rounded-3xl border border-black/10 p-4"><div className="shimmer mb-4 h-28 rounded-2xl bg-gradient-to-br from-charcoal to-gold" /><b>{p.name}</b><p className="text-sm text-charcoal/55">${p.price} · {p.stock} in stock</p></div>)}</div></div>;
  if (section.type === "gallery") return <div className="p-10"><h2 className="font-serif text-4xl font-black tracking-[-.04em]">{section.title}</h2><div className="mt-6 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]"><div className="shimmer h-64 rounded-3xl bg-gradient-to-br from-[#eadfc9] to-gold"/><div className="shimmer h-64 rounded-3xl bg-gradient-to-br from-white to-[#eadfc9]"/><div className="shimmer h-64 rounded-3xl bg-gradient-to-br from-charcoal to-gold"/></div></div>;
  if (section.type === "lead") return <div className="bg-charcoal p-10 text-white"><Badge>Lead capture</Badge><h2 className="mt-4 font-serif text-4xl font-black tracking-[-.04em]">Join the private list</h2><div className="mt-6 flex max-w-xl gap-2"><input className="min-w-0 flex-1 rounded-full px-5 py-3 text-charcoal" placeholder="email@brand.com"/><Button variant="gold"><Plus className="h-4 w-4" /> Subscribe</Button></div></div>;
  if (section.type === "features") return <div className="p-10"><h2 contentEditable suppressContentEditableWarning onBlur={(e) => update(section.id, { title: e.currentTarget.innerText })} className="font-serif text-4xl font-black tracking-[-.04em]">{section.title}</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{["AI layouts", "Luxury motion", "Commerce ready"].map((f) => <div key={f} className="rounded-3xl border border-black/10 bg-white p-5"><b>{f}</b><p className="mt-2 text-sm text-charcoal/55">Premium blocks ready to customize.</p></div>)}</div></div>;
  return <div className="bg-gradient-to-br from-white to-[#f6ead5] p-12"><Badge>AI-generated launch page</Badge><h2 contentEditable suppressContentEditableWarning onBlur={(e) => update(section.id, { title: e.currentTarget.innerText })} className="mt-6 max-w-2xl font-serif text-6xl font-black leading-[.92] tracking-[-.06em]">{section.title}</h2><p contentEditable suppressContentEditableWarning onBlur={(e) => update(section.id, { body: e.currentTarget.innerText })} className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/60">{section.body}</p><Button className="mt-7" variant="gold">Shop collection</Button></div>;
}
