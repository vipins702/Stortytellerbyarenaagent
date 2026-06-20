import { AppShell } from "@/components/AppShell";
import { Badge, Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { websites } from "@/lib/data";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">My Websites</h1><p className="mt-2 text-charcoal/60">Manage sites, publish status and recent activity.</p></div>
        <ButtonLink href="/builder" variant="gold">New website</ButtonLink>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {websites.map((site) => (
          <Card key={site.id} className="p-4 transition hover:-translate-y-1">
            <div className="shimmer h-40 rounded-3xl border border-black/10 bg-gradient-to-br from-white to-[#eadfc9] p-4"><Badge>{site.status}</Badge></div>
            <h2 className="mt-4 text-xl font-black">{site.name}</h2>
            <p className="mt-1 text-sm text-charcoal/55">/{site.slug} · updated {site.updatedAt}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 p-6"><h2 className="text-xl font-black">Activity</h2><div className="mt-4 grid gap-3 text-sm text-charcoal/65"><p>New lead captured · 2m ago</p><p>Product inventory updated · 18m ago</p><p>Website auto-saved · Today</p></div></Card>
    </AppShell>
  );
}
