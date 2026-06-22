"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { premiumTemplates } from "@/lib/premium-templates";
import { Button } from "@/components/ui/Button";
import { Card, Badge } from "@/components/ui/Card";

export function CreateFlow() {
  const router = useRouter();
  const [brand, setBrand] = useState("Luminary");
  const [product, setProduct] = useState("The Apex");
  const [description, setDescription] = useState("A premium product with cinematic storytelling, rich visuals and a clear conversion path.");
  const [template, setTemplate] = useState<string>(premiumTemplates[0].slug);
  const [media, setMedia] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  async function create() {
    setStatus("Creating cinematic page…");
    const selected = premiumTemplates.find((t) => t.slug === template) || premiumTemplates[0];
    const prompt = `Create a premium ${selected.industry} scroll storytelling page for brand ${brand}, product ${product}. Description: ${description}. Use ${selected.name} style with sections: ${selected.sections.join(", ")}.`;
    const res = await fetch("/api/websites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `${brand} — ${product}`, industry: selected.industry }) });
    const json = await res.json();
    if (!res.ok) { setStatus(json.error || "Unable to create website"); return; }
    const website = json.data;
    if (media) {
      const form = new FormData();
      form.set("file", media);
      form.set("purpose", "create-flow");
      await fetch(`/api/websites/${website.id}/assets`, { method: "POST", body: form }).catch(() => null);
    }
    const ai = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, industry: selected.industry, websiteId: website.id }) });
    const aiJson = await ai.json();
    if (ai.ok && website.pages?.[0]?.id && aiJson.data?.sections) {
      await fetch(`/api/pages/${website.pages[0].id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections: aiJson.data.sections }) });
    }
    setStatus("Created. Opening Studio…");
    router.push("/studio");
    router.refresh();
  }

  return <div className="mx-auto max-w-[1400px] px-5 py-10"><div className="mb-8"><Badge>Create flow</Badge><h1 className="mt-4 max-w-4xl text-6xl font-black leading-[.9] tracking-[-.075em]">Turn product media into a cinematic page.</h1><p className="mt-5 max-w-2xl text-white/55">Add brand details, upload video or images, choose a premium template and open it in Puck Studio.</p></div><div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]"><Card className="p-6"><div className="grid gap-4"><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/45">Brand name</span><input value={brand} onChange={(e) => setBrand(e.target.value)} className="rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/45">Product name</span><input value={product} onChange={(e) => setProduct(e.target.value)} className="rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/45">Product description</span><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-32 rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/45">Upload media</span><input type="file" accept="image/*,video/mp4,video/webm,.glb,.gltf" onChange={(e) => setMedia(e.target.files?.[0] || null)} /></label><Button variant="gold" disabled={pending} onClick={() => startTransition(create)}>{pending ? "Creating…" : "Generate page"}</Button>{status && <p className="text-sm text-white/55">{status}</p>}</div></Card><div className="grid gap-4 md:grid-cols-2">{premiumTemplates.map((t) => <button key={t.slug} onClick={() => setTemplate(t.slug)} className={`rounded-[2rem] border p-4 text-left transition ${template === t.slug ? "border-cyan bg-cyan/10" : "border-white/10 bg-white/[.05]"}`}><div className={`h-40 rounded-[1.5rem] bg-gradient-to-br ${t.preview.gradient}`} /><Badge className="mt-4">{t.industry}</Badge><h3 className="mt-3 text-xl font-black">{t.name}</h3><p className="mt-2 text-sm text-white/55">{t.description}</p></button>)}</div></div></div>;
}
