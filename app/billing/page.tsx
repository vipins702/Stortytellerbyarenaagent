import { AppShell } from "@/components/AppShell";
import { CheckoutButton, PortalButton } from "@/components/billing/BillingActions";
import { Badge, Card } from "@/components/ui/Card";

const plans = [
  ["Free", "$0", "2 websites, basic templates, watermark"],
  ["Pro", "$29", "10 websites, all features, custom domain"],
  ["Business", "$99", "Unlimited, white-label, priority support"]
] as const;
export default function BillingPage() {
  return <AppShell><div className="mb-6 flex items-end justify-between gap-4"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Billing</h1><p className="mt-2 text-charcoal/60">Stripe checkout and customer portal ready for Vercel.</p></div><PortalButton /></div><div className="grid gap-4 md:grid-cols-3">{plans.map(([name, price, desc]) => <Card key={name} className={`p-7 ${name === "Pro" ? "border-gold/50 shadow-glow" : ""}`}><Badge>{name === "Pro" ? "Most popular" : name}</Badge><h2 className="mt-4 text-2xl font-black">{name}</h2><p className="mt-3 text-5xl font-black tracking-[-.06em]">{price}<span className="text-base text-charcoal/50">/mo</span></p><p className="mt-4 leading-7 text-charcoal/60">{desc}</p>{name === "Free" ? <div className="mt-6 rounded-full border border-black/10 bg-white/70 px-5 py-3 text-center text-sm font-bold">Current starter</div> : <CheckoutButton plan={name} />}</Card>)}</div></AppShell>;
}
