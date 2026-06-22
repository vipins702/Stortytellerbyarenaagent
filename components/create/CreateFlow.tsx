"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { premiumTemplates } from "@/lib/premium-templates";
import { premiumColorSystems } from "@/lib/premium-schema";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";

export function CreateFlow() {
  const router = useRouter();
  const [brand, setBrand] = useState("Luminary");
  const [product, setProduct] = useState("The Apex");
  const [audience, setAudience] = useState("premium buyers who love cinematic product experiences");
  const [description, setDescription] = useState("A precision-engineered product with timeless design, rich media and a clear purchase path.");
  const [template, setTemplate] = useState<string>(premiumTemplates[0].slug);
  const [style, setStyle] = useState("arcticChrome");
  const [media, setMedia] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  const selected = useMemo(() => premiumTemplates.find((t) => t.slug === template) || premiumTemplates[0], [template]);
  const storyPlan = [
    { label: "Opening", text: `Introduce ${product} with a cinematic ${selected.industry} hero.` },
    { label: "Reveal", text: "Use uploaded media as a scroll story with product chapters." },
    { label: "Proof", text: "Add bento cards, stats and social proof to build trust." },
    { label: "Conversion", text: "Finish with products, lead capture or a full-screen CTA." }
  ];

  async function create() {
    setStatus("Creating story workspace…");
    const prompt = `Create a premium cinematic scroll story page for brand ${brand}, product ${product}. Audience: ${audience}. Description: ${description}. Use ${selected.name} template style and ${style} color system. Include ${selected.sections.join(", ")}.`;
    const res = await fetch("/api/websites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `${brand} — ${product}`, industry: selected.industry }) });
    const json = await res.json();
    if (!res.ok) { setStatus(json.error || "Unable to create website"); return; }
    const website = json.data;
    if (media) {
      setStatus("Uploading media to library…");
      const form = new FormData();
      form.set("file", media);
      form.set("purpose", "story-director");
      await fetch(`/api/websites/${website.id}/assets`, { method: "POST", body: form }).catch(() => null);
    }
    setStatus("Directing page with Gemini…");
    const ai = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, industry: selected.industry, websiteId: website.id }) });
    const aiJson = await ai.json();
    if (ai.ok && website.pages?.[0]?.id && aiJson.data?.sections) {
      await fetch(`/api/pages/${website.pages[0].id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections: aiJson.data.sections }) });
    }
    setStatus("Opening Studio…");
    router.push("/studio");
    router.refresh();
  }

  return <div className="mx-auto max-w-[1600px] px-5 py-8"><div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)_380px]">
    <Card className="p-6"><Badge>AI Story Director</Badge><h1 className="mt-4 text-5xl font-black leading-[.92] tracking-[-.07em]">Create a cinematic product page.</h1><p className="mt-4 text-white/50">Tell the director what you sell, upload media, choose a mood, then open the page in Studio.</p><div className="mt-6 grid gap-4"><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/35">Brand</span><input value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/35">Product</span><input value={product} onChange={(e) => setProduct(e.target.value)} className="rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/35">Audience</span><input value={audience} onChange={(e) => setAudience(e.target.value)} className="rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/35">Description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-28 rounded-2xl px-4 py-3" /></label><label className="grid gap-2 rounded-3xl border border-dashed border-violet/35 bg-violet/10 p-4"><span className="text-xs font-black uppercase tracking-widest text-violet-200">Drop media</span><input type="file" accept="image/*,video/mp4,video/webm,.glb,.gltf" onChange={(e) => setMedia(e.target.files?.[0] || null)} /><span className="text-xs text-white/40">{media ? media.name : "Product image, video or 3D model"}</span></label><Button variant="gold" disabled={pending} onClick={() => startTransition(create)}>{pending ? "Directing…" : "Generate story page"}</Button>{status && <p className="text-sm text-white/55">{status}</p>}</div></Card>
    <div className="grid content-start gap-5"><Card className="overflow-hidden"><div className={`relative h-[420px] bg-gradient-to-br ${selected.preview.gradient}`}><div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.22),transparent_25%)]"/><div className="absolute bottom-8 left-8 max-w-xl"><Badge>{selected.industry}</Badge><h2 className="mt-4 text-6xl font-black leading-[.9] tracking-[-.075em]">{brand}<br/><span className="gold-text">{product}</span></h2><p className="mt-4 text-white/60">{selected.description}</p></div></div></Card><div className="grid gap-3 md:grid-cols-4">{Object.entries(premiumColorSystems).map(([key, value]: any) => <button key={key} onClick={() => setStyle(key)} className={`rounded-2xl border p-3 text-left ${style === key ? "border-cyan bg-cyan/10" : "border-white/10 bg-white/[.05]"}`}><div className="h-10 rounded-xl" style={{ background: value.palette.gradient.hero }} /><p className="mt-2 text-xs font-black">{value.name}</p></button>)}</div></div>
    <Card className="p-6"><p className="text-xs font-black uppercase tracking-[.22em] text-white/35">Story plan</p><div className="mt-5 grid gap-4">{storyPlan.map((step, i) => <div key={step.label} className="rounded-2xl border border-white/10 bg-white/[.05] p-4"><span className="text-xs font-black text-cyan">0{i+1}</span><h3 className="mt-2 font-black">{step.label}</h3><p className="mt-1 text-sm leading-6 text-white/50">{step.text}</p></div>)}</div><div className="mt-6"><p className="text-xs font-black uppercase tracking-[.18em] text-white/35">Template</p><div className="mt-3 grid gap-2">{premiumTemplates.map((t) => <button key={t.slug} onClick={() => setTemplate(t.slug)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold ${template === t.slug ? "border-cyan bg-cyan/10" : "border-white/10 bg-white/[.04]"}`}>{t.name}</button>)}</div></div></Card>
  </div></div>;
}
