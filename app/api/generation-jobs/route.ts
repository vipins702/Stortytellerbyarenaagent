export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const websiteId = searchParams.get("websiteId") || undefined;
  const jobs = await prisma.generationJob.findMany({
    where: { userId: user.id, websiteId },
    include: { steps: { orderBy: { createdAt: "asc" } }, assets: { include: { asset: true } } },
    orderBy: { createdAt: "desc" },
    take: 20
  });
  return NextResponse.json({ data: jobs });
}
