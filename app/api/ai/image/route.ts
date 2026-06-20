export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { generateImageWithGemini } from "@/lib/gemini";
import { uploadBufferToBlob } from "@/lib/blob";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const schema = z.object({
  prompt: z.string().min(3),
  websiteId: z.string().optional(),
  filename: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const input = schema.parse(await request.json());
    const image = await generateImageWithGemini({ prompt: input.prompt });
    const extension = image.contentType.includes("jpeg") ? "jpg" : image.contentType.includes("webp") ? "webp" : "png";
    const pathname = `ai-images/${input.websiteId || user.id}/${slugify(input.filename || input.prompt).slice(0, 80)}.${extension}`;
    const blob = await uploadBufferToBlob({ pathname, body: image.buffer, contentType: image.contentType });

    let asset = null;
    if (input.websiteId) {
      const website = await prisma.website.findFirst({ where: { id: input.websiteId, ownerId: user.id } });
      if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });
      asset = await prisma.asset.create({
        data: {
          websiteId: input.websiteId,
          url: blob.url,
          key: blob.pathname,
          type: image.contentType,
          filename: input.filename || `${slugify(input.prompt).slice(0, 40)}.${extension}`,
          metadata: { source: "gemini-image", prompt: input.prompt, generatedAt: new Date().toISOString() }
        }
      });
    }

    return NextResponse.json({ data: { url: blob.url, pathname: blob.pathname, contentType: image.contentType, asset } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate image" }, { status: 400 });
  }
}
