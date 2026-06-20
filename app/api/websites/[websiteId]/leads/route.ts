export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { leadSchema } from "@/lib/validators";
import { leadEmailHtml, sendEmail } from "@/lib/email";
import { assertRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function GET(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const leads = await prisma.lead.findMany({ where: { websiteId: params.websiteId, website: { ownerId: user.id } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: leads });
}

export async function POST(request: Request, { params }: { params: { websiteId: string } }) {
  try {
    assertRateLimit({ key: rateLimitKey(request, "lead-submit"), limit: 12, windowMs: 60_000 });
    const input = leadSchema.parse(await request.json());
    const website = await prisma.website.findUnique({ where: { id: params.websiteId }, include: { owner: true } });
    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });
    const lead = await prisma.lead.create({ data: { ...input, websiteId: params.websiteId } });
    await sendEmail({ to: website.owner.email, subject: `New lead from ${website.name}`, html: leadEmailHtml({ websiteName: website.name, name: input.name, email: input.email, message: input.message }) }).catch(() => null);
    return NextResponse.json({ data: lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create lead" }, { status: 400 });
  }
}
