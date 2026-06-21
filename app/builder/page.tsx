export const dynamic = "force-dynamic";

import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { SetupRequired } from "@/components/SetupRequired";
import { VisualBuilder } from "@/components/builder/VisualBuilder";
import { componentDefinitions } from "@/lib/component-registry";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { websiteScope } from "@/lib/scope";

export default async function BuilderPage() {
  try {
    const user = await getCurrentUser();
    const website = await prisma.website.findFirst({
      where: websiteScope(user),
      include: { pages: { orderBy: { createdAt: "asc" }, take: 1 }, products: { where: { status: "Active" }, orderBy: { createdAt: "desc" } }, assets: { orderBy: { createdAt: "desc" } } },
      orderBy: { updatedAt: "desc" }
    });
    const dbDefinitions = await prisma.componentDefinition.findMany({ where: { isActive: true }, orderBy: { category: "asc" } });
    const dbByType = new Map(dbDefinitions.map((definition) => [definition.type, definition]));
    const definitions = componentDefinitions.map((definition) => dbByType.get(definition.type) || definition);
    return <AppShell>{!website || !website.pages[0] ? <EmptyState title="Create a DB-backed website first" body="The builder reads page JSON, products and component metadata from the database/API layer." /> : <VisualBuilder website={{ id: website.id, name: website.name, slug: website.slug, theme: website.theme }} page={{ id: website.pages[0].id, title: website.pages[0].title, sections: website.pages[0].sections as any[] }} products={website.products} assets={website.assets} definitions={definitions as any} />}</AppShell>;
  } catch (error) {
    console.error("Builder load failed", error);
    return <AppShell><SetupRequired title="Studio could not open" message="The Studio needs a working database connection and the latest Prisma schema. Add DATABASE_URL in Vercel and run db:push/db:seed before opening the builder." /></AppShell>;
  }
}
