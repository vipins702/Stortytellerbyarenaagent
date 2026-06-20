export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { verifyVercelDomain } from "@/lib/vercel-domains";

export async function POST(_: Request, { params }: { params: { domainId: string } }) {
  try {
    const user = await getCurrentUser();
    const domain = await prisma.domain.findFirst({ where: { id: params.domainId, website: { ownerId: user.id } } });
    if (!domain) return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    const result = await verifyVercelDomain(domain.hostname);
    const updated = await prisma.domain.update({
      where: { id: domain.id },
      data: {
        status: result.verified ? "Verified" : "Pending",
        verifiedAt: result.verified ? new Date() : null,
        metadata: { ...(domain.metadata as object), vercel: result }
      }
    });
    return NextResponse.json({ data: updated, result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to verify domain" }, { status: 400 });
  }
}
