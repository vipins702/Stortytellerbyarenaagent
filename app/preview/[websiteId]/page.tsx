export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { PublishedRenderer } from "@/components/published/PublishedRenderer";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertWebsitePermission } from "@/lib/permissions";

export default async function DraftPreviewPage({ params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  await assertWebsitePermission({ userId: user.id, websiteId: params.websiteId, permission: "website:read" });
  const website = await prisma.website.findUnique({
    where: { id: params.websiteId },
    include: {
      pages: { orderBy: { createdAt: "asc" }, take: 1 },
      products: { where: { status: "Active" }, include: { variants: true } },
      assets: true,
      abTests: { where: { status: "Active" }, include: { variants: true }, take: 1 }
    }
  });
  if (!website || !website.pages[0]) notFound();
  return (
    <>
      <div className="fixed left-1/2 top-4 z-[100] -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[.16em] text-white/70 backdrop-blur-xl">
        Draft preview · not published
      </div>
      <PublishedRenderer website={{ ...website, status: "Published" }} page={{ sections: website.pages[0].sections as any[] }} products={website.products as any} assets={website.assets} />
    </>
  );
}
