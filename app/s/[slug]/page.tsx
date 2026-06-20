export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { PublishedRenderer } from "@/components/published/PublishedRenderer";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const website = await prisma.website.findUnique({ where: { slug: params.slug }, include: { pages: { take: 1 } } });
  const seo = website?.pages[0]?.seo as any;
  return { title: seo?.title || website?.name || "Premium Site", description: seo?.description || "Premium website experience", keywords: seo?.keywords, robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true }, alternates: { canonical: seo?.canonical }, openGraph: { title: seo?.title || website?.name, description: seo?.description, images: seo?.ogImage ? [seo.ogImage] : [] } };
}

export default async function PublishedSitePage({ params }: { params: { slug: string } }) {
  const website = await prisma.website.findUnique({
    where: { slug: params.slug },
    include: { pages: { orderBy: { createdAt: "asc" }, take: 1 }, products: { where: { status: "Active" } }, assets: true }
  });
  if (!website || website.status !== "Published" || !website.pages[0]) notFound();
  const seo = website.pages[0].seo as any;
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": seo?.structuredDataType === "Store" ? "Store" : seo?.structuredDataType || "WebSite",
    name: website.name,
    url: `${base}/s/${website.slug}`,
    description: seo?.description,
    potentialAction: { "@type": "SearchAction", target: `${base}/s/${website.slug}?q={search_term_string}`, "query-input": "required name=search_term_string" },
    hasOfferCatalog: website.products.length ? { "@type": "OfferCatalog", name: `${website.name} Products`, itemListElement: website.products.map((product) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: product.name, description: product.description || product.name }, price: product.price / 100, priceCurrency: product.currency.toUpperCase() })) } : undefined
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><PublishedRenderer website={website} page={{ sections: website.pages[0].sections as any[] }} products={website.products} assets={website.assets} /></>;
}
