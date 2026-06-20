export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { componentDefinitions } from "@/lib/component-registry";
import { generateWebsiteWithGemini, generateImageWithGemini } from "@/lib/gemini";
import { uploadBufferToBlob } from "@/lib/blob";
import { slugify } from "@/lib/utils";
import { startStep, completeStep, failStep, completeJob, attachAssetToJob } from "@/lib/generation-jobs";

async function retryWebsiteStep(job: any, stepName: string) {
  if (["prepare_component_contract", "generate_website_json", "validate_result"].includes(stepName)) {
    if (stepName === "prepare_component_contract") {
      await startStep(job.id, "prepare_component_contract", { retry: true, componentCount: componentDefinitions.length });
      await completeStep(job.id, "prepare_component_contract", { components: componentDefinitions.map((item) => item.type) });
    }
    await startStep(job.id, "generate_website_json", { retry: true, prompt: job.prompt });
    const generated = await generateWebsiteWithGemini({ prompt: job.prompt, industry: (job.metadata as any)?.industry, components: componentDefinitions });
    await completeStep(job.id, "generate_website_json", { name: generated.name, sectionCount: generated.sections.length });
    await startStep(job.id, "validate_result", { retry: true });
    await completeStep(job.id, "validate_result", { valid: true });
    const data = { ...generated, metadata: { generator: "gemini", generatedAt: new Date().toISOString(), generationJobId: job.id, retriedStep: stepName } };
    await completeJob(job.id, data as any);
    return data;
  }
  throw new Error(`Step ${stepName} cannot be retried for website jobs.`);
}

async function retryImageStep(job: any, stepName: string, userId: string) {
  // Image buffers are not persisted, so upload/save retries resume from the nearest reproducible step: image generation.
  if (!["generate_image", "upload_to_blob", "save_asset_record", "image_generation"].includes(stepName)) {
    throw new Error(`Step ${stepName} cannot be retried for image jobs.`);
  }
  await startStep(job.id, "generate_image", { retry: true, requestedStep: stepName, prompt: job.prompt });
  const image = await generateImageWithGemini({ prompt: job.prompt });
  await completeStep(job.id, "generate_image", { contentType: image.contentType, bytes: image.buffer.length });

  await startStep(job.id, "upload_to_blob", { retry: true, websiteId: job.websiteId });
  const extension = image.contentType.includes("jpeg") ? "jpg" : image.contentType.includes("webp") ? "webp" : "png";
  const blob = await uploadBufferToBlob({ pathname: `ai-images/${job.websiteId || userId}/${slugify(job.prompt).slice(0, 80)}.${extension}`, body: image.buffer, contentType: image.contentType });
  await completeStep(job.id, "upload_to_blob", { url: blob.url, pathname: blob.pathname });

  let asset = null;
  if (job.websiteId) {
    await startStep(job.id, "save_asset_record", { retry: true, websiteId: job.websiteId });
    asset = await prisma.asset.create({ data: { websiteId: job.websiteId, url: blob.url, key: blob.pathname, type: image.contentType, filename: `${slugify(job.prompt).slice(0, 40)}.${extension}`, metadata: { source: "gemini-image-step-retry", prompt: job.prompt, generationJobId: job.id, retriedStep: stepName } } });
    await attachAssetToJob({ jobId: job.id, assetId: asset.id, role: "step-retry-image", metadata: { retriedStep: stepName } });
    await completeStep(job.id, "save_asset_record", { assetId: asset.id });
  }
  const data = { url: blob.url, pathname: blob.pathname, contentType: image.contentType, asset };
  await completeJob(job.id, data as any);
  return data;
}

export async function POST(_: Request, { params }: { params: { jobId: string; stepName: string } }) {
  const user = await getCurrentUser();
  const job = await prisma.generationJob.findFirst({ where: { id: params.jobId, userId: user.id } });
  if (!job) return NextResponse.json({ error: "Generation job not found" }, { status: 404 });
  try {
    await prisma.generationJob.update({ where: { id: job.id }, data: { status: "Running", currentStep: params.stepName, error: null } });
    const data = job.type === "website" ? await retryWebsiteStep(job, params.stepName) : await retryImageStep(job, params.stepName, user.id);
    return NextResponse.json({ data, jobId: job.id, retriedStep: params.stepName });
  } catch (error) {
    await failStep(job.id, params.stepName, error).catch(() => null);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Step retry failed", jobId: job.id, retriedStep: params.stepName }, { status: 400 });
  }
}
