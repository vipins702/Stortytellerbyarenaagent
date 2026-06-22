export const dynamic = "force-dynamic";

import { PuckStudio } from "@/components/puck/PuckStudio";
import { EmptyState } from "@/components/EmptyState";
import { SetupRequired } from "@/components/SetupRequired";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { websiteScope } from "@/lib/scope";

export default async function StudioPage() {
  try {
    const user = await getCurrentUser();
    const website = await prisma.website.findFirst({ where: websiteScope(user), include: { pages: { orderBy: { createdAt: "asc" }, take: 1 } }, orderBy: { updatedAt: "desc" } });
    if (!website || !website.pages[0]) return <EmptyState title="Create a website first" body="Puck Studio edits the latest website page from your workspace." />;
    return <PuckStudio website={{ id: website.id, name: website.name }} page={{ id: website.pages[0].id, sections: website.pages[0].sections as any[] }} />;
  } catch (error) {
    console.error("Puck Studio failed", error);
    return <SetupRequired title="Puck Studio could not open" message="Check DATABASE_URL and make sure the Neon schema has been created." />;
  }
}
