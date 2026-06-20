export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const website = await prisma.website.findUnique({ where: { slug: params.slug }, include: { pages: true, products: { where: { status: "Active" } } } });
  if (!website) return new Response("Not found", { status: 404 });
  const urls = [
    `${base}/s/${website.slug}`,
    ...website.pages.filter(p => p.path !== "/").map(p => `${base}/s/${website.slug}${p.path}`)
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `<url><loc>${url}</loc><lastmod>${website.updatedAt.toISOString()}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`).join("\n")}
</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
