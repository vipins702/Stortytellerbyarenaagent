export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { GenerationHistoryPage } from "@/components/generations/GenerationHistoryPage";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function GenerationsPage() {
  const user = await getCurrentUser();
  const jobs = await prisma.generationJob.findMany({
    where: { userId: user.id },
    include: { steps: { orderBy: { createdAt: "asc" } }, assets: { include: { asset: true } } },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  return <AppShell><GenerationHistoryPage jobs={jobs as any} /></AppShell>;
}
