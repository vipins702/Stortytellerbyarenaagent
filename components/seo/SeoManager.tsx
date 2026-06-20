"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";

type Page = { id: string; title: string; path: string; seo: any };
type Website = { id: string; name: string; slug: string; industry?: string | null };

export function SeoManager({ website, page }: { website: Website; page: Page }) {
  const router = useRouter();
  const seo = page.seo || {};
  const [title, setTitle] = useState(seo.title || website.name);
  const [description, setDescription] = useState(seo.description || `Official website for ${website.name}.`);
  const [keywords, setKeywords] = useState((seo.keywords || []).join(", "));
  const [canonical, setCanonical] = useState(seo.canonical || `/s/${website.slug}`);
  const [ogImage, setOgImage] = useState(seo.ogImage || "");
  const [noIndex, setNoIndex] = useState(Boolean(seo.noIndex));
  const [structuredDataType, setStructuredDataType] = useState(seo.structuredDataType || "WebSite");
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  const score = Math.min(100, Math.round((title.length >= 25 && title.length <= 60 ? 25 : 10) + (description.length >= 80 && description.length <= 160 ? 35 : 15) + (keywords.split(",").filter(Boolean).length >= 4 ? 20 : 8) + (canonical ? 10 : 0) + (ogImage ? 10 : 3)));

  async function save() {
    setStatus("Saving search settings…");
    const res = await fetch(`/api/pages/${page.id}/seo`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, keywords: keywords.split(",").map((k: string) => k.trim()).filter(Boolean), canonical, ogImage, noIndex, structuredDataType })
    });
    const json = await res.json();
    if (!res.ok) return setStatus(json.error || "Unable to save search settings");
    setStatus("Search settings saved.");
    router.refresh();
  }

  async function suggest() {
    setStatus("Preparing refined keyword ideas…");
    const res = await fetch("/api/seo/suggest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ business: website.name, industry: website.industry || "premium brand", audience: "high-intent buyers" }) });
    const json = await res.json();
    if (!res.ok) return setStatus(json.error || "Unable to prepare suggestions");
    setTitle(json.data.title || title);
    setDescription(json.data.description || description);
    setKeywords((json.data.keywords || []).join(", "));
    setStatus("Suggestions applied. Review and save.");
  }

  return <div><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Search Presence</h1><p className="mt-2 text-charcoal/60">Refine titles, descriptions, keywords and structured data for stronger discovery.</p></div><div className="flex gap-2"><Button variant="light" onClick={() => startTransition(suggest)}>Suggest keywords</Button><Button variant="gold" disabled={pending} onClick={() => startTransition(save)}>Save settings</Button></div></div><div className="grid gap-4 xl:grid-cols-[1fr_380px]"><Card className="p-6"><div className="grid gap-4"><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-charcoal/45">Search title</span><input value={title} onChange={e => setTitle(e.target.value)} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" maxLength={70}/><small className="text-charcoal/45">{title.length}/70 characters</small></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-charcoal/45">Meta description</span><textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-28 rounded-2xl border border-black/10 bg-white/75 px-4 py-3" maxLength={180}/><small className="text-charcoal/45">{description.length}/180 characters</small></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-charcoal/45">Keywords</span><input value={keywords} onChange={e => setKeywords(e.target.value)} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="luxury skincare, botanical serum, premium beauty"/></label><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-charcoal/45">Canonical URL</span><input value={canonical} onChange={e => setCanonical(e.target.value)} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3"/></label><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-charcoal/45">Open Graph image</span><input value={ogImage} onChange={e => setOgImage(e.target.value)} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="https://..."/></label></div><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2"><span className="text-xs font-black uppercase tracking-widest text-charcoal/45">Structured data type</span><select value={structuredDataType} onChange={e => setStructuredDataType(e.target.value)} className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3"><option>WebSite</option><option>Store</option><option>Organization</option><option>LocalBusiness</option><option>ProductCollection</option></select></label><label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/70 px-4 py-3"><input type="checkbox" checked={noIndex} onChange={e => setNoIndex(e.target.checked)}/><span className="font-bold">Hide from search engines</span></label></div></div>{status && <p className="mt-5 rounded-2xl bg-white/70 p-3 text-sm text-charcoal/60">{status}</p>}</Card><div className="grid gap-4"><Card className="p-6"><Badge>Score {score}/100</Badge><h2 className="mt-4 text-xl font-black">Search preview</h2><div className="mt-5 rounded-3xl bg-white p-5 shadow"><p className="text-sm text-green-700">{canonical}</p><h3 className="mt-1 text-xl text-blue-700">{title}</h3><p className="mt-1 text-sm text-charcoal/60">{description}</p></div></Card><Card className="p-6"><h2 className="text-xl font-black">Files created automatically</h2><div className="mt-4 grid gap-2 text-sm text-charcoal/60"><p><b>Sitemap:</b> /s/{website.slug}/sitemap.xml</p><p><b>Robots:</b> /s/{website.slug}/robots.txt</p><p><b>Public page:</b> /s/{website.slug}</p></div></Card></div></div></div>;
}
