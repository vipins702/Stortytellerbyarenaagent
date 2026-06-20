import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  if (!process.env.DATABASE_URL) return [{ url: base, lastModified: new Date(), priority: 1 }];
  const websites = await prisma.website.findMany({ where: { status: "Published" }, select: { slug: true, updatedAt: true } }).catch(() => []);
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/templates`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/billing`, lastModified: new Date(), priority: 0.7 },
    ...websites.map((site) => ({ url: `${base}/s/${site.slug}`, lastModified: site.updatedAt, priority: 0.9 }))
  ];
}
