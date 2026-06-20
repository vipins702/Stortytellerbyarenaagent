export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { VisualBuilder } from "@/components/builder/VisualBuilder";
import { componentDefinitions } from "@/lib/component-registry";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BuilderPage() {
  const user = await getCurrentUser();
  const website = await prisma.website.findFirst({
    where: { ownerId: user.id },
    include: { pages: { orderBy: { createdAt: "asc" }, take: 1 }, products: { where: { status: "Active" }, orderBy: { createdAt: "desc" } } },
    orderBy: { updatedAt: "desc" }
  });
  const dbDefinitions = await prisma.componentDefinition.findMany({ where: { isActive: true }, orderBy: { category: "asc" } });
  const definitions = dbDefinitions.length > 0 ? dbDefinitions : componentDefinitions;
  return <AppShell>{!website || !website.pages[0] ? <EmptyState title="Create a DB-backed website first" body="The builder reads page JSON, products and component metadata from the database/API layer." /> : <VisualBuilder website={{ id: website.id, name: website.name, slug: website.slug, theme: website.theme }} page={{ id: website.pages[0].id, title: website.pages[0].title, sections: website.pages[0].sections as any[] }} products={website.products} definitions={definitions as any} />}</AppShell>;
}
