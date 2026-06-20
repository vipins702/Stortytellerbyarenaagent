import { ArrowRight, Blocks, Database, Sparkles, Wand2 } from "lucide-react";
import { Header } from "@/components/marketing/Header";
import { Badge, Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

const features = [
  { Icon: Wand2, title: "AI Website Generator", body: "Prompt to editable site with industry-aware template selection." },
  { Icon: Blocks, title: "Visual Builder", body: "Add sections, edit copy inline, reorder and preview in real time." },
  { Icon: Database, title: "Mini CMS", body: "Products, orders and lead capture screens ready for backend wiring." },
  { Icon: Sparkles, title: "Luxury Templates", body: "Shimmer, glassmorphism, soft gradients and premium layouts." }
];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <Badge>✦ MVP SaaS · Apple × Webflow × Shopify</Badge>
            <h1 className="mt-6 font-serif text-6xl font-black leading-[.9] tracking-[-.07em] md:text-8xl">
              Build luxury websites with an AI-first studio.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-charcoal/65">
              Generate a full website from a prompt, customize it in a visual builder, add products and leads in the CMS, then publish — all from one premium SaaS dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/builder" variant="gold">Launch builder <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="/dashboard" variant="light">View dashboard</ButtonLink>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["AI generation", "Visual editing", "Mini CMS"].map((item) => <Card key={item} className="p-5"><b>{item}</b><p className="mt-1 text-sm text-charcoal/55">MVP ready</p></Card>)}
            </div>
          </div>
          <Card className="overflow-hidden p-4">
            <div className="overflow-hidden rounded-[24px] border border-black/10 bg-white">
              <div className="flex h-11 items-center gap-2 bg-charcoal px-4"><span className="h-3 w-3 rounded-full bg-red-400"/><span className="h-3 w-3 rounded-full bg-yellow-300"/><span className="h-3 w-3 rounded-full bg-green-400"/></div>
              <div className="relative min-h-[460px] overflow-hidden bg-gradient-to-br from-white to-[#f5ead5] p-10">
                <div className="absolute right-8 top-8 h-44 w-44 animate-float rounded-full bg-gold/30 blur-sm" />
                <div className="absolute bottom-10 right-36 h-28 w-28 animate-float rounded-full bg-charcoal/80 blur-sm" />
                <Badge>Luxury skincare template</Badge>
                <h2 className="relative mt-8 max-w-md font-serif text-6xl font-black leading-[.92] tracking-[-.06em]">A storefront that feels handcrafted.</h2>
                <p className="relative mt-4 max-w-md text-charcoal/60">Gold shimmer, glass cards, smooth reveals and product CMS.</p>
                <div className="relative mt-10 grid grid-cols-2 gap-3">
                  {[1,2,3,4].map((i) => <div key={i} className="shimmer h-28 rounded-3xl border border-black/10 bg-white/70" />)}
                </div>
              </div>
            </div>
          </Card>
        </section>
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-serif text-5xl font-black tracking-[-.05em]">Core MVP modules</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(({ Icon, title, body }) => <Card key={title} className="p-7"><Icon className="mb-5 h-9 w-9 text-gold" /><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-charcoal/60">{body}</p></Card>)}
          </div>
        </section>
      </main>
    </>
  );
}
