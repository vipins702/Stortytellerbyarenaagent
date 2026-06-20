import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return {
    rules: [
      { userAgent: "*", allow: ["/", "/s/"], disallow: ["/api/", "/dashboard", "/builder", "/cms", "/settings", "/billing", "/assets", "/analytics", "/versions"] }
    ],
    sitemap: `${base}/sitemap.xml`
  };
}
