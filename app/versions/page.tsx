export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { RestoreVersionButton } from "@/components/versions/VersionActions";
import { Badge, Card } from "@/components/ui/Card";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function VersionsPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: { ownerId: user.id }, include: { versions: { orderBy: { version: "desc" } } }, orderBy: { updatedAt: "desc" } });
  return <AppShell>{!website ? <EmptyState /> : <div><div className="mb-6"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Version History</h1><p className="mt-2 text-charcoal/60">Published snapshots for rollback and audit history.</p></div><div className="grid gap-3">{website.versions.map((v) => <Card key={v.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><Badge>Version {v.version}</Badge><p className="mt-2 font-bold">Published {v.publishedAt.toLocaleString()}</p></div><RestoreVersionButton versionId={v.id} /></Card>)}</div>{website.versions.length === 0 && <Card className="p-10 text-center text-charcoal/60">No versions yet. Publish from the builder to create version history.</Card>}</div>}</AppShell>;
}
