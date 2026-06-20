import { ArrowRight, Blocks, Database, Sparkles, Wand2 } from "lucide-react";
import { Header } from "@/components/marketing/Header";
import { Badge, Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

const features = [
  { Icon: Wand2, title: "Prompt to story page", body: "Generate editable cinematic landing pages, copy and sections from a simple brief." },
  { Icon: Blocks, title: "Visual studio", body: "Arrange sections, edit chapters, select media and publish from one dark workspace." },
  { Icon: Database, title: "Media library", body: "Save generated images, uploaded videos and 3D assets in a reusable project library." },
  { Icon: Sparkles, title: "Scroll storytelling", body: "Use sticky media, product chapters, motion-ready sections and product checkout." }
];

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1360px] items-center gap-14 px-5 py-20 lg:grid-cols-[.98fr_1.02fr]">
          <div>
            <Badge>● Cinematic product pages · no code</Badge>
            <h1 className="mt-7 max-w-3xl text-6xl font-black leading-[.88] tracking-[-.075em] md:text-8xl">
              Build a <span className="gold-text">Scroll Scrub Page</span> in Minutes
            </h1>
            <p className="mt-8 max-w-2xl text-xl font-semibold leading-9 text-white/55">
              Upload your product video. Choose a visual style. Create a cinematic, interactive landing page with media, products and checkout.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/builder" variant="gold">Open Studio <ArrowRight className="h-4 w-4" /></ButtonLink>
              <ButtonLink href="/guide" variant="light">View guide</ButtonLink>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {["Generated media", "Scroll stories", "Product checkout"].map((item) => <Card key={item} className="p-5"><b>{item}</b><p className="mt-1 text-sm text-white/45">Ready</p></Card>)}
            </div>
          </div>
          <div className="grid gap-5">
            <Card className="overflow-hidden p-4">
              <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#080812]">
                <div className="flex h-12 items-center gap-2 border-b border-white/10 bg-white/[.03] px-4"><span className="h-3 w-3 rounded-full bg-red-500"/><span className="h-3 w-3 rounded-full bg-yellow-400"/><span className="h-3 w-3 rounded-full bg-green-500"/><div className="ml-5 h-6 flex-1 rounded-full border border-white/10 bg-black/30" /></div>
                <div className="relative min-h-[330px] overflow-hidden bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,.25),transparent_30%),linear-gradient(135deg,#090913,#05050A)] p-8">
                  <div className="absolute right-8 top-8 h-44 w-44 animate-float rounded-full bg-cyan/20 blur-2xl" />
                  <Badge>Luminary</Badge>
                  <h2 className="relative mt-8 max-w-md text-5xl font-black leading-[.92] tracking-[-.06em]"><span className="gold-text">The Apex</span></h2>
                  <p className="relative mt-4 max-w-md text-white/55">A product page that feels like a launch film, not a template.</p>
                  <div className="relative mt-9 flex flex-wrap gap-2 text-xs font-bold text-white/55"><span className="rounded-full bg-white/10 px-3 py-2">50K+ users</span><span className="rounded-full bg-white/10 px-3 py-2">120 countries</span><span className="rounded-full bg-white/10 px-3 py-2">4.9★</span></div>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-xs font-black uppercase tracking-[.22em] text-white/35">The pipeline</p>
              <div className="mt-5 grid gap-4">
                {[["01","Hero image","Templates and generated options"],["02","Video frames","Upload MP4/WebM and build story chapters"],["03","Editor","Edit every word, asset and product"],["04","Export / publish","SEO, cart and custom domains"]].map(([n,t,b]) => <div key={n} className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet/20 font-black text-violet-200">{n}</span><div><b>{t}</b><p className="text-sm text-white/45">{b}</p></div></div>)}
              </div>
            </Card>
          </div>
        </section>
        <section className="mx-auto max-w-[1360px] px-5 pb-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-5xl font-black tracking-[-.06em]">Core modules</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {features.map(({ Icon, title, body }) => <Card key={title} className="p-7"><Icon className="mb-5 h-9 w-9 text-cyan" /><h3 className="text-xl font-black">{title}</h3><p className="mt-3 leading-7 text-white/55">{body}</p></Card>)}
          </div>
        </section>
      </main>
    </>
  );
}
