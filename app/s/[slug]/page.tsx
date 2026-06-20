export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { PublishedRenderer } from "@/components/published/PublishedRenderer";
import { prisma } from "@/lib/prisma";
import { ABTracker } from "@/components/published/ABTracker";
import { ABVariantGate } from "@/components/published/ABVariantGate";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const website = await prisma.website.findUnique({ where: { slug: params.slug }, include: { pages: { take: 1 } } });
  const seo = website?.pages[0]?.seo as any;
  return { title: seo?.title || website?.name || "Premium Site", description: seo?.description || "Premium website experience", keywords: seo?.keywords, robots: seo?.noIndex ? { index: false, follow: false } : { index: true, follow: true }, alternates: { canonical: seo?.canonical }, openGraph: { title: seo?.title || website?.name, description: seo?.description, images: seo?.ogImage ? [seo.ogImage] : [] } };
}

export default async function PublishedSitePage({ params }: { params: { slug: string } }) {
  const website = await prisma.website.findUnique({
    where: { slug: params.slug },
    include: { pages: { orderBy: { createdAt: "asc" }, take: 1 }, products: { where: { status: "Active" } }, assets: true, abTests: { where: { status: "Active" }, include: { variants: true }, take: 1 } }
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
  const activeTest = website.abTests[0];
  const cookieVariantId = activeTest ? cookies().get(`ab:${activeTest.id}`)?.value : undefined;
  const variant = activeTest?.variants.find((item) => item.id === cookieVariantId) || activeTest?.variants.sort((a, b) => b.weight - a.weight)[0];
  const sections = variant?.sections && Array.isArray(variant.sections) && variant.sections.length ? variant.sections as any[] : website.pages[0].sections as any[];
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{activeTest && variant && <><ABVariantGate websiteId={website.id} testId={activeTest.id} variants={activeTest.variants.map((v) => ({ id: v.id, name: v.name, weight: v.weight }))} /><ABTracker websiteId={website.id} testId={activeTest.id} variantId={variant.id} /></>}<PublishedRenderer website={website} page={{ sections }} products={website.products as any} assets={website.assets} /></>;
}
