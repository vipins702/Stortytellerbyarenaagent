export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { ProductPurchase } from "@/components/commerce/ProductPurchase";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: { slug: string; productSlug: string } }) {
  const product = await prisma.product.findFirst({ where: { slug: params.productSlug, website: { slug: params.slug, status: "Published" } } });
  return { title: product ? `${product.name} | ${params.slug}` : "Product", description: product?.description || product?.name };
}

export default async function ProductDetailPage({ params }: { params: { slug: string; productSlug: string } }) {
  const website = await prisma.website.findUnique({ where: { slug: params.slug } });
  if (!website || website.status !== "Published") notFound();
  const product = await prisma.product.findFirst({ where: { websiteId: website.id, slug: params.productSlug, status: "Active" }, include: { variants: true } });
  if (!product) notFound();
  const imageUrl = (product.metadata as any)?.imageUrl;
  const jsonLd = { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: imageUrl ? [imageUrl] : undefined, offers: { "@type": "Offer", price: product.price / 100, priceCurrency: product.currency.toUpperCase(), availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return <main className="min-h-screen bg-[#F8F6F0] text-[#1a1a1a]"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><header className="border-b border-black/10 bg-[#F8F6F0]/80 backdrop-blur-2xl"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><a href={`/s/${website.slug}`} className="font-black">{website.name}</a><a href={`/s/${website.slug}#products`} className="rounded-full border border-black/10 px-4 py-2 text-sm font-bold">Back to products</a></div></header><section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[1fr_.9fr]"><div className="overflow-hidden rounded-[2.5rem] border border-black/10 bg-white/70 p-4 shadow-2xl">{imageUrl ? <img src={imageUrl} alt={product.name} className="h-[620px] w-full rounded-[2rem] object-cover" /> : <div className="grid h-[620px] place-items-center rounded-[2rem] bg-gradient-to-br from-[#1a1a1a] to-[#D4AF37] text-8xl text-white">✦</div>}</div><div className="self-center"><p className="text-xs font-black uppercase tracking-[.2em] text-[#8a6818]">{website.name}</p><h1 className="mt-4 font-serif text-7xl font-black leading-[.9] tracking-[-.07em]">{product.name}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-black/60">{product.description || "A refined product crafted for thoughtful customers."}</p><ProductPurchase slug={website.slug} product={product as any} /></div></section></main>;
}
