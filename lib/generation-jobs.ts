import { prisma } from "@/lib/prisma";

export async function createGenerationJob(input: { userId: string; websiteId?: string; type: string; prompt: string; metadata?: Record<string, unknown> }) {
  return prisma.generationJob.create({
    data: {
      userId: input.userId,
      websiteId: input.websiteId,
      type: input.type,
      prompt: input.prompt,
      status: "Running",
      metadata: (input.metadata || {}) as any
    }
  });
}

export async function startStep(jobId: string, name: string, input: Record<string, unknown> = {}) {
  await prisma.generationJob.update({ where: { id: jobId }, data: { currentStep: name, status: "Running" } });
  return prisma.generationStep.upsert({
    where: { jobId_name: { jobId, name } },
    update: { status: "Running", input: input as any, error: null, startedAt: new Date() },
    create: { jobId, name, status: "Running", input: input as any, startedAt: new Date() }
  });
}

export async function completeStep(jobId: string, name: string, output: Record<string, unknown> = {}) {
  return prisma.generationStep.update({
    where: { jobId_name: { jobId, name } },
    data: { status: "Completed", output: output as any, endedAt: new Date(), error: null }
  });
}

export async function failStep(jobId: string, name: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  await prisma.generationStep.upsert({
    where: { jobId_name: { jobId, name } },
    update: { status: "Failed", error: message, endedAt: new Date() },
    create: { jobId, name, status: "Failed", error: message, startedAt: new Date(), endedAt: new Date() }
  });
  await prisma.generationJob.update({ where: { id: jobId }, data: { status: "Failed", currentStep: name, error: message } });
}

export async function completeJob(jobId: string, result: Record<string, unknown> = {}) {
  return prisma.generationJob.update({ where: { id: jobId }, data: { status: "Completed", currentStep: "completed", result: result as any, error: null } });
}

export async function attachAssetToJob(input: { jobId: string; assetId: string; role?: string; metadata?: Record<string, unknown> }) {
  return prisma.generationAsset.upsert({
    where: { jobId_assetId: { jobId: input.jobId, assetId: input.assetId } },
    update: { role: input.role || "generated", metadata: (input.metadata || {}) as any },
    create: { jobId: input.jobId, assetId: input.assetId, role: input.role || "generated", metadata: (input.metadata || {}) as any }
  });
}
