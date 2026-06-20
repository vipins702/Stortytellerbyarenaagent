export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { Badge, Card } from "@/components/ui/Card";
import { CreateWebsiteButton } from "@/components/CreateWebsiteButton";
import { EmptyState } from "@/components/EmptyState";
import { SetupRequired } from "@/components/SetupRequired";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardPage() {
  try {
    const user = await getCurrentUser();
    const websites = await prisma.website.findMany({
      where: { ownerId: user.id },
      include: { _count: { select: { products: true, leads: true, orders: true } } },
      orderBy: { updatedAt: "desc" }
    });
    return (
      <AppShell>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">My Websites</h1><p className="mt-2 text-charcoal/60">DB-driven workspace for {user.email}.</p></div>
          <CreateWebsiteButton />
        </div>
        {websites.length === 0 ? <EmptyState /> : <div className="grid gap-4 md:grid-cols-3">
          {websites.map((site) => (
            <Card key={site.id} className="p-4 transition hover:-translate-y-1">
              <div className="shimmer h-40 rounded-3xl border border-black/10 bg-gradient-to-br from-white to-[#eadfc9] p-4"><Badge>{site.status}</Badge></div>
              <h2 className="mt-4 text-xl font-black">{site.name}</h2>
              <p className="mt-1 text-sm text-charcoal/55">/{site.slug} · {site._count.products} products · {site._count.leads} leads · {site._count.orders} orders</p>
            </Card>
          ))}
        </div>}
      </AppShell>
    );
  } catch (error) {
    console.error("Dashboard load failed", error);
    return <AppShell><SetupRequired title="Dashboard could not load" message="The dashboard needs the production database and schema to be ready. Check DATABASE_URL and run the Prisma database setup." /></AppShell>;
  }
}
