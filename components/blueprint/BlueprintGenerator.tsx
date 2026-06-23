"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Badge, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function BlueprintGenerator({ initialBlueprints = [] }: { initialBlueprints?: any[] }) {
  const router = useRouter();
  const [brandName, setBrandName] = useState("Luminary");
  const [productService, setProductService] = useState("The Apex smartwatch");
  const [targetAudience, setTargetAudience] = useState("premium tech buyers and founders who love cinematic product experiences");
  const [vibe, setVibe] = useState("dark luxury, neon futuristic, Apple-level precision");
  const [colors, setColors] = useState("violet #8B5CF6, cyan #22D3EE, black #05050A");
  const [blueprints, setBlueprints] = useState<any[]>(initialBlueprints);
  const [active, setActive] = useState<any>(initialBlueprints[0] || null);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  async function generate() {
    setStatus("Creative director is building the blueprint…");
    const res = await fetch("/api/blueprints", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brandName, productService, targetAudience, vibe, colors }) });
    const json = await res.json();
    if (!res.ok) { setStatus(json.error || "Blueprint failed"); return; }
    setBlueprints([json.data, ...blueprints]);
    setActive(json.data);
    setStatus("Blueprint generated. Review and build page.");
  }

  async function build() {
    if (!active) return;
    setStatus("Converting blueprint into editable page sections…");
    const res = await fetch(`/api/blueprints/${active.id}/build`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) { setStatus(json.error || "Build failed"); return; }
    setStatus("Built. Opening Studio…");
    router.push("/studio");
    router.refresh();
  }

  async function generatePromptImage(prompt: any) {
    setStatus(`Generating image: ${prompt.label || "Blueprint prompt"}`);
    const res = await fetch("/api/ai/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: prompt.prompt || prompt, filename: String(prompt.label || "blueprint-image").toLowerCase().replace(/[^a-z0-9]+/g, "-") }) });
    const json = await res.json();
    setStatus(res.ok ? `Image generated: ${json.data.url}` : json.error || "Image generation failed");
  }

  const bp = active?.blueprintJson || active?.blueprint || null;
  return <div className="mx-auto max-w-[1600px] px-5 py-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><Badge>Creative Blueprint</Badge><h1 className="mt-4 max-w-5xl text-6xl font-black leading-[.9] tracking-[-.075em]">Design the film before the page.</h1><p className="mt-5 max-w-2xl text-white/55">Generate a creative-director-grade plan: brand identity, hero video prompt, five-chapter scroll story, image prompt pack, micro-interactions and summary card.</p></div><Button variant="gold" disabled={pending} onClick={() => startTransition(generate)}>{pending ? "Generating…" : "Generate blueprint"}</Button></div><div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]"><Card className="p-6"><div className="grid gap-4"><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/35">Brand</span><input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/35">Product / Service</span><input value={productService} onChange={(e) => setProductService(e.target.value)} className="rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/35">Audience</span><textarea value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="min-h-24 rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/35">Vibe / Mood</span><input value={vibe} onChange={(e) => setVibe(e.target.value)} className="rounded-2xl px-4 py-3" /></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-white/35">Colors</span><input value={colors} onChange={(e) => setColors(e.target.value)} className="rounded-2xl px-4 py-3" /></label>{status && <p className="rounded-2xl bg-white/[.06] p-3 text-sm text-white/55">{status}</p>}<div className="mt-2 grid gap-2">{blueprints.map((item) => <button key={item.id} onClick={() => setActive(item)} className={`rounded-2xl border px-4 py-3 text-left text-sm ${active?.id === item.id ? "border-cyan bg-cyan/10" : "border-white/10 bg-white/[.04]"}`}><b>{item.brandName}</b><p className="text-white/45">{item.productService}</p></button>)}</div></div></Card><div className="grid gap-5">{bp ? <><Card className="p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><Badge>{bp.summaryCard?.awwwardsScore || "Blueprint"}</Badge><h2 className="mt-4 text-4xl font-black tracking-[-.06em]">{bp.hero?.headline || active.brandName}</h2><p className="mt-3 text-white/55">{bp.brandIdentity?.emotionalPromise}</p></div><Button variant="gold" disabled={pending} onClick={() => startTransition(build)}>Build page from blueprint</Button></div></Card><div className="grid gap-5 lg:grid-cols-2"><BlueprintPanel title="1. Brand identity" data={bp.brandIdentity} /><BlueprintPanel title="2. Loading screen" data={bp.loadingScreen} /><BlueprintPanel title="3. Navigation" data={bp.navigation} /><BlueprintPanel title="4. Hero / viral moment" data={bp.hero} /><Card className="p-6 lg:col-span-2"><h3 className="text-xl font-black">5. Five-chapter scroll narrative</h3><div className="mt-4 grid gap-3 md:grid-cols-5">{bp.scrollNarrative?.chapters?.map((chapter: any, i: number) => <div key={i} className="rounded-2xl border border-white/10 bg-white/[.05] p-4"><span className="text-xs font-black text-cyan">0{i+1}</span><h4 className="mt-2 font-black">{chapter.headline}</h4><p className="mt-2 text-xs text-white/50">{chapter.bodyCopy}</p><p className="mt-3 text-[10px] uppercase tracking-widest text-white/30">{chapter.scrollTrigger}</p></div>)}</div></Card><BlueprintPanel title="6. Product display" data={bp.productDisplay} /><BlueprintPanel title="7. Lead capture" data={bp.leadCapture} /><BlueprintPanel title="8. Social proof" data={bp.socialProof} /><BlueprintPanel title="9. Footer" data={bp.footer} /><BlueprintPanel title="10. Micro-interactions" data={bp.microInteractions} /><Card className="p-6"><h3 className="text-xl font-black">12. Summary card</h3><div className="mt-4 grid gap-2 text-sm">{Object.entries(bp.summaryCard || {}).map(([k,v]) => <div key={k} className="flex justify-between gap-4 border-b border-white/10 py-2"><span className="text-white/40">{k}</span><b className="text-right text-white/75">{String(v)}</b></div>)}</div></Card><Card className="p-6 lg:col-span-2"><h3 className="text-xl font-black">11. AI image generation prompts</h3><div className="mt-4 grid gap-3 md:grid-cols-3">{bp.imagePromptPack?.map((prompt: any, i: number) => <div key={i} className="rounded-2xl border border-white/10 bg-black/25 p-4"><b className="text-sm">{prompt.label}</b><p className="mt-2 line-clamp-5 text-xs text-white/50">{prompt.prompt}</p><button onClick={() => startTransition(() => generatePromptImage(prompt))} className="mt-3 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-black hover:bg-white/15">Generate image</button></div>)}</div></Card></div></> : <Card className="grid min-h-[560px] place-items-center p-10 text-center text-white/50">Generate a blueprint to see the full creative direction.</Card>}</div></div></div>;
}


function BlueprintPanel({ title, data }: { title: string; data: any }) {
  return <Card className="p-6"><h3 className="text-xl font-black">{title}</h3><pre className="mt-4 max-h-80 overflow-auto rounded-2xl bg-black/40 p-4 text-xs leading-5 text-white/65">{JSON.stringify(data || {}, null, 2)}</pre></Card>;
}
