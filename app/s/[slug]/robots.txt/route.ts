export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const website = await prisma.website.findUnique({ where: { slug: params.slug }, include: { pages: { take: 1 } } });
  if (!website) return new Response("User-agent: *\nDisallow: /", { headers: { "Content-Type": "text/plain" } });
  const seo = website.pages[0]?.seo as any;
  const body = seo?.noIndex ? `User-agent: *\nDisallow: /\n` : `User-agent: *\nAllow: /\nSitemap: ${base}/s/${website.slug}/sitemap.xml\n`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
