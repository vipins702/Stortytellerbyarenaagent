export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { DataTable } from "@/components/cms/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: { ownerId: user.id }, include: { orders: { orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "desc" } });
  return <AppShell><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Orders</h1><p className="mt-2 text-charcoal/60">DB-backed checkout and fulfillment tracking.</p></div>{!website ? <EmptyState /> : <DataTable title={`Recent orders · ${website.name}`} headers={["Order", "Customer", "Total", "Status"]} rows={website.orders.map((o) => [o.id.slice(-8), o.customerName, `$${(o.total / 100).toFixed(2)}`, o.status])} />}</AppShell>;
}
