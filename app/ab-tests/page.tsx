export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { ABTestManager } from "@/components/abtesting/ABTestManager";
import { ABReportCards } from "@/components/abtesting/ABReportCards";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { websiteScope } from "@/lib/scope";

export default async function ABTestsPage() {
  const user = await getCurrentUser();
  const [websites, tests] = await Promise.all([
    prisma.website.findMany({ where: websiteScope(user), select: { id: true, name: true } }),
    prisma.aBTest.findMany({ where: { website: websiteScope(user) }, include: { variants: true }, orderBy: { createdAt: "desc" } })
  ]);
  const reports = await Promise.all(tests.map(async (test) => {
    const variants = await Promise.all(test.variants.map(async (variant) => {
      const [views, assigned, conversions] = await Promise.all([
        prisma.analyticsEvent.count({ where: { websiteId: test.websiteId, type: "ab_view", metadata: { path: ["variantId"], equals: variant.id } as any } }),
        prisma.analyticsEvent.count({ where: { websiteId: test.websiteId, type: "ab_assigned", metadata: { path: ["variantId"], equals: variant.id } as any } }),
        prisma.analyticsEvent.count({ where: { websiteId: test.websiteId, type: test.goal, metadata: { path: ["variantId"], equals: variant.id } as any } }).catch(() => 0)
      ]);
      return { variantId: variant.id, name: variant.name, weight: variant.weight, assigned, views, conversions, conversionRate: views ? conversions / views : 0 };
    }));
    return { test, variants, eventCount: variants.reduce((sum, variant) => sum + variant.views + variant.assigned + variant.conversions, 0) };
  }));
  return <AppShell><ABTestManager websites={websites} tests={tests} /><ABReportCards reports={reports} /></AppShell>;
}
