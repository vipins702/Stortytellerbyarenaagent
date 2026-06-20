export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const eventSchema = z.object({ type: z.string().min(1), path: z.string().optional(), referrer: z.string().optional(), visitorId: z.string().optional(), metadata: z.record(z.any()).default({}) });

export async function GET(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: { id: params.websiteId, ownerId: user.id } });
  if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });
  const [total, leads, orders, recent] = await Promise.all([
    prisma.analyticsEvent.count({ where: { websiteId: params.websiteId } }),
    prisma.lead.count({ where: { websiteId: params.websiteId } }),
    prisma.order.count({ where: { websiteId: params.websiteId } }),
    prisma.analyticsEvent.findMany({ where: { websiteId: params.websiteId }, orderBy: { createdAt: "desc" }, take: 25 })
  ]);
  return NextResponse.json({ data: { totalEvents: total, leads, orders, recent } });
}

export async function POST(request: Request, { params }: { params: { websiteId: string } }) {
  try {
    const input = eventSchema.parse(await request.json());
    const event = await prisma.analyticsEvent.create({ data: { websiteId: params.websiteId, ...input } });
    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to track event" }, { status: 400 });
  }
}
