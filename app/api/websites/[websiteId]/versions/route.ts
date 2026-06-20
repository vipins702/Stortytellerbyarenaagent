export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const versions = await prisma.publishVersion.findMany({ where: { websiteId: params.websiteId, website: { ownerId: user.id } }, orderBy: { version: "desc" } });
  return NextResponse.json({ data: versions });
}
