export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateWebsiteWithGemini, generateImageWithGemini } from "@/lib/gemini";
import { componentDefinitions } from "@/lib/component-registry";
import { startStep, completeStep, failStep, completeJob, attachAssetToJob } from "@/lib/generation-jobs";
import { uploadBufferToBlob } from "@/lib/blob";
import { slugify } from "@/lib/utils";

export async function POST(_: Request, { params }: { params: { jobId: string } }) {
  const user = await getCurrentUser();
  const job = await prisma.generationJob.findFirst({ where: { id: params.jobId, userId: user.id } });
  if (!job) return NextResponse.json({ error: "Generation job not found" }, { status: 404 });
  try {
    await prisma.generationJob.update({ where: { id: job.id }, data: { status: "Running", error: null } });
    if (job.type === "website") {
      await startStep(job.id, "generate_website_json", { retry: true, prompt: job.prompt });
      const generated = await generateWebsiteWithGemini({ prompt: job.prompt, industry: (job.metadata as any)?.industry, components: componentDefinitions });
      await completeStep(job.id, "generate_website_json", { name: generated.name, sectionCount: generated.sections.length });
      const data = { ...generated, metadata: { generator: "gemini", generatedAt: new Date().toISOString(), generationJobId: job.id, retried: true } };
      await completeJob(job.id, data as any);
      return NextResponse.json({ data, jobId: job.id });
    }
    if (job.type === "image") {
      await startStep(job.id, "generate_image", { retry: true, prompt: job.prompt });
      const image = await generateImageWithGemini({ prompt: job.prompt });
      await completeStep(job.id, "generate_image", { contentType: image.contentType, bytes: image.buffer.length });
      await startStep(job.id, "upload_to_blob", { websiteId: job.websiteId });
      const extension = image.contentType.includes("jpeg") ? "jpg" : image.contentType.includes("webp") ? "webp" : "png";
      const blob = await uploadBufferToBlob({ pathname: `ai-images/${job.websiteId || user.id}/${slugify(job.prompt).slice(0, 80)}.${extension}`, body: image.buffer, contentType: image.contentType });
      await completeStep(job.id, "upload_to_blob", { url: blob.url });
      let asset = null;
      if (job.websiteId) {
        asset = await prisma.asset.create({ data: { websiteId: job.websiteId, url: blob.url, key: blob.pathname, type: image.contentType, filename: `${slugify(job.prompt).slice(0, 40)}.${extension}`, metadata: { source: "gemini-image-retry", prompt: job.prompt, generationJobId: job.id } } });
        await attachAssetToJob({ jobId: job.id, assetId: asset.id, role: "retry-generated-image" });
      }
      const data = { url: blob.url, pathname: blob.pathname, contentType: image.contentType, asset };
      await completeJob(job.id, data as any);
      return NextResponse.json({ data, jobId: job.id });
    }
    return NextResponse.json({ error: `Retry is not implemented for ${job.type}` }, { status: 400 });
  } catch (error) {
    await failStep(job.id, job.type === "image" ? "generate_image" : "generate_website_json", error).catch(() => null);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Retry failed", jobId: job.id }, { status: 400 });
  }
}
