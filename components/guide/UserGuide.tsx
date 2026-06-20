import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

function GuideImage({ label }: { label: string }) {
  return <svg viewBox="0 0 420 220" className="h-56 w-full rounded-[2rem] bg-gradient-to-br from-white to-[#efe0c1]" role="img" aria-label={label}><rect x="34" y="30" width="352" height="160" rx="30" fill="white" opacity=".8"/><rect x="64" y="62" width="150" height="16" rx="8" fill="#1a1a1a"/><rect x="64" y="92" width="230" height="10" rx="5" fill="#1a1a1a" opacity=".28"/><rect x="64" y="118" width="86" height="42" rx="16" fill="#D4AF37" opacity=".36"/><rect x="166" y="118" width="86" height="42" rx="16" fill="#D4AF37" opacity=".22"/><circle cx="320" cy="112" r="42" fill="#D4AF37" opacity=".28"/><path d="M300 112h40M320 92v40" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" opacity=".65"/></svg>;
}

const steps = [
  ["Create your workspace", "Start with one clear business name and an industry. This gives your site structure, tone and a useful starting point."],
  ["Shape the page", "Open the builder, add sections, adjust copy and keep the most important action visible above the fold."],
  ["Add products and visuals", "Upload polished images, add pricing, stock and short product descriptions that help visitors decide quickly."],
  ["Prepare search presence", "Write a direct title, a helpful description and a few focused keywords that match what customers already search for."],
  ["Publish and measure", "Publish the site, review visits, watch leads and improve the page with small changes over time."]
];

export function UserGuide() {
  return <main className="mx-auto max-w-7xl px-4 py-12"><div className="mb-10"><p className="text-xs font-black uppercase tracking-[.22em] text-[#8a6818]">User guide</p><h1 className="mt-3 font-serif text-6xl font-black leading-[.92] tracking-[-.06em]">A calm guide to launching a premium site.</h1><p className="mt-5 max-w-2xl leading-8 text-charcoal/60">Use this guide when you want a simple path from setup to launch. Each step is written for business owners, not developers.</p><div className="mt-7 flex gap-3"><ButtonLink href="/onboarding" variant="gold">Start onboarding</ButtonLink><ButtonLink href="/dashboard" variant="light">Open workspace</ButtonLink></div></div><div className="grid gap-5 md:grid-cols-2"><Card className="overflow-hidden p-4"><GuideImage label="Website setup preview" /></Card><div className="grid gap-4">{steps.map(([title, body], index) => <Card key={title} className="p-5"><div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/20 font-black text-[#755812]">{index+1}</span><div><h2 className="font-black">{title}</h2><p className="mt-2 leading-7 text-charcoal/60">{body}</p></div></div></Card>)}</div></div></main>;
}
