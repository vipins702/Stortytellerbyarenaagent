export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { ProductManager } from "@/components/cms/ProductManager";
import { prisma } from "@/lib/prisma";
import { websiteScope } from "@/lib/scope";
import { getCurrentUser } from "@/lib/auth";

export default async function ProductsPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({ where: websiteScope(user), include: { products: { include: { variants: true }, orderBy: { createdAt: "desc" } }, assets: { where: { type: { startsWith: "image/" } }, orderBy: { createdAt: "desc" } } }, orderBy: { updatedAt: "desc" } });
  return <AppShell>{!website ? <EmptyState /> : <ProductManager websiteId={website.id} products={website.products as any} assets={website.assets as any} />}</AppShell>;
}
