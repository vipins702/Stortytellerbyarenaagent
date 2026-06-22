import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Badge, Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { buildTemplateSections, premiumTemplates } from "@/lib/premium-templates";
import { PublishedRenderer } from "@/components/published/PublishedRenderer";

export default function TemplateDetailPage({ params }: { params: { slug: string } }) {
  const template = premiumTemplates.find((t) => t.slug === params.slug);
  if (!template) notFound();
  const sections = buildTemplateSections(template);
  const fakeWebsite = { id: `tpl-${template.slug}`, name: template.name, slug: template.slug, status: "Published" };
  return <AppShell><div className="mb-8 grid gap-6 lg:grid-cols-[.75fr_1.25fr]"><div><Badge>{template.industry}</Badge><h1 className="mt-4 text-6xl font-black leading-[.9] tracking-[-.075em]">{template.name}</h1><p className="mt-5 text-white/55">{template.description}</p><div className="mt-6 flex gap-3"><ButtonLink href={`/create?template=${template.slug}`} variant="gold">Use template</ButtonLink><ButtonLink href="/studio" variant="light">Open Studio</ButtonLink></div></div><Card className="overflow-hidden"><div className={`h-80 bg-gradient-to-br ${template.preview.gradient}`} /></Card></div><div className="mb-6"><h2 className="text-3xl font-black">Included sections</h2><div className="mt-3 flex flex-wrap gap-2">{template.sections.map((s) => <span key={s} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white/60">{s}</span>)}</div></div><Card className="overflow-hidden"><PublishedRenderer website={fakeWebsite as any} page={{ sections }} products={[]} assets={[]} /></Card></AppShell>;
}
