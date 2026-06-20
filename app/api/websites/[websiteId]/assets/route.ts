export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { uploadBufferToBlob } from "@/lib/blob";
import { slugify } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: { websiteId: string } }) {
  const user = await getCurrentUser();
  const assets = await prisma.asset.findMany({ where: { websiteId: params.websiteId, website: { ownerId: user.id } }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: assets });
}

export async function POST(request: Request, { params }: { params: { websiteId: string } }) {
  try {
    const user = await getCurrentUser();
    const website = await prisma.website.findFirst({ where: { id: params.websiteId, ownerId: user.id } });
    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    const form = await request.formData();
    const file = form.get("file");
    const purpose = String(form.get("purpose") || "asset");
    if (!(file instanceof File)) return NextResponse.json({ error: "Missing file" }, { status: 400 });

    const safeName = slugify(file.name.replace(/\.[^.]+$/, "")) || "upload";
    const extension = file.name.split(".").pop() || "bin";
    const pathname = `websites/${params.websiteId}/${purpose}/${safeName}.${extension}`;
    const blob = await uploadBufferToBlob({ pathname, body: file, contentType: file.type || "application/octet-stream" });

    const asset = await prisma.asset.create({
      data: {
        websiteId: params.websiteId,
        url: blob.url,
        key: blob.pathname,
        type: file.type || "application/octet-stream",
        filename: file.name,
        metadata: { purpose, size: file.size, uploadedAt: new Date().toISOString(), provider: "vercel-blob" }
      }
    });

    return NextResponse.json({ data: asset }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to upload asset" }, { status: 400 });
  }
}
