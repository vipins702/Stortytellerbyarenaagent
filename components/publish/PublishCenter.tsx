"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";

export function PublishCenter({ website, page }: { website: any; page: any }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const seo = page?.seo || {};
  const checks = [
    ["Page title", Boolean(seo.title)],
    ["Meta description", Boolean(seo.description)],
    ["At least 3 sections", (page?.sections || []).length >= 3],
    ["Product or lead path", JSON.stringify(page?.sections || []).includes("products") || JSON.stringify(page?.sections || []).includes("lead")],
    ["Sitemap available", true],
    ["Robots available", true]
  ];
  async function publish() {
    const res = await fetch(`/api/websites/${website.id}/publish`, { method: "POST" });
    const json = await res.json();
    if (!res.ok) alert(json.error || "Publish failed");
    else { alert(`Published: ${json.url}`); router.refresh(); }
  }
  return <div><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><Badge>{website.status}</Badge><h1 className="mt-4 text-5xl font-black tracking-[-.06em]">Publish Center</h1><p className="mt-2 text-white/55">Review launch readiness, preview your page, and publish with confidence.</p></div><div className="flex gap-2"><Button variant="light" onClick={() => window.open(`/preview/${website.id}`, "_blank")}>Preview</Button><Button variant="gold" disabled={pending} onClick={() => startTransition(publish)}>Publish</Button></div></div><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><Card className="p-6"><h2 className="text-xl font-black">Launch checklist</h2><div className="mt-5 grid gap-3">{checks.map(([label, ok]) => <div key={String(label)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.05] p-4"><span className="font-bold">{label}</span><span className={`rounded-full px-3 py-1 text-xs font-black ${ok ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"}`}>{ok ? "Ready" : "Needs work"}</span></div>)}</div></Card><Card className="p-6"><h2 className="text-xl font-black">URLs</h2><div className="mt-4 grid gap-3 text-sm text-white/60"><p><b>Draft:</b><br/>/preview/{website.id}</p><p><b>Published:</b><br/>/s/{website.slug}</p><p><b>Sitemap:</b><br/>/s/{website.slug}/sitemap.xml</p><p><b>Robots:</b><br/>/s/{website.slug}/robots.txt</p></div></Card></div></div>;
}
