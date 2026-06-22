"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Badge, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function LaunchHub({ data }: { data: any }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const checks = [
    ["SEO title", Boolean(data.seo?.title)],
    ["Description", Boolean(data.seo?.description)],
    ["Sections", data.sectionCount >= 3],
    ["Products or lead form", data.hasProducts || data.hasLead],
    ["Domain optional", true],
    ["Analytics ready", true]
  ];
  const score = Math.round((checks.filter(([, ok]) => ok).length / checks.length) * 100);
  async function publish() {
    const res = await fetch(`/api/websites/${data.websiteId}/publish`, { method: "POST" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) alert(json.error || "Publish failed");
    else { alert(`Published: ${json.url}`); router.refresh(); }
  }
  return <div className="mx-auto max-w-[1600px] px-5 py-8"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><Badge>Launch</Badge><h1 className="mt-4 max-w-4xl text-6xl font-black leading-[.9] tracking-[-.075em]">Ship with confidence.</h1><p className="mt-5 max-w-2xl text-white/55">One place for preview, publish, SEO, domain, analytics and storefront readiness.</p></div><div className="flex gap-2"><Button variant="light" onClick={() => window.open(`/preview/${data.websiteId}`, "_blank")}>Preview</Button><Button variant="gold" disabled={pending} onClick={() => startTransition(publish)}>Publish</Button></div></div><div className="grid gap-5 xl:grid-cols-[1fr_420px]"><Card className="p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-3xl font-black">Launch readiness</h2><p className="mt-2 text-white/50">{data.websiteName} · {data.status}</p></div><div className="grid h-28 w-28 place-items-center rounded-full border border-cyan/30 bg-cyan/10"><span className="text-3xl font-black gold-text">{score}</span></div></div><div className="mt-6 grid gap-3 md:grid-cols-2">{checks.map(([label, ok]) => <div key={String(label)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[.05] p-4"><b>{label}</b><span className={`rounded-full px-3 py-1 text-xs font-black ${ok ? "bg-green-500/20 text-green-200" : "bg-red-500/20 text-red-200"}`}>{ok ? "Ready" : "Fix"}</span></div>)}</div></Card><div className="grid gap-5"><Card className="p-6"><h2 className="text-xl font-black">Launch URLs</h2><div className="mt-4 grid gap-3 text-sm text-white/55"><p><b>Draft</b><br/>/preview/{data.websiteId}</p><p><b>Published</b><br/>/s/{data.slug}</p><p><b>Sitemap</b><br/>/s/{data.slug}/sitemap.xml</p></div></Card><Card className="p-6"><h2 className="text-xl font-black">Quick actions</h2><div className="mt-4 grid gap-2"><a className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold" href="/seo">Review SEO</a><a className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold" href="/domains">Connect domain</a><a className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold" href="/analytics">View analytics</a><a className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold" href="/cms/orders">Orders</a></div></Card></div></div></div>;
}
