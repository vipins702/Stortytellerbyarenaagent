import type { MetadataRoute } from "next";

/**
 * Build-safe platform sitemap.
 *
 * Do not query Prisma here: Next collects this route during Vercel build, and the
 * production database may not be reachable or migrated yet at build time.
 * Published websites still expose their own DB-backed sitemap at:
 * /s/:slug/sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const now = new Date();
  return [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/templates`, lastModified: now, priority: 0.8 },
    { url: `${base}/billing`, lastModified: now, priority: 0.7 },
    { url: `${base}/guide`, lastModified: now, priority: 0.7 },
    { url: `${base}/signup`, lastModified: now, priority: 0.6 }
  ];
}
