export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { Badge, Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { premiumTemplates } from "@/lib/premium-templates";

export default async function TemplatesPage() {
  return <AppShell><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Template Gallery</h1><p className="mt-2 text-charcoal/60">Premium metadata templates built for cinematic scroll storytelling.</p></div><ButtonLink href="/create" variant="gold">Create from media</ButtonLink></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{premiumTemplates.map((t) => <Card key={t.slug} className="overflow-hidden"><div className={`h-48 bg-gradient-to-br ${t.preview.gradient}`}/><div className="p-6"><Badge>{t.industry}</Badge><h2 className="mt-4 text-xl font-black">{t.name}</h2><p className="mt-2 leading-7 text-charcoal/60">{t.description}</p><div className="mt-4 flex flex-wrap gap-2">{t.sections.slice(0,4).map((s) => <span key={s} className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/50">{s}</span>)}</div><ButtonLink href={`/templates/${t.slug}`} variant="light" className="mt-5">View template</ButtonLink></div></Card>)}</div></AppShell>;
}
