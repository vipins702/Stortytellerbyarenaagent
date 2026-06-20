export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import PublishedSitePage, { generateMetadata as siteMetadata } from "@/app/s/[slug]/page";
import { prisma } from "@/lib/prisma";

async function resolveSlug(host: string) {
  const hostname = decodeURIComponent(host).toLowerCase();
  const domain = await prisma.domain.findUnique({ where: { hostname }, include: { website: true } });
  return domain?.website?.slug;
}

export async function generateMetadata({ params }: { params: { host: string } }) {
  const slug = await resolveSlug(params.host);
  if (!slug) return { title: "Site not found" };
  return siteMetadata({ params: { slug } });
}

export default async function CustomDomainSitePage({ params }: { params: { host: string } }) {
  const slug = await resolveSlug(params.host);
  if (!slug) notFound();
  return PublishedSitePage({ params: { slug } });
}
