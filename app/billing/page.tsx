import { AppShell } from "@/components/AppShell";
import { Badge, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const plans = [
  ["Free", "$0", "2 websites, basic templates, watermark"],
  ["Pro", "$29", "10 websites, all features, custom domain"],
  ["Business", "$99", "Unlimited, white-label, priority support"]
];
export default function BillingPage() {
  return <AppShell><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Billing</h1><p className="mt-2 text-charcoal/60">Stripe-ready SaaS pricing and plan enforcement.</p></div><div className="grid gap-4 md:grid-cols-3">{plans.map(([name, price, desc]) => <Card key={name} className={`p-7 ${name === "Pro" ? "border-gold/50 shadow-glow" : ""}`}><Badge>{name === "Pro" ? "Most popular" : name}</Badge><h2 className="mt-4 text-2xl font-black">{name}</h2><p className="mt-3 text-5xl font-black tracking-[-.06em]">{price}<span className="text-base text-charcoal/50">/mo</span></p><p className="mt-4 leading-7 text-charcoal/60">{desc}</p><Button className="mt-6 w-full" variant={name === "Pro" ? "gold" : "light"}>Choose {name}</Button></Card>)}</div></AppShell>;
}
