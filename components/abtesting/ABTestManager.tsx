"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Badge, Card } from "@/components/ui/Card";

export function ABTestManager({ websites, tests }: { websites: any[]; tests: any[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  async function create(formData: FormData) {
    const res = await fetch("/api/ab-tests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ websiteId: formData.get("websiteId"), name: formData.get("name"), goal: formData.get("goal"), targetPath: formData.get("targetPath") }) });
    const json = await res.json();
    if (!res.ok) alert(json.error || "Unable to create test");
    router.refresh();
  }
  return <div><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">A/B Testing</h1><p className="mt-2 text-charcoal/60">Metadata-driven experiments for product and lead conversion.</p></div><Card className="mb-6 p-6"><form action={(fd) => startTransition(() => create(fd))} className="grid gap-3 md:grid-cols-4"><select name="websiteId" className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3">{websites.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}</select><input required name="name" className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Hero CTA Test"/><input name="goal" defaultValue="lead_submit" className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3"/><Button disabled={pending} variant="gold">Create test</Button><input type="hidden" name="targetPath" value="/"/></form></Card><div className="grid gap-4">{tests.map(t => <Card key={t.id} className="p-6"><div className="flex justify-between gap-4"><div><Badge>{t.status}</Badge><h2 className="mt-3 text-xl font-black">{t.name}</h2><p className="text-charcoal/55">Goal: {t.goal} · Path: {t.targetPath}</p></div><div className="text-right text-sm text-charcoal/55">{t.variants.length} variants</div></div></Card>)}</div>{tests.length===0 && <Card className="p-10 text-center text-charcoal/60">No experiments yet.</Card>}</div>;
}
