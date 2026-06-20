export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { DataTable } from "@/components/cms/DataTable";
import { EmptyState } from "@/components/EmptyState";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export default async function LeadsPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: { ownerId: user.id }, include: { leads: { orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "desc" } });
  return <AppShell><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Leads</h1><p className="mt-2 text-charcoal/60">Contact form submissions from the Lead API.</p></div>{!website ? <EmptyState /> : <DataTable title={`Lead submissions · ${website.name}`} headers={["Name", "Email", "Source", "Status"]} rows={website.leads.map((l) => [l.name, l.email, l.source || "Website", l.status])} />}</AppShell>;
}
