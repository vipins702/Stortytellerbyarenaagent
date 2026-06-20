export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { ABTestManager } from "@/components/abtesting/ABTestManager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ABTestsPage() {
  const user = await getCurrentUser();
  const [websites, tests] = await Promise.all([
    prisma.website.findMany({ where: { ownerId: user.id }, select: { id: true, name: true } }),
    prisma.aBTest.findMany({ where: { website: { ownerId: user.id } }, include: { variants: true }, orderBy: { createdAt: "desc" } })
  ]);
  return <AppShell><ABTestManager websites={websites} tests={tests} /></AppShell>;
}
