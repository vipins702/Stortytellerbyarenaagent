export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { componentDefinitions } from "@/lib/component-registry";
import { generateWebsiteWithGemini } from "@/lib/gemini";
import { getCurrentUser } from "@/lib/auth";
import { createGenerationJob, startStep, completeStep, failStep, completeJob } from "@/lib/generation-jobs";
import { prisma } from "@/lib/prisma";

const schema = z.object({ prompt: z.string().min(3), industry: z.string().optional(), websiteId: z.string().optional(), jobId: z.string().optional() });

export async function POST(request: Request) {
  const user = await getCurrentUser();
  let jobId: string | undefined;
  try {
    const body = schema.parse(await request.json());
    const job = body.jobId
      ? await prisma.generationJob.update({ where: { id: body.jobId, userId: user.id }, data: { status: "Running", error: null, prompt: body.prompt } })
      : await createGenerationJob({ userId: user.id, websiteId: body.websiteId, type: "website", prompt: body.prompt, metadata: { industry: body.industry } });
    jobId = job.id;

    await startStep(job.id, "prepare_component_contract", { componentCount: componentDefinitions.length });
    await completeStep(job.id, "prepare_component_contract", { components: componentDefinitions.map((item) => item.type) });

    await startStep(job.id, "generate_website_json", { prompt: body.prompt, industry: body.industry });
    const generated = await generateWebsiteWithGemini({ prompt: body.prompt, industry: body.industry, components: componentDefinitions });
    await completeStep(job.id, "generate_website_json", { name: generated.name, sectionCount: generated.sections.length });

    await startStep(job.id, "validate_result", { schema: "generatedWebsiteSchema" });
    await completeStep(job.id, "validate_result", { valid: true });

    const data = { ...generated, metadata: { generator: "gemini", generatedAt: new Date().toISOString(), generationJobId: job.id } };
    await completeJob(job.id, data as any);
    return NextResponse.json({ data, jobId: job.id });
  } catch (error) {
    if (jobId) await failStep(jobId, "generate_website_json", error).catch(() => null);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid generation request", jobId }, { status: 400 });
  }
}
