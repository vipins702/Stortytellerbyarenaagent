export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { assertWebsitePermission } from "@/lib/permissions";
import { audit } from "@/lib/audit";

export async function GET(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const products = await prisma.product.findMany({ where: { websiteId: params.websiteId, website: { ownerId: user.id } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: products });
}

export async function POST(request: Request, { params }: { params: { websiteId: string } }) {
  try {
    const user = await getCurrentUser();
    const input = productSchema.parse(await request.json());
    await assertWebsitePermission({ userId: user.id, websiteId: params.websiteId, permission: "website:write" });
    const product = await prisma.product.create({ data: { ...input, websiteId: params.websiteId, slug: slugify(input.name) } });
    await audit({ userId: user.id, action: "product.create", resource: "Product", resourceId: product.id, request, metadata: { websiteId: params.websiteId } });
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create product" }, { status: 400 });
  }
}
