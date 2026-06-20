export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({ websiteId: z.string().optional(), type: z.string().min(2), prompt: z.string().min(3), metadata: z.record(z.any()).default({}) });

export async function GET(request: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const websiteId = searchParams.get("websiteId") || undefined;
  const jobs = await prisma.generationJob.findMany({
    where: { userId: user.id, websiteId },
    include: { steps: { orderBy: { createdAt: "asc" } }, assets: { include: { asset: true } } },
    orderBy: { createdAt: "desc" },
    take: 20
  });
  return NextResponse.json({ data: jobs });
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    const input = createSchema.parse(await request.json());
    const job = await prisma.generationJob.create({
      data: { userId: user.id, websiteId: input.websiteId, type: input.type, prompt: input.prompt, status: "Queued", metadata: input.metadata }
    });
    return NextResponse.json({ data: job }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create generation job" }, { status: 400 });
  }
}
