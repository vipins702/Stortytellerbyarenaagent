export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({ currentStep: z.number().int().min(1).max(10).optional(), completed: z.boolean().optional(), checklist: z.record(z.any()).optional() });

export async function GET() {
  const user = await getCurrentUser();
  const state = await prisma.onboardingState.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id, checklist: {} } });
  return NextResponse.json({ data: state });
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    const input = schema.parse(await request.json());
    const state = await prisma.onboardingState.upsert({
      where: { userId: user.id },
      update: input,
      create: { userId: user.id, currentStep: input.currentStep || 1, completed: input.completed || false, checklist: input.checklist || {} }
    });
    return NextResponse.json({ data: state });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update onboarding" }, { status: 400 });
  }
}
