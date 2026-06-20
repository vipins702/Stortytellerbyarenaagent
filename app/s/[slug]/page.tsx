export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { PublishedRenderer } from "@/components/published/PublishedRenderer";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const website = await prisma.website.findUnique({ where: { slug: params.slug }, include: { pages: { take: 1 } } });
  const seo = website?.pages[0]?.seo as any;
  return { title: seo?.title || website?.name || "Aurelia Site", description: seo?.description || "Premium website built with Aurelia AI" };
}

export default async function PublishedSitePage({ params }: { params: { slug: string } }) {
  const website = await prisma.website.findUnique({
    where: { slug: params.slug },
    include: { pages: { orderBy: { createdAt: "asc" }, take: 1 }, products: { where: { status: "Active" } }, assets: true }
  });
  if (!website || website.status !== "Published" || !website.pages[0]) notFound();
  return <PublishedRenderer website={website} page={{ sections: website.pages[0].sections as any[] }} products={website.products} assets={website.assets} />;
}
