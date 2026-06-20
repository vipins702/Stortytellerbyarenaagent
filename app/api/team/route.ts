export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const inviteSchema = z.object({ email: z.string().email(), role: z.enum(["Admin", "Designer", "Editor", "Viewer", "Billing"]).default("Editor") });

async function ensureOrganization(userId: string) {
  const existing = await prisma.organization.findFirst({ where: { memberships: { some: { userId } } }, include: { memberships: { include: { user: true } } } });
  if (existing) return existing;
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return prisma.organization.create({
    data: { name: `${user.name || "Aurelia"} Workspace`, slug: `${slugify(user.name || "aurelia")}-${userId.slice(0, 6)}`, memberships: { create: { userId, role: "Owner" } } },
    include: { memberships: { include: { user: true } } }
  });
}

export async function GET() {
  const user = await getCurrentUser();
  const org = await ensureOrganization(user.id);
  return NextResponse.json({ data: org });
}

export async function POST(request: Request) {
  try {
    const current = await getCurrentUser();
    const org = await ensureOrganization(current.id);
    const input = inviteSchema.parse(await request.json());
    const invited = await prisma.user.upsert({ where: { email: input.email }, update: {}, create: { email: input.email, name: input.email.split("@")[0] } });
    const membership = await prisma.membership.upsert({ where: { userId_organizationId: { userId: invited.id, organizationId: org.id } }, update: { role: input.role }, create: { userId: invited.id, organizationId: org.id, role: input.role } });
    return NextResponse.json({ data: membership, message: "Invite recorded. Wire Resend to send email notification." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to invite teammate" }, { status: 400 });
  }
}
