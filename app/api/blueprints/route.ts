export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blueprintInputSchema, generateCreativeBlueprint } from "@/lib/creative-blueprint";

export async function GET() {
  const user = await getCurrentUser();
  const data = await prisma.creativeBlueprint.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 20 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const input = blueprintInputSchema.parse(await request.json());
    const blueprint = await generateCreativeBlueprint(input);
    const record = await prisma.creativeBlueprint.create({
      data: {
        tenantId: user.primaryTenantId,
        userId: user.id,
        websiteId: input.websiteId,
        brandName: input.brandName,
        productService: input.productService,
        targetAudience: input.targetAudience,
        vibe: input.vibe,
        colors: input.colors,
        blueprintJson: blueprint as any,
        imagePromptPack: blueprint.imagePromptPack as any,
        summary: blueprint.summaryCard as any,
        metadata: { generator: "gemini", version: 1 }
      }
    });
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate blueprint" }, { status: 400 });
  }
}
