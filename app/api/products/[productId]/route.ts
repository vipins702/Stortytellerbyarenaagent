export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { productSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { assertWebsitePermission } from "@/lib/permissions";
import { audit } from "@/lib/audit";

export async function PATCH(request: Request, { params }: { params: { productId: string } }) {
  try {
    const user = await getCurrentUser();
    const existing = await prisma.product.findFirst({ where: { id: params.productId, website: { ownerId: user.id } } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    await assertWebsitePermission({ userId: user.id, websiteId: existing.websiteId, permission: "website:write" });
    const input = productSchema.partial().parse(await request.json());
    const product = await prisma.product.update({
      where: { id: params.productId },
      data: { ...input, slug: input.name ? slugify(input.name) : undefined }
    });
    await audit({ userId: user.id, action: "product.update", resource: "Product", resourceId: product.id, request });
    return NextResponse.json({ data: product });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update product" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { productId: string } }) {
  const user = await getCurrentUser();
  const existing = await prisma.product.findFirst({ where: { id: params.productId, website: { ownerId: user.id } } });
  if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  await assertWebsitePermission({ userId: user.id, websiteId: existing.websiteId, permission: "website:write" });
  await audit({ userId: user.id, action: "product.delete", resource: "Product", resourceId: existing.id });
  await prisma.product.delete({ where: { id: params.productId } });
  return NextResponse.json({ ok: true });
}
