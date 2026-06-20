export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { orderSchema } from "@/lib/validators";

export async function GET(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const orders = await prisma.order.findMany({ where: { websiteId: params.websiteId, website: { ownerId: user.id } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: orders });
}

export async function POST(request: Request, { params }: { params: { websiteId: string } }) {
  try {
    const user = await getCurrentUser();
    const website = await prisma.website.findFirst({ where: { id: params.websiteId, ownerId: user.id } });
    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });
    const input = orderSchema.parse(await request.json());
    const order = await prisma.order.create({ data: { ...input, websiteId: params.websiteId } });
    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create order" }, { status: 400 });
  }
}
