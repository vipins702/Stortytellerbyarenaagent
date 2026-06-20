export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { assertWebsitePermission } from "@/lib/permissions";

export async function GET(_: Request, { params }: { params: { testId: string } }) {
  const user = await getCurrentUser();
  const test = await prisma.aBTest.findUnique({ where: { id: params.testId }, include: { variants: true } });
  if (!test) return NextResponse.json({ error: "Test not found" }, { status: 404 });
  await assertWebsitePermission({ userId: user.id, websiteId: test.websiteId, permission: "website:read" });
  const events = await prisma.analyticsEvent.findMany({ where: { websiteId: test.websiteId, metadata: { path: ["testId"], equals: test.id } as any } }).catch(() => []);
  const variantReports = await Promise.all(test.variants.map(async (variant) => {
    const [views, assigned, conversions] = await Promise.all([
      prisma.analyticsEvent.count({ where: { websiteId: test.websiteId, type: "ab_view", metadata: { path: ["variantId"], equals: variant.id } as any } }),
      prisma.analyticsEvent.count({ where: { websiteId: test.websiteId, type: "ab_assigned", metadata: { path: ["variantId"], equals: variant.id } as any } }),
      prisma.analyticsEvent.count({ where: { websiteId: test.websiteId, type: test.goal, metadata: { path: ["variantId"], equals: variant.id } as any } }).catch(() => 0)
    ]);
    return { variantId: variant.id, name: variant.name, weight: variant.weight, assigned, views, conversions, conversionRate: views ? conversions / views : 0 };
  }));
  return NextResponse.json({ data: { test, variants: variantReports, eventCount: events.length } });
}
