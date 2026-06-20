"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function Illustration({ type }: { type: "site" | "commerce" | "domain" }) {
  return <svg viewBox="0 0 360 220" className="h-full w-full rounded-[2rem] bg-gradient-to-br from-white to-[#f1e3c8]" role="img" aria-label={`${type} setup illustration`}><defs><linearGradient id={`g-${type}`} x1="0" x2="1"><stop stopColor="#D4AF37"/><stop offset="1" stopColor="#1a1a1a"/></linearGradient></defs><rect x="34" y="34" width="292" height="152" rx="28" fill="white" opacity=".78"/><circle cx="82" cy="78" r="18" fill={`url(#g-${type})`}/><rect x="116" y="64" width="150" height="14" rx="7" fill="#1a1a1a" opacity=".85"/><rect x="116" y="88" width="104" height="10" rx="5" fill="#1a1a1a" opacity=".28"/><rect x="62" y="122" width="72" height="38" rx="14" fill="#D4AF37" opacity=".35"/><rect x="148" y="122" width="72" height="38" rx="14" fill="#D4AF37" opacity=".22"/><rect x="234" y="122" width="72" height="38" rx="14" fill="#1a1a1a" opacity=".12"/></svg>;
}

export function TenantOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [pending, startTransition] = useTransition();

  async function createSite(formData: FormData) {
    setStatus("Creating your workspace site…");
    const res = await fetch("/api/websites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.get("name"), industry: formData.get("industry") }) });
    const json = await res.json();
    if (!res.ok) return setStatus(json.error || "Unable to create site");
    setStatus("Site created. Add products and publish when ready.");
    setStep(2);
    router.refresh();
  }

  return <div className="mx-auto max-w-6xl px-4 py-10"><div className="mb-8"><p className="text-xs font-black uppercase tracking-[.22em] text-[#8a6818]">Tenant onboarding</p><h1 className="mt-3 font-serif text-6xl font-black leading-[.92] tracking-[-.06em]">Set up a polished workspace in minutes.</h1><p className="mt-5 max-w-2xl leading-8 text-charcoal/60">Follow these steps to create your site, prepare storefront content, connect a domain and invite your team.</p></div><div className="grid gap-5 lg:grid-cols-[1fr_420px]"><Card className="p-7"><div className="mb-6 flex gap-2">{[1,2,3].map(n => <button key={n} onClick={() => setStep(n)} className={`h-3 flex-1 rounded-full ${step >= n ? "bg-gold" : "bg-black/10"}`} aria-label={`Step ${n}`}/>)}</div>{step===1 && <form action={(fd) => startTransition(() => createSite(fd))} className="grid gap-4"><h2 className="text-2xl font-black">Create your first site</h2><input required name="name" className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Maison Aurelia"/><input name="industry" className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3" placeholder="Luxury retail, wellness, software, studio"/><Button disabled={pending} variant="gold">Create site</Button></form>}{step===2 && <div><h2 className="text-2xl font-black">Prepare your storefront</h2><p className="mt-3 leading-7 text-charcoal/60">Add products, upload visuals and review search settings before publishing.</p><div className="mt-6 flex flex-wrap gap-2"><Button variant="light" onClick={() => router.push('/cms/products')}>Add products</Button><Button variant="light" onClick={() => router.push('/assets')}>Upload visuals</Button><Button variant="gold" onClick={() => router.push('/seo')}>Review search presence</Button></div></div>}{step===3 && <div><h2 className="text-2xl font-black">Launch with confidence</h2><p className="mt-3 leading-7 text-charcoal/60">Publish, connect your custom domain, invite teammates and watch early activity from analytics.</p><div className="mt-6 flex flex-wrap gap-2"><Button variant="light" onClick={() => router.push('/builder')}>Open builder</Button><Button variant="light" onClick={() => router.push('/domains')}>Connect domain</Button><Button variant="gold" onClick={() => router.push('/team')}>Invite team</Button></div></div>}{status && <p className="mt-6 rounded-2xl bg-white/70 p-3 text-sm text-charcoal/60">{status}</p>}</Card><Card className="overflow-hidden p-4"><Illustration type={step===1 ? 'site' : step===2 ? 'commerce' : 'domain'} /></Card></div></div>;
}
