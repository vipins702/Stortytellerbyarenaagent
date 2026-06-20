export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { Badge, Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

export default async function TemplatesPage() {
  const templates = await prisma.template.findMany({ orderBy: [{ isPremium: "desc" }, { name: "asc" }] });
  return <AppShell><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Template Gallery</h1><p className="mt-2 text-charcoal/60">DB-managed premium templates. Seed or create records via API/admin.</p></div><ButtonLink href="/builder" variant="gold">Smart select with AI</ButtonLink></div>{templates.length === 0 ? <Card className="p-10 text-center"><h2 className="font-serif text-4xl font-black tracking-[-.05em]">No templates in database</h2><p className="mt-3 text-charcoal/60">Run the Prisma seed script to load premium metadata-driven templates.</p></Card> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{templates.map((t) => <Card key={t.id} className="overflow-hidden"><div className="shimmer h-48 bg-gradient-to-br from-charcoal via-[#4a3817] to-gold"/><div className="p-6"><Badge>{t.industry}</Badge><h2 className="mt-4 text-xl font-black">{t.name}</h2><p className="mt-2 leading-7 text-charcoal/60">{t.description}</p><ButtonLink href="/builder" variant="light" className="mt-5">Use template</ButtonLink></div></Card>)}</div>}</AppShell>;
}
