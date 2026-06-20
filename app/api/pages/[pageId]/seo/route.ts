export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(5).max(70),
  description: z.string().min(20).max(180),
  keywords: z.array(z.string()).default([]),
  canonical: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().default(false),
  structuredDataType: z.enum(["WebSite", "Store", "Organization", "LocalBusiness", "ProductCollection"]).default("WebSite")
});

export async function PATCH(request: Request, { params }: { params: { pageId: string } }) {
  try {
    const user = await getCurrentUser();
    const input = schema.parse(await request.json());
    const page = await prisma.page.findFirst({ where: { id: params.pageId, website: { ownerId: user.id } } });
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    const updated = await prisma.page.update({ where: { id: page.id }, data: { seo: input } });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save search settings" }, { status: 400 });
  }
}
