import { AppShell } from "@/components/AppShell";
import { Badge, Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { templates } from "@/lib/data";

export default function TemplatesPage() {
  return <AppShell><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Template Gallery</h1><p className="mt-2 text-charcoal/60">Luxury presets for industries and commerce flows.</p></div><ButtonLink href="/builder" variant="gold">Smart select with AI</ButtonLink></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{templates.map((t) => <Card key={t.name} className="overflow-hidden"><div className="shimmer h-48 bg-gradient-to-br from-charcoal via-[#4a3817] to-gold"/><div className="p-6"><Badge>{t.type}</Badge><h2 className="mt-4 text-xl font-black">{t.name}</h2><p className="mt-2 leading-7 text-charcoal/60">{t.description}</p><ButtonLink href="/builder" variant="light" className="mt-5">Use template</ButtonLink></div></Card>)}</div></AppShell>;
}
