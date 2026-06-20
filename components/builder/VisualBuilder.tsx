"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";

type BuilderSection = {
  id: string;
  type: string;
  props: Record<string, any>;
  animation?: Record<string, any>;
  metadata?: Record<string, any>;
};

type Definition = { type: string; label: string; description: string; defaults: Record<string, any>; category?: string };
type Product = { id: string; name: string; price: number; stock: number };

type Props = {
  website: { id: string; name: string; slug: string; theme: any };
  page: { id: string; title: string; sections: BuilderSection[] };
  products: Product[];
  definitions: Definition[];
};

function localId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function VisualBuilder({ website, page, products, definitions }: Props) {
  const [sections, setSections] = useState<BuilderSection[]>(page.sections || []);
  const [siteName, setSiteName] = useState(website.name);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("Saved from database");

  function buildSection(type: string): BuilderSection {
    const definition = definitions.find((item) => item.type === type);
    return { id: localId(), type, props: definition?.defaults || {}, animation: { preset: "luxury-reveal" }, metadata: { definitionSource: "api" } };
  }
  function add(type: string) { setSections((current) => [...current, buildSection(type)]); }
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
  function update(id: string, props: Record<string, any>) {
    setSections((current) => current.map((s) => s.id === id ? { ...s, props: { ...s.props, ...props } } : s));
  }
  async function save() {
    setStatus("Saving…");
    const res = await fetch(`/api/pages/${page.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections }) });
    if (!res.ok) { setStatus("Save failed"); return; }
    setStatus("Saved to database");
  }
  async function exportCode() {
    setStatus("Generating export with Gemini…");
    const res = await fetch(`/api/websites/${website.id}/export`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) { setStatus(json.error || "Export failed"); return; }
    setStatus(`Export ready: ${json.data.url}`);
    window.open(json.data.url, "_blank");
  }
  async function uploadAsset(file: File, purpose = "asset") {
    setStatus(`Uploading ${file.name} to Vercel Blob…`);
    const form = new FormData();
    form.set("file", file);
    form.set("purpose", purpose);
    const res = await fetch(`/api/websites/${website.id}/assets`, { method: "POST", body: form });
    const json = await res.json();
    setStatus(res.ok ? `Uploaded to Blob: ${json.data.filename}` : json.error || "Upload failed");
  }
  async function generateHeroImage() {
    const imagePrompt = window.prompt("Describe the premium image asset", `Luxury editorial hero image for ${siteName}`);
    if (!imagePrompt) return;
    setStatus("Generating image with Gemini and saving to Vercel Blob…");
    const res = await fetch("/api/ai/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: imagePrompt, websiteId: website.id }) });
    const json = await res.json();
    setStatus(res.ok ? `AI image saved: ${json.data.url}` : json.error || "Image generation failed");
  }
  async function generateFromScene(file: File) {
    setStatus("Reading scene and preparing editable page…");
    const form = new FormData();
    form.set("image", file);
    form.set("prompt", "Turn this scene into a premium editable website using the current component system.");
    const res = await fetch("/api/ai/vision", { method: "POST", body: form });
    const json = await res.json();
    if (!res.ok) { setStatus(json.error || "Scene conversion failed"); return; }
    setSections(json.data.sections);
    setSiteName(json.data.name || siteName);
    setStatus("Scene converted into editable sections. Review and save.");
  }
  async function publish() {
    setStatus("Publishing…");
    const res = await fetch(`/api/websites/${website.id}/publish`, { method: "POST" });
    const json = await res.json();
    setStatus(res.ok ? `Published v${json.version}: ${json.url}` : "Publish failed");
  }
  async function generate() {
    setStatus("Generating via API…");
    const res = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: aiPrompt, industry: "Luxury retail" }) });
    const json = await res.json();
    if (!res.ok) { setStatus(json.error || "AI failed"); return; }
    setSections(json.data.sections);
    setSiteName(json.data.name);
    setAiOpen(false);
    setStatus("AI generated sections. Save to persist.");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Visual Builder</h1><p className="mt-2 text-charcoal/60">DB-backed page: /{website.slug}. Status: {status}</p></div>
        <div className="flex flex-wrap gap-2"><Button variant="light" onClick={() => startTransition(exportCode)}>Export code</Button><Button variant="light" onClick={() => startTransition(save)} disabled={isPending}><Save className="h-4 w-4" /> Save</Button><Button variant="gold" onClick={() => setAiOpen(true)}><Sparkles className="h-4 w-4" /> AI generate</Button><Button variant="dark" onClick={() => startTransition(publish)}>Publish</Button></div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[280px_1fr_290px]">
        <Card className="p-4"><h2 className="mb-4 font-black">Component metadata</h2><div className="grid gap-3">{definitions.map((item) => <button key={item.type} draggable onDragStart={(e) => e.dataTransfer.setData("section", item.type)} onClick={() => add(item.type)} className="rounded-3xl border border-black/10 bg-white/70 p-4 text-left transition hover:border-gold/50"><b>{item.label}</b><p className="mt-1 text-sm text-charcoal/55">{item.description}</p><p className="mt-2 text-[11px] font-black uppercase tracking-widest text-gold">{item.category || "Section"}</p></button>)}</div></Card>
        <Card className="min-h-[720px] overflow-hidden p-3"><div onDragOver={(e) => e.preventDefault()} onDrop={(e) => add(e.dataTransfer.getData("section") || "hero")} className="min-h-[690px] rounded-[24px] border border-black/10 bg-white p-3">{sections.length === 0 && <div className="rounded-3xl border border-dashed border-gold/60 bg-gold/5 p-8 text-center font-bold text-[#765813]">No sections yet. Add from metadata library.</div>}{sections.map((section, index) => <CanvasSection key={section.id} section={section} index={index} update={update} remove={remove} move={move} products={products} />)}<div className="mt-3 rounded-3xl border border-dashed border-gold/60 bg-gold/5 p-5 text-center text-sm font-bold text-[#765813]">Drop API component here</div></div></Card>
        <Card className="p-4"><h2 className="mb-4 font-black">Website metadata</h2><label className="text-xs font-black uppercase tracking-widest text-charcoal/45">Website name</label><input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3" /><div className="mt-5"><p className="text-xs font-black uppercase tracking-widest text-charcoal/45">Theme from DB</p><pre className="mt-3 max-h-44 overflow-auto rounded-2xl bg-charcoal p-4 text-xs text-cream">{JSON.stringify(website.theme, null, 2)}</pre></div><div className="mt-5 rounded-3xl border border-black/10 bg-white/65 p-4"><b>Vercel Blob assets</b><p className="mt-2 text-sm text-charcoal/55">Upload images or GLB/GLTF models. Files are stored in Vercel Blob and indexed in DB.</p><input className="mt-3 text-sm" type="file" accept="image/*,.glb,.gltf" onChange={(e) => e.target.files?.[0] && startTransition(() => uploadAsset(e.target.files![0], "builder"))} /><Button className="mt-3 w-full" variant="light" onClick={() => startTransition(generateHeroImage)}>Generate image with Gemini</Button></div></Card>
      </div>
      {aiOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-xl"><Card className="w-full max-w-2xl p-6"><div className="flex justify-between gap-4"><h2 className="font-serif text-4xl font-black tracking-[-.04em]">AI Website Generator</h2><Button variant="ghost" onClick={() => setAiOpen(false)}>Close</Button></div><textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows={5} placeholder="Luxury skincare storefront with product cards, gallery and lead capture…" className="mt-5 w-full rounded-3xl border border-black/10 bg-white/75 p-4" /><p className="mt-3 text-sm text-charcoal/55">Generation returns editable section metadata that can be saved to your page.</p><div className="mt-4 rounded-3xl border border-black/10 bg-white/60 p-4"><b>Convert a scene or screenshot</b><p className="mt-1 text-sm text-charcoal/55">Upload a reference image and turn it into editable sections.</p><input className="mt-3 text-sm" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && startTransition(() => generateFromScene(e.target.files![0]))} /></div><Button className="mt-5" variant="gold" disabled={isPending} onClick={() => startTransition(generate)}>{isPending ? "Working…" : "Generate website"}</Button></Card></div>}
    </div>
  );
}

function CanvasSection({ section, index, update, remove, move, products }: { section: BuilderSection; index: number; update: (id: string, props: Record<string, any>) => void; remove: (id: string) => void; move: (index: number, dir: -1 | 1) => void; products: Product[] }) {
  return <section className="group relative mb-3 overflow-hidden rounded-[24px] border border-black/10 bg-white"><div className="absolute right-3 top-3 z-10 hidden gap-1 group-hover:flex"><Button className="h-8 w-8 p-0" variant="dark" onClick={() => move(index, -1)}><ArrowUp className="h-3 w-3" /></Button><Button className="h-8 w-8 p-0" variant="dark" onClick={() => move(index, 1)}><ArrowDown className="h-3 w-3" /></Button><Button className="h-8 w-8 p-0" variant="dark" onClick={() => remove(section.id)}><Trash2 className="h-3 w-3" /></Button></div><SectionPreview section={section} update={update} products={products} /></section>;
}

function Editable({ value, onSave, className }: { value: string; onSave: (value: string) => void; className?: string }) {
  return <div contentEditable suppressContentEditableWarning onBlur={(e) => onSave(e.currentTarget.innerText)} className={className}>{value}</div>;
}

function SectionPreview({ section, update, products }: { section: BuilderSection; update: (id: string, props: Record<string, any>) => void; products: Product[] }) {
  const p = section.props || {};
  if (section.type === "products") return <div className="p-10"><Editable value={p.title || "Featured products"} onSave={(title) => update(section.id, { title })} className="font-serif text-4xl font-black tracking-[-.04em]" /><div className="mt-6 grid gap-4 md:grid-cols-3">{products.slice(0, p.limit || 3).map((product) => <div key={product.id} className="rounded-3xl border border-black/10 p-4"><div className="shimmer mb-4 h-28 rounded-2xl bg-gradient-to-br from-charcoal to-gold" /><b>{product.name}</b><p className="text-sm text-charcoal/55">${(product.price / 100).toFixed(2)} · {product.stock} in stock</p></div>)}</div>{products.length === 0 && <p className="mt-4 text-charcoal/55">No DB products yet. Add products in CMS.</p>}</div>;
  if (section.type === "gallery") return <div className="p-10"><Editable value={p.title || "Editorial gallery"} onSave={(title) => update(section.id, { title })} className="font-serif text-4xl font-black tracking-[-.04em]" /><div className="mt-6 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]"><div className="shimmer h-64 rounded-3xl bg-gradient-to-br from-[#eadfc9] to-gold"/><div className="shimmer h-64 rounded-3xl bg-gradient-to-br from-white to-[#eadfc9]"/><div className="shimmer h-64 rounded-3xl bg-gradient-to-br from-charcoal to-gold"/></div></div>;
  if (section.type === "model3d") return <div className="grid gap-8 bg-gradient-to-br from-white to-[#f6ead5] p-10 md:grid-cols-2 md:items-center"><div><Badge>3D showcase</Badge><Editable value={p.title || "Explore every detail"} onSave={(title) => update(section.id, { title })} className="mt-4 font-serif text-5xl font-black tracking-[-.05em]" /><Editable value={p.body || "A closer look at the craftsmanship, materials and form."} onSave={(body) => update(section.id, { body })} className="mt-4 leading-8 text-charcoal/60" /></div><div className="relative grid h-80 place-items-center overflow-hidden rounded-[2rem] border border-black/10 bg-charcoal text-white shadow-luxury"><div className="absolute h-44 w-44 rounded-full bg-gold/30 blur-2xl"/><span className="relative text-7xl">◈</span><p className="absolute bottom-5 text-sm text-white/60">{p.assetUrl ? "Model asset connected" : "Upload a GLB/GLTF asset, then paste its URL in metadata"}</p></div></div>;
  if (section.type === "lead") return <div className="bg-charcoal p-10 text-white"><Badge>Lead API</Badge><h2 className="mt-4 font-serif text-4xl font-black tracking-[-.04em]">{p.title || "Join the private list"}</h2><div className="mt-6 flex max-w-xl gap-2"><input className="min-w-0 flex-1 rounded-full px-5 py-3 text-charcoal" placeholder={p.placeholder || "email@brand.com"}/><Button variant="gold"><Plus className="h-4 w-4" /> Subscribe</Button></div></div>;
  if (section.type === "features") return <div className="p-10"><Editable value={p.title || "Features"} onSave={(title) => update(section.id, { title })} className="font-serif text-4xl font-black tracking-[-.04em]" /><div className="mt-6 grid gap-4 md:grid-cols-3">{(p.items || []).map((f: any, i: number) => <div key={i} className="rounded-3xl border border-black/10 bg-white p-5"><b>{f.title}</b><p className="mt-2 text-sm text-charcoal/55">{f.body}</p></div>)}</div></div>;
  return <div className="bg-gradient-to-br from-white to-[#f6ead5] p-12"><Badge>{p.eyebrow || "AI-generated launch page"}</Badge><Editable value={p.title || "Premium website"} onSave={(title) => update(section.id, { title })} className="mt-6 max-w-2xl font-serif text-6xl font-black leading-[.92] tracking-[-.06em]" /><Editable value={p.body || "Edit this premium copy inline."} onSave={(body) => update(section.id, { body })} className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/60" /><Button className="mt-7" variant="gold">{p.cta || "Explore"}</Button></div>;
}
