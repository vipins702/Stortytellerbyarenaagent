export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { DataTable } from "@/components/cms/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: { ownerId: user.id }, include: { products: { orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "desc" } });
  return <AppShell><div className="mb-6 flex items-end justify-between"><div><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Products</h1><p className="mt-2 text-charcoal/60">DB-driven inventory for the selected website.</p></div><Button variant="gold">Add product via API</Button></div>{!website ? <EmptyState /> : <DataTable title={`Product inventory · ${website.name}`} headers={["Name", "Price", "Stock", "Status"]} rows={website.products.map((p) => [p.name, `$${(p.price / 100).toFixed(2)}`, p.stock, p.status])} />}</AppShell>;
}
