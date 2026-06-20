export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { generateImageWithGemini } from "@/lib/gemini";
import { uploadBufferToBlob } from "@/lib/blob";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { createGenerationJob, startStep, completeStep, failStep, completeJob, attachAssetToJob } from "@/lib/generation-jobs";

const schema = z.object({ prompt: z.string().min(3), websiteId: z.string().optional(), filename: z.string().optional(), jobId: z.string().optional() });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  let jobId: string | undefined;
  try {
    const input = schema.parse(await request.json());
    const job = input.jobId
      ? await prisma.generationJob.update({ where: { id: input.jobId, userId: user.id }, data: { status: "Running", error: null, prompt: input.prompt } })
      : await createGenerationJob({ userId: user.id, websiteId: input.websiteId, type: "image", prompt: input.prompt, metadata: { filename: input.filename } });
    jobId = job.id;

    await startStep(job.id, "generate_image", { prompt: input.prompt });
    const image = await generateImageWithGemini({ prompt: input.prompt });
    await completeStep(job.id, "generate_image", { contentType: image.contentType, bytes: image.buffer.length });

    await startStep(job.id, "upload_to_blob", { websiteId: input.websiteId });
    const extension = image.contentType.includes("jpeg") ? "jpg" : image.contentType.includes("webp") ? "webp" : "png";
    const pathname = `ai-images/${input.websiteId || user.id}/${slugify(input.filename || input.prompt).slice(0, 80)}.${extension}`;
    const blob = await uploadBufferToBlob({ pathname, body: image.buffer, contentType: image.contentType });
    await completeStep(job.id, "upload_to_blob", { url: blob.url, pathname: blob.pathname });

    let asset = null;
    if (input.websiteId) {
      await startStep(job.id, "save_asset_record", { websiteId: input.websiteId });
      const website = await prisma.website.findFirst({ where: { id: input.websiteId, ownerId: user.id } });
      if (!website) return NextResponse.json({ error: "Website not found", jobId: job.id }, { status: 404 });
      asset = await prisma.asset.create({ data: { websiteId: input.websiteId, url: blob.url, key: blob.pathname, type: image.contentType, filename: input.filename || `${slugify(input.prompt).slice(0, 40)}.${extension}`, metadata: { source: "gemini-image", prompt: input.prompt, generatedAt: new Date().toISOString(), generationJobId: job.id } } });
      await attachAssetToJob({ jobId: job.id, assetId: asset.id, role: "generated-image", metadata: { prompt: input.prompt } });
      await completeStep(job.id, "save_asset_record", { assetId: asset.id });
    }

    const data = { url: blob.url, pathname: blob.pathname, contentType: image.contentType, asset };
    await completeJob(job.id, data as any);
    return NextResponse.json({ data, jobId: job.id }, { status: 201 });
  } catch (error) {
    if (jobId) await failStep(jobId, "image_generation", error).catch(() => null);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate image", jobId }, { status: 400 });
  }
}
