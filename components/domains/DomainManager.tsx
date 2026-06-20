"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";

type Website = { id: string; name: string };
type Domain = { id: string; hostname: string; status: string; metadata: any; website: Website };

export function DomainManager({ websites, domains }: { websites: Website[]; domains: Domain[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  async function add(formData: FormData) {
    const res = await fetch("/api/domains", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ websiteId: formData.get("websiteId"), hostname: formData.get("hostname") }) });
    const json = await res.json();
    if (!res.ok) alert(json.error || "Unable to add domain");
    router.refresh();
  }
  return <div><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Custom Domains</h1><p className="mt-2 text-charcoal/60">Premium domain manager with Vercel DNS-ready metadata.</p></div><Card className="mb-6 p-6"><form action={(fd) => startTransition(() => add(fd))} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"><select name="websiteId" className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3">{websites.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select><input required name="hostname" className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="www.brand.com"/><Button disabled={pending} variant="gold">Add domain</Button></form></Card><div className="grid gap-4">{domains.map(d => <Card key={d.id} className="p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><Badge>{d.status}</Badge><h2 className="mt-3 text-xl font-black">{d.hostname}</h2><p className="text-charcoal/55">{d.website.name}</p></div><div className="rounded-2xl bg-white/70 p-4 text-sm"><b>DNS</b><p>CNAME www → cname.vercel-dns.com</p></div></div></Card>)}</div>{domains.length===0 && <Card className="p-10 text-center text-charcoal/60">No domains yet.</Card>}</div>;
}
