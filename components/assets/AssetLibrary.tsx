"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Asset = { id: string; url: string; filename: string; type: string; createdAt: Date };

export function AssetLibrary({ websiteId, assets }: { websiteId: string; assets: Asset[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  async function upload(file: File) {
    const form = new FormData();
    form.set("file", file);
    form.set("purpose", "library");
    const res = await fetch(`/api/websites/${websiteId}/assets`, { method: "POST", body: form });
    if (!res.ok) alert((await res.json()).error || "Upload failed");
    router.refresh();
  }
  async function generate() {
    const prompt = window.prompt("Describe a premium image asset", "Luxury editorial product scene with champagne gold lighting");
    if (!prompt) return;
    const res = await fetch("/api/ai/image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, websiteId }) });
    if (!res.ok) alert((await res.json()).error || "Image generation failed");
    router.refresh();
  }
  return <div><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Asset Library</h1><p className="mt-2 text-charcoal/60">Vercel Blob-backed images, 3D models and generated assets.</p></div><div className="flex gap-2"><label className="inline-flex cursor-pointer rounded-full bg-charcoal px-5 py-3 text-sm font-bold text-white"><input className="hidden" type="file" accept="image/*,video/mp4,video/webm,.glb,.gltf" onChange={(e) => e.target.files?.[0] && startTransition(() => upload(e.target.files![0]))}/>Upload asset</label><Button variant="gold" disabled={pending} onClick={() => startTransition(generate)}>Generate image</Button></div></div><div className="grid gap-4 md:grid-cols-3">{assets.map((asset) => <Card key={asset.id} className="overflow-hidden"><div className="grid h-48 place-items-center bg-white/60">{asset.type.startsWith("image/") ? <img src={asset.url} alt={asset.filename} className="h-full w-full object-cover"/> : asset.type.startsWith("video/") ? <video src={asset.url} className="h-full w-full object-cover" muted controls playsInline /> : <span className="text-5xl">◈</span>}</div><div className="p-5"><b>{asset.filename}</b><p className="mt-1 break-all text-xs text-charcoal/50">{asset.type}</p><a className="mt-4 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-bold" href={asset.url} target="_blank">Open</a></div></Card>)}</div>{assets.length === 0 && <Card className="p-10 text-center text-charcoal/60">No assets yet. Upload or generate your first premium visual.</Card>}</div>;
}
