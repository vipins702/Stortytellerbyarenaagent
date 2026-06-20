export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateCodeWithGemini } from "@/lib/gemini";
import { uploadBufferToBlob } from "@/lib/blob";

export async function POST(_: Request, { params }: { params: { websiteId: string } }) {
  try {
    const user = await getCurrentUser();
    const website = await prisma.website.findFirst({
      where: { id: params.websiteId, ownerId: user.id },
      include: { pages: true, products: true, assets: true }
    });
    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    const html = await generateCodeWithGemini({ website });
    const blob = await uploadBufferToBlob({
      pathname: `exports/${website.slug}/index.html`,
      body: Buffer.from(html, "utf8"),
      contentType: "text/html; charset=utf-8"
    });

    return NextResponse.json({ data: { url: blob.url, pathname: blob.pathname, bytes: Buffer.byteLength(html), html } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to export code" }, { status: 400 });
  }
}
