export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { Badge, Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: { ownerId: user.id }, include: { analytics: { orderBy: { createdAt: "desc" }, take: 25 }, _count: { select: { leads: true, orders: true, analytics: true } } }, orderBy: { updatedAt: "desc" } });
  return <AppShell>{!website ? <EmptyState /> : <div><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Analytics</h1><p className="mt-2 text-charcoal/60">Lightweight first-party analytics foundation.</p></div><div className="mb-6 grid gap-4 md:grid-cols-3"><Card className="p-6"><b className="text-3xl">{website._count.analytics}</b><p className="text-charcoal/55">Events</p></Card><Card className="p-6"><b className="text-3xl">{website._count.leads}</b><p className="text-charcoal/55">Leads</p></Card><Card className="p-6"><b className="text-3xl">{website._count.orders}</b><p className="text-charcoal/55">Orders</p></Card></div><Card className="p-6"><h2 className="text-xl font-black">Recent events</h2><div className="mt-4 grid gap-2">{website.analytics.map((e) => <div key={e.id} className="flex justify-between rounded-2xl bg-white/60 p-3 text-sm"><span><Badge>{e.type}</Badge> {e.path}</span><span className="text-charcoal/45">{e.createdAt.toLocaleString()}</span></div>)}</div></Card></div>}</AppShell>;
}
