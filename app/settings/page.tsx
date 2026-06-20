import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return <AppShell><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Settings</h1><p className="mt-2 text-charcoal/60">Team, domains, analytics and publishing controls.</p></div><div className="grid gap-4 md:grid-cols-3"><Card className="p-6"><h2 className="text-xl font-black">Team collaboration</h2><p className="mt-2 text-charcoal/60">Invite designers, editors and billing managers.</p><input className="mt-5 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="teammate@studio.com"/><Button className="mt-3" variant="light">Invite</Button></Card><Card className="p-6"><h2 className="text-xl font-black">Custom domain</h2><p className="mt-2 text-charcoal/60">DNS verification and SSL-ready production path.</p><input className="mt-5 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="www.brand.com"/><Button className="mt-3" variant="light">Connect</Button></Card><Card className="p-6"><h2 className="text-xl font-black">Analytics</h2><p className="mt-2 text-charcoal/60">Built-in events plus GA4/PostHog integration later.</p><Button className="mt-5" variant="light">Copy snippet</Button></Card></div></AppShell>;
}
