"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Maximize2, Minimize2, Plus, Save, Sparkles, Trash2 } from "lucide-react";
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
type Asset = { id: string; url: string; filename: string; type: string; metadata?: any };
type GenerationJob = { id: string; type: string; prompt: string; status: string; currentStep?: string | null; error?: string | null; result?: any; createdAt: string; steps?: any[]; assets?: { asset: Asset }[] };

type Props = {
  website: { id: string; name: string; slug: string; theme: any };
  page: { id: string; title: string; sections: BuilderSection[] };
  products: Product[];
  assets: Asset[];
  definitions: Definition[];
};

function localId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function VisualBuilder({ website, page, products, assets, definitions }: Props) {
  const [sections, setSections] = useState<BuilderSection[]>(page.sections || []);
  const [siteName, setSiteName] = useState(website.name);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("Saved from database");
  const [localAssets, setLocalAssets] = useState<Asset[]>(assets || []);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [activeJob, setActiveJob] = useState<GenerationJob | null>(null);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);
  const [panelsCompact, setPanelsCompact] = useState(true);

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
  async function loadJobs() {
    const res = await fetch(`/api/generation-jobs?websiteId=${website.id}`);
    const json = await res.json();
    if (res.ok) setJobs(json.data);
  }
  async function createJob(type: string, prompt: string, metadata: Record<string, unknown> = {}) {
    const res = await fetch("/api/generation-jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ websiteId: website.id, type, prompt, metadata }) });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Unable to create generation job");
    return json.data as GenerationJob;
  }
  function watchJob(jobId: string) {
    const source = new EventSource(`/api/generation-jobs/${jobId}/stream`);
    source.addEventListener("progress", (event) => {
      const job = JSON.parse((event as MessageEvent).data) as GenerationJob;
      setActiveJob(job);
      setStatus(`${job.type} generation: ${job.status}${job.currentStep ? ` · ${job.currentStep}` : ""}`);
    });
    source.addEventListener("done", () => { source.close(); loadJobs().catch(() => null); });
    source.addEventListener("error", () => { source.close(); loadJobs().catch(() => null); });
    return source;
  }
  useEffect(() => { loadJobs().catch(() => null); }, [website.id]);
  async function retryJob(jobId: string) {
    setStatus("Retrying generation checkpoint…");
    const res = await fetch(`/api/generation-jobs/${jobId}/retry`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) { setStatus(json.error || "Retry failed"); await loadJobs(); return; }
    if (json.data?.sections) {
      setSections(json.data.sections);
      setSiteName(json.data.name || siteName);
      setStatus("Generation retry completed. Review and save.");
    }
    if (json.data?.asset) {
      setLocalAssets((current) => [json.data.asset, ...current]);
      setStatus("Image retry completed and saved to assets.");
    }
    await loadJobs();
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
    if (res.ok) { setLocalAssets((current) => [json.data, ...current]); setStatus(`Uploaded to Blob: ${json.data.filename}`); } else setStatus(json.error || "Upload failed");
  }
  async function generateHeroImage() {
    const imagePrompt = window.prompt("Describe the premium image asset", `Luxury editorial hero image for ${siteName}`);
    if (!imagePrompt) return;
    setStatus("Generating image with Gemini and saving to Vercel Blob…");
    const job = await createJob("image", imagePrompt, { source: "builder-image" });
    const stream = watchJob(job.id);
    const res = await fetch("/api/ai/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: imagePrompt, websiteId: website.id, jobId: job.id }) });
    const json = await res.json();
    stream.close();
    if (res.ok) { if (json.data.asset) setLocalAssets((current) => [json.data.asset, ...current]); setStatus(`Image saved: ${json.data.url}`); await loadJobs(); } else { setStatus(json.error || "Image generation failed"); await loadJobs(); }
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
  function openPreview() {
    window.open(`/preview/${website.id}`, "_blank", "noopener,noreferrer");
  }
  async function publish() {
    setStatus("Publishing…");
    const res = await fetch(`/api/websites/${website.id}/publish`, { method: "POST" });
    const json = await res.json();
    setStatus(res.ok ? `Published v${json.version}: ${json.url}` : "Publish failed");
  }
  async function generate() {
    setStatus("Generating via API…");
    const job = await createJob("website", aiPrompt, { industry: "Luxury retail", source: "builder-site" });
    const stream = watchJob(job.id);
    const res = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: aiPrompt, industry: "Luxury retail", websiteId: website.id, jobId: job.id }) });
    const json = await res.json();
    stream.close();
    if (!res.ok) { setStatus(json.error || "AI failed"); await loadJobs(); return; }
    setSections(json.data.sections);
    setSiteName(json.data.name);
    setAiOpen(false);
    setStatus("AI generated sections. Save to persist.");
    await loadJobs();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Visual Builder</h1><p className="mt-2 text-charcoal/60">DB-backed page: /{website.slug}. Status: {status}</p></div>
        <div className="flex flex-wrap gap-2"><Button variant="light" onClick={() => startTransition(exportCode)}>Export code</Button><Button variant="light" onClick={() => startTransition(save)} disabled={isPending}><Save className="h-4 w-4" /> Save</Button><Button variant="light" onClick={openPreview}>Preview tab</Button><Button variant="light" onClick={() => setPanelsCompact(!panelsCompact)}>{panelsCompact ? "Panels" : "Compact"}</Button><Button variant="gold" onClick={() => setAiOpen(true)}><Sparkles className="h-4 w-4" /> AI generate</Button><Button variant="dark" onClick={() => startTransition(publish)}>Publish</Button></div>
      </div>
      <div className={`grid gap-4 ${panelsCompact ? "xl:grid-cols-[88px_minmax(0,1fr)_88px]" : "xl:grid-cols-[280px_minmax(0,1fr)_290px]"}`}>
        <Card className="p-3"><h2 className={`${panelsCompact ? "sr-only" : "mb-4"} font-black`}>Component metadata</h2><div className="grid gap-2">{definitions.map((item) => <button title={item.label} key={item.type} draggable onDragStart={(e) => e.dataTransfer.setData("section", item.type)} onClick={() => add(item.type)} className="rounded-3xl border border-black/10 bg-white/70 p-4 text-left transition hover:border-gold/50"><b>{panelsCompact ? item.label.slice(0,1) : item.label}</b>{!panelsCompact && <><p className="mt-1 text-sm text-charcoal/55">{item.description}</p><p className="mt-2 text-[11px] font-black uppercase tracking-widest text-gold">{item.category || "Section"}</p></>}</button>)}</div></Card>
        <Card className={`${previewFullscreen ? "fixed inset-4 z-[90] overflow-auto" : "min-h-[760px] overflow-hidden"} p-0`}>
          <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#070710]/95 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500"/><span className="h-3 w-3 rounded-full bg-yellow-400"/><span className="h-3 w-3 rounded-full bg-green-500"/><span className="ml-3 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-bold text-white/45">Live React Preview</span></div>
            <div className="flex items-center gap-3 text-xs font-bold text-white/45"><span>Desktop</span><span>•</span><span>{sections.length} sections</span><button onClick={() => setPreviewFullscreen(!previewFullscreen)} className="ml-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-white hover:bg-white/15">{previewFullscreen ? <Minimize2 className="h-3 w-3"/> : <Maximize2 className="h-3 w-3"/>}{previewFullscreen ? "Exit" : "Fullscreen"}</button></div>
          </div>
          <div className="bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,.12),transparent_35%)] p-4">
            <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => add(e.dataTransfer.getData("section") || "hero")} className="min-h-[700px] overflow-hidden rounded-[28px] border border-white/10 bg-[#070710] p-3 shadow-2xl">
              {sections.length === 0 && <div className="rounded-3xl border border-dashed border-violet/50 bg-violet/10 p-8 text-center font-bold text-violet-200">No sections yet. Add from metadata library.</div>}
              {sections.map((section, index) => <CanvasSection key={section.id} section={section} index={index} update={update} remove={remove} move={move} products={products} assets={localAssets} />)}
              <div className="mt-3 rounded-3xl border border-dashed border-violet/50 bg-violet/10 p-5 text-center text-sm font-bold text-violet-200">Drop another section here</div>
            </div>
          </div>
        </Card>
        <Card className="p-3"><h2 className={`${panelsCompact ? "sr-only" : "mb-4"} font-black`}>Website metadata</h2>{panelsCompact && <div className="grid gap-2"><button title="Theme" className="rounded-2xl border border-white/10 bg-white/10 p-3 text-lg">◐</button><button title="Assets" className="rounded-2xl border border-white/10 bg-white/10 p-3 text-lg">▣</button><button title="Jobs" className="rounded-2xl border border-white/10 bg-white/10 p-3 text-lg">↻</button></div>}{!panelsCompact && <><label className="text-xs font-black uppercase tracking-widest text-charcoal/45">Website name</label><input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="mt-2 w-full rounded-2xl border border-black/10 bg-white/75 px-4 py-3" /><div className="mt-5"><p className="text-xs font-black uppercase tracking-widest text-charcoal/45">Theme from DB</p><pre className="mt-3 max-h-44 overflow-auto rounded-2xl bg-charcoal p-4 text-xs text-cream">{JSON.stringify(website.theme, null, 2)}</pre></div><div className="mt-5 rounded-3xl border border-black/10 bg-white/65 p-4"><b>Vercel Blob assets</b><p className="mt-2 text-sm text-charcoal/55">Upload images or GLB/GLTF models. Files are stored in Vercel Blob and indexed in DB.</p><input className="mt-3 text-sm" type="file" accept="image/*,video/mp4,video/webm,.glb,.gltf" onChange={(e) => e.target.files?.[0] && startTransition(() => uploadAsset(e.target.files![0], "builder"))} /><Button className="mt-3 w-full" variant="light" onClick={() => startTransition(generateHeroImage)}>Generate image with Gemini</Button></div><ActiveGenerationProgress job={activeJob} /><GenerationHistory jobs={jobs} onRetry={(id) => startTransition(() => retryJob(id))} /></>}</Card>
      </div>
      {aiOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-xl"><Card className="w-full max-w-2xl p-6"><div className="flex justify-between gap-4"><h2 className="font-serif text-4xl font-black tracking-[-.04em]">AI Website Generator</h2><Button variant="ghost" onClick={() => setAiOpen(false)}>Close</Button></div><textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} rows={5} placeholder="Example: Build a cinematic scroll story page for a luxury smartwatch named The Apex. Include hero, video story, product cards, lead capture and dark violet-cyan style." className="mt-5 w-full rounded-3xl border border-black/10 bg-white/75 p-4" /><div className="mt-3 rounded-2xl border border-white/10 bg-white/[.06] p-4 text-sm text-white/60"><b className="text-white">How to generate:</b><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Describe brand, product and audience.</li><li>Mention sections you want: hero, scroll story, products, lead form.</li><li>Add visual style: dark cinematic, violet-cyan, luxury tech.</li><li>Click Generate website, then review and Save.</li></ol></div><p className="mt-3 text-sm text-charcoal/55">Generation returns editable section metadata that can be saved to your page.</p><div className="mt-4 rounded-3xl border border-black/10 bg-white/60 p-4"><b>Convert a scene or screenshot</b><p className="mt-1 text-sm text-charcoal/55">Upload a reference image and turn it into editable sections.</p><input className="mt-3 text-sm" type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && startTransition(() => generateFromScene(e.target.files![0]))} /></div><Button className="mt-5" variant="gold" disabled={isPending} onClick={() => startTransition(generate)}>{isPending ? "Working…" : "Generate website"}</Button></Card></div>}
    </div>
  );
}

function CanvasSection({ section, index, update, remove, move, products, assets }: { section: BuilderSection; index: number; update: (id: string, props: Record<string, any>) => void; remove: (id: string) => void; move: (index: number, dir: -1 | 1) => void; products: Product[]; assets: Asset[] }) {
  return <section className="group relative mb-3 overflow-hidden rounded-[24px] border border-black/10 bg-white"><div className="absolute right-3 top-3 z-10 hidden gap-1 group-hover:flex"><Button className="h-8 w-8 p-0" variant="dark" onClick={() => move(index, -1)}><ArrowUp className="h-3 w-3" /></Button><Button className="h-8 w-8 p-0" variant="dark" onClick={() => move(index, 1)}><ArrowDown className="h-3 w-3" /></Button><Button className="h-8 w-8 p-0" variant="dark" onClick={() => remove(section.id)}><Trash2 className="h-3 w-3" /></Button></div><SectionPreview section={section} update={update} products={products} assets={assets} /></section>;
}

function Editable({ value, onSave, className }: { value: string; onSave: (value: string) => void; className?: string }) {
  return <div contentEditable suppressContentEditableWarning onBlur={(e) => onSave(e.currentTarget.innerText)} className={className}>{value}</div>;
}

function SectionPreview({ section, update, products, assets }: { section: BuilderSection; update: (id: string, props: Record<string, any>) => void; products: Product[]; assets: Asset[] }) {
  const p = section.props || {};
  if (section.type === "products") return <div className="p-10"><Editable value={p.title || "Featured products"} onSave={(title) => update(section.id, { title })} className="font-serif text-4xl font-black tracking-[-.04em]" /><div className="mt-6 grid gap-4 md:grid-cols-3">{products.slice(0, p.limit || 3).map((product) => <div key={product.id} className="rounded-3xl border border-black/10 p-4"><div className="shimmer mb-4 h-28 rounded-2xl bg-gradient-to-br from-charcoal to-gold" /><b>{product.name}</b><p className="text-sm text-charcoal/55">${(product.price / 100).toFixed(2)} · {product.stock} in stock</p></div>)}</div>{products.length === 0 && <p className="mt-4 text-charcoal/55">No DB products yet. Add products in CMS.</p>}</div>;
  if (section.type === "gallery") return <GalleryEditor section={section} props={p} assets={assets} update={update} />;
  if (section.type === "scrollStory") return <ScrollStoryEditor section={section} props={p} assets={assets} update={update} />;
  if (section.type === "model3d") return <Model3DEditor section={section} props={p} assets={assets} update={update} />;
  if (["hero3D", "bentoGrid", "marquee", "testimonials", "comparison", "horizontalScroll", "stats", "process", "pricing", "faq", "portfolioGrid", "team", "ctaFullscreen", "footer"].includes(section.type)) return <PremiumSectionEditor section={section} props={p} update={update} />;
  if (section.type === "lead") return <div className="bg-charcoal p-10 text-white"><Badge>Lead API</Badge><h2 className="mt-4 font-serif text-4xl font-black tracking-[-.04em]">{p.title || "Join the private list"}</h2><div className="mt-6 flex max-w-xl gap-2"><input className="min-w-0 flex-1 rounded-full px-5 py-3 text-charcoal" placeholder={p.placeholder || "email@brand.com"}/><Button variant="gold"><Plus className="h-4 w-4" /> Subscribe</Button></div></div>;
  if (section.type === "features") return <div className="p-10"><Editable value={p.title || "Features"} onSave={(title) => update(section.id, { title })} className="font-serif text-4xl font-black tracking-[-.04em]" /><div className="mt-6 grid gap-4 md:grid-cols-3">{(p.items || []).map((f: any, i: number) => <div key={i} className="rounded-3xl border border-black/10 bg-white p-5"><b>{f.title}</b><p className="mt-2 text-sm text-charcoal/55">{f.body}</p></div>)}</div></div>;
  return <HeroEditor section={section} props={p} assets={assets} update={update} />;
}

function ScrollStoryEditor({ section, props, assets, update }: { section: BuilderSection; props: Record<string, any>; assets: Asset[]; update: (id: string, props: Record<string, any>) => void }) {
  const mediaAssets = assets.filter((asset) => asset.type.startsWith("image/") || asset.type.startsWith("video/"));
  const chapters = Array.isArray(props.chapters) && props.chapters.length ? props.chapters : [
    { title: "Opening moment", body: "Introduce the world, mood and promise." },
    { title: "Craft and detail", body: "Show what makes the offer valuable." },
    { title: "Invitation", body: "End with a clear next step." }
  ];
  function updateChapter(index: number, key: "title" | "body", value: string) {
    update(section.id, { chapters: chapters.map((chapter: any, i: number) => i === index ? { ...chapter, [key]: value } : chapter) });
  }
  function addChapter() {
    update(section.id, { chapters: [...chapters, { title: "New chapter", body: "Describe this moment in the story." }] });
  }
  function removeChapter(index: number) {
    update(section.id, { chapters: chapters.filter((_: any, i: number) => i !== index) });
  }
  function chooseAsset(asset: Asset) {
    update(section.id, { mediaUrl: asset.url, mediaType: asset.type.startsWith("video/") ? "video" : "image", mediaAssetId: asset.id });
  }
  return <div className="bg-charcoal p-6 text-white">
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <div className="grid gap-6 md:grid-cols-[.9fr_1.1fr]">
        <div>
          <Badge>Scroll story editor</Badge>
          <Editable value={props.title || "A journey told in motion"} onSave={(title) => update(section.id, { title })} className="mt-4 font-serif text-5xl font-black tracking-[-.05em]" />
          <Editable value={props.body || "Guide visitors through a polished sequence of visuals and narrative details."} onSave={(body) => update(section.id, { body })} className="mt-4 leading-8 text-white/65" />
          <button onClick={addChapter} className="mt-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold">Add chapter</button>
          <div className="mt-5 grid gap-3">{chapters.map((chapter: any, i: number) => <div key={i} className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <div className="flex items-center justify-between gap-3"><b>Chapter {i + 1}</b><button onClick={() => removeChapter(i)} className="text-xs font-bold text-white/50">Remove</button></div>
            <input value={chapter.title || ""} onChange={(e) => updateChapter(i, "title", e.target.value)} className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" placeholder="Chapter title" />
            <textarea value={chapter.body || ""} onChange={(e) => updateChapter(i, "body", e.target.value)} className="mt-2 min-h-20 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" placeholder="Chapter body" />
          </div>)}</div>
        </div>
        <div className="sticky top-24 grid h-[520px] place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-gold/40 to-white/10">
          {props.mediaUrl ? (props.mediaType === "video" ? <video src={props.mediaUrl} className="h-full w-full object-cover" muted controls playsInline /> : <img src={props.mediaUrl} alt={props.title || "Story media"} className="h-full w-full object-cover" />) : <><span className="text-7xl">◌</span><p className="absolute bottom-5 text-sm text-white/60">Choose an image or video from assets</p></>}
        </div>
      </div>
      <aside className="rounded-[2rem] border border-white/10 bg-white/10 p-4">
        <h3 className="font-black">Story media</h3>
        <p className="mt-1 text-sm text-white/55">Pick an uploaded or generated image/video. Upload new media from the right builder panel or Asset Library.</p>
        <div className="mt-4 grid max-h-[560px] gap-3 overflow-auto pr-1">{mediaAssets.map((asset) => <button key={asset.id} onClick={() => chooseAsset(asset)} className={`overflow-hidden rounded-2xl border text-left transition ${props.mediaAssetId === asset.id ? "border-gold bg-gold/10" : "border-white/10 bg-black/15 hover:border-white/30"}`}>
          <div className="h-28 bg-black/30">{asset.type.startsWith("video/") ? <video src={asset.url} className="h-full w-full object-cover" muted playsInline /> : <img src={asset.url} alt={asset.filename} className="h-full w-full object-cover" />}</div>
          <div className="p-3"><b className="block truncate text-sm">{asset.filename}</b><span className="text-xs text-white/45">{asset.type.startsWith("video/") ? "Video" : "Image"}</span></div>
        </button>)}</div>
        {!mediaAssets.length && <p className="mt-4 rounded-2xl bg-black/20 p-4 text-sm text-white/55">No image or video assets yet. Upload one from the builder panel.</p>}
      </aside>
    </div>
  </div>;
}



function SmallAssetPicker({ assets, activeUrl, onPick, accept = "image" }: { assets: Asset[]; activeUrl?: string; onPick: (asset: Asset) => void; accept?: "image" | "model" | "all" }) {
  const filtered = assets.filter((asset) => accept === "all" || (accept === "image" ? asset.type.startsWith("image/") : asset.filename.match(/\.(glb|gltf)$/i) || asset.type.includes("gltf")));
  return <div className="mt-4 grid max-h-48 gap-2 overflow-auto rounded-2xl border border-black/10 bg-white/50 p-2 md:grid-cols-2">{filtered.map((asset) => <button key={asset.id} type="button" onClick={() => onPick(asset)} className={`overflow-hidden rounded-xl border text-left ${activeUrl === asset.url ? "border-gold" : "border-black/10"}`}>{asset.type.startsWith("image/") ? <img src={asset.url} alt={asset.filename} className="h-20 w-full object-cover"/> : <div className="grid h-20 place-items-center bg-charcoal text-white">◈</div>}<span className="block truncate p-2 text-xs">{asset.filename}</span></button>)}{!filtered.length && <p className="p-3 text-sm text-charcoal/50">No matching assets yet.</p>}</div>;
}

function HeroEditor({ section, props, assets, update }: { section: BuilderSection; props: Record<string, any>; assets: Asset[]; update: (id: string, props: Record<string, any>) => void }) {
  return <div className="grid gap-8 bg-gradient-to-br from-white to-[#f6ead5] p-12 lg:grid-cols-[1fr_360px]"><div><Badge>{props.eyebrow || "Launch page"}</Badge><Editable value={props.title || "Premium website"} onSave={(title) => update(section.id, { title })} className="mt-6 max-w-2xl font-serif text-6xl font-black leading-[.92] tracking-[-.06em]" /><Editable value={props.body || "Edit this premium copy inline."} onSave={(body) => update(section.id, { body })} className="mt-5 max-w-2xl text-lg leading-8 text-charcoal/60" /><Button className="mt-7" variant="gold">{props.cta || "Explore"}</Button></div><div><div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/70 p-3">{props.imageUrl ? <img src={props.imageUrl} alt="Hero" className="h-64 w-full rounded-[1.5rem] object-cover"/> : <div className="grid h-64 place-items-center rounded-[1.5rem] bg-gradient-to-br from-gold/30 to-white"><span className="text-5xl">✦</span></div>}</div><SmallAssetPicker assets={assets} activeUrl={props.imageUrl} onPick={(asset) => update(section.id, { imageUrl: asset.url, imageAssetId: asset.id })} /></div></div>;
}

function Model3DEditor({ section, props, assets, update }: { section: BuilderSection; props: Record<string, any>; assets: Asset[]; update: (id: string, props: Record<string, any>) => void }) {
  return <div className="grid gap-8 bg-gradient-to-br from-white to-[#f6ead5] p-10 md:grid-cols-2 md:items-start"><div><Badge>3D showcase</Badge><Editable value={props.title || "Explore every detail"} onSave={(title) => update(section.id, { title })} className="mt-4 font-serif text-5xl font-black tracking-[-.05em]" /><Editable value={props.body || "A closer look at the craftsmanship, materials and form."} onSave={(body) => update(section.id, { body })} className="mt-4 leading-8 text-charcoal/60" /><div className="mt-5 grid gap-3 rounded-3xl border border-black/10 bg-white/60 p-4"><label className="text-sm font-bold">Scale <input type="range" min="0.5" max="3" step="0.1" value={props.scale || 1.6} onChange={(e) => update(section.id, { scale: Number(e.target.value) })} className="w-full" /></label><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={props.autoRotate !== false} onChange={(e) => update(section.id, { autoRotate: e.target.checked })}/> Auto rotate</label><select value={props.environment || "city"} onChange={(e) => update(section.id, { environment: e.target.value })} className="rounded-xl border border-black/10 bg-white px-3 py-2"><option>city</option><option>studio</option><option>sunset</option><option>warehouse</option></select></div><SmallAssetPicker assets={assets} accept="model" activeUrl={props.assetUrl} onPick={(asset) => update(section.id, { assetUrl: asset.url, assetId: asset.id })} /></div><div className="relative grid h-96 place-items-center overflow-hidden rounded-[2rem] border border-black/10 bg-charcoal text-white shadow-luxury"><div className="absolute h-44 w-44 rounded-full bg-gold/30 blur-2xl"/><span className="relative text-7xl">◈</span><p className="absolute bottom-5 text-sm text-white/60">{props.assetUrl ? "Model selected" : "Choose GLB/GLTF asset"}</p></div></div>;
}


function GalleryEditor({ section, props, assets, update }: { section: BuilderSection; props: Record<string, any>; assets: Asset[]; update: (id: string, props: Record<string, any>) => void }) {
  const images: string[] = Array.isArray(props.images) ? props.images : [];
  const imageAssets = assets.filter((asset) => asset.type.startsWith("image/"));
  function toggle(asset: Asset) {
    update(section.id, { images: images.includes(asset.url) ? images.filter((url) => url !== asset.url) : [...images, asset.url].slice(0, 6) });
  }
  return <div className="p-10"><Editable value={props.title || "Editorial gallery"} onSave={(title) => update(section.id, { title })} className="font-serif text-4xl font-black tracking-[-.04em]" /><div className="mt-6 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">{[0,1,2].map((i) => images[i] ? <img key={i} src={images[i]} alt="Gallery" className="h-64 rounded-3xl object-cover"/> : <div key={i} className="shimmer h-64 rounded-3xl bg-gradient-to-br from-[#eadfc9] to-gold" />)}</div><div className="mt-5 rounded-3xl border border-black/10 bg-white/60 p-4"><b>Gallery images</b><div className="mt-3 grid max-h-56 gap-2 overflow-auto md:grid-cols-4">{imageAssets.map((asset) => <button key={asset.id} onClick={() => toggle(asset)} className={`overflow-hidden rounded-2xl border ${images.includes(asset.url) ? "border-gold" : "border-black/10"}`}><img src={asset.url} alt={asset.filename} className="h-20 w-full object-cover"/><span className="block truncate p-2 text-xs">{asset.filename}</span></button>)}</div></div></div>;
}


function GenerationHistory({ jobs, onRetry }: { jobs: GenerationJob[]; onRetry: (id: string) => void }) {
  return <div className="mt-5 rounded-3xl border border-black/10 bg-white/65 p-4"><div className="flex items-center justify-between gap-3"><b>Generation checkpoints</b><span className="text-xs font-bold text-charcoal/45">{jobs.length}</span></div><p className="mt-1 text-sm text-charcoal/55">Failed jobs keep completed steps and saved assets. Retry resumes from the recorded prompt.</p><div className="mt-3 grid max-h-80 gap-2 overflow-auto">{jobs.map((job) => <div key={job.id} className="rounded-2xl border border-black/10 bg-white/75 p-3"><div className="flex items-center justify-between gap-2"><b className="truncate text-sm">{job.type}</b><span className={`rounded-full px-2 py-1 text-[10px] font-black ${job.status === "Completed" ? "bg-green-100 text-green-700" : job.status === "Failed" ? "bg-red-100 text-red-700" : "bg-gold/20 text-[#765813]"}`}>{job.status}</span></div><p className="mt-1 line-clamp-2 text-xs text-charcoal/55">{job.prompt}</p>{job.currentStep && <p className="mt-1 text-[11px] text-charcoal/40">Step: {job.currentStep}</p>}{job.error && <p className="mt-1 text-[11px] text-red-700">{job.error}</p>}<div className="mt-2 flex items-center justify-between"><span className="text-[11px] text-charcoal/40">{job.steps?.length || 0} steps · {job.assets?.length || 0} assets</span>{job.status === "Failed" && <button onClick={() => onRetry(job.id)} className="rounded-full bg-charcoal px-3 py-1 text-xs font-bold text-white">Retry</button>}</div></div>)}</div>{!jobs.length && <p className="mt-3 rounded-2xl bg-white/60 p-3 text-sm text-charcoal/50">No generation jobs yet.</p>}</div>;
}


function ActiveGenerationProgress({ job }: { job: GenerationJob | null }) {
  if (!job || ["Completed", "Failed"].includes(job.status)) return null;
  const completed = job.steps?.filter((step) => step.status === "Completed").length || 0;
  const total = Math.max(job.steps?.length || 1, 1);
  return <div className="mt-5 rounded-3xl border border-gold/30 bg-gold/10 p-4"><div className="flex items-center justify-between"><b>Live progress</b><span className="text-xs font-black text-[#765813]">{job.status}</span></div><p className="mt-1 text-sm text-charcoal/60">{job.currentStep || "Starting"}</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full bg-gold transition-all" style={{ width: `${Math.round((completed / total) * 100)}%` }} /></div><p className="mt-2 text-xs text-charcoal/45">{completed}/{total} completed steps</p></div>;
}


function PremiumSectionEditor({ section, props, update }: { section: BuilderSection; props: Record<string, any>; update: (id: string, props: Record<string, any>) => void }) {
  const items = props.cards || props.items || props.steps || props.plans || props.members || props.panels || props.features || [];
  return <div className="p-8"><div className="rounded-[2rem] border border-violet/30 bg-gradient-to-br from-violet/15 to-cyan/5 p-7"><Badge>{section.type}</Badge><Editable value={props.title || props.eyebrow || section.type} onSave={(title) => update(section.id, { title })} className="mt-4 text-5xl font-black leading-[.95] tracking-[-.06em] text-white" />{props.body !== undefined && <Editable value={props.body || "Describe this premium section."} onSave={(body) => update(section.id, { body })} className="mt-4 max-w-2xl leading-8 text-white/55" />}<div className="mt-6 grid gap-3 md:grid-cols-3">{(Array.isArray(items) && items.length ? items : [{ title: "Premium block", body: "This section is driven by metadata and ready for a dedicated inspector." }]).slice(0, 6).map((item: any, i: number) => <div key={item.id || i} className="rounded-2xl border border-white/10 bg-black/25 p-4"><b>{item.title || item.name || item.label || item.value || `Item ${i + 1}`}</b><p className="mt-2 text-sm text-white/50">{item.body || item.description || item.quote || item.answer || item.role || "Configured from template JSON."}</p></div>)}</div><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-white/35">Premium section schema active · dedicated controls coming next</p></div></div>;
}
