export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { leadSchema } from "@/lib/validators";

export async function GET(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const leads = await prisma.lead.findMany({ where: { websiteId: params.websiteId, website: { ownerId: user.id } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: leads });
}

export async function POST(request: Request, { params }: { params: { websiteId: string } }) {
  try {
    const input = leadSchema.parse(await request.json());
    const lead = await prisma.lead.create({ data: { ...input, websiteId: params.websiteId } });
    return NextResponse.json({ data: lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create lead" }, { status: 400 });
  }
}
