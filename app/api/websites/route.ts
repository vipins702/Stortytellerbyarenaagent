export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createWebsiteSchema } from "@/lib/validators";
import { createSection } from "@/lib/component-registry";
import { slugify } from "@/lib/utils";
import { assertWebsiteLimit } from "@/lib/plans";

async function uniqueSlug(base: string) {
  let slug = slugify(base);
  let attempt = 1;
  while (await prisma.website.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${slugify(base)}-${attempt}`;
  }
  return slug;
}

export async function GET() {
  const user = await getCurrentUser();
  const websites = await prisma.website.findMany({
    where: { ownerId: user.id },
    include: { pages: { take: 1, orderBy: { createdAt: "asc" } }, _count: { select: { products: true, leads: true, orders: true } } },
    orderBy: { updatedAt: "desc" }
  });
  return NextResponse.json({ data: websites });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    await assertWebsiteLimit(user.id);
    const input = createWebsiteSchema.parse(await request.json());
    const template = input.templateId ? await prisma.template.findUnique({ where: { id: input.templateId } }) : null;
    const slug = await uniqueSlug(input.name);
    const sections = template?.sections ?? [createSection("hero"), createSection("features"), createSection("products")];
    const theme = template?.theme ?? { background: "#F8F6F0", accent: "#D4AF37", text: "#1a1a1a", fonts: { heading: "Playfair Display", body: "Inter" } };
    const website = await prisma.website.create({
      data: {
        ownerId: user.id,
        name: input.name,
        slug,
        industry: input.industry,
        theme,
        metadata: { createdFrom: template ? "template" : "blank", templateId: template?.id },
        pages: { create: { title: "Home", path: "/", sections, seo: { title: input.name, description: `Premium website for ${input.name}` } } }
      },
      include: { pages: true }
    });
    return NextResponse.json({ data: website }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create website" }, { status: 400 });
  }
}
