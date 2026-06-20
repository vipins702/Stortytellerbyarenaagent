export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { componentDefinitions } from "@/lib/component-registry";
import { generateWebsiteWithGemini } from "@/lib/gemini";

const schema = z.object({ prompt: z.string().min(3), industry: z.string().optional() });

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const generated = await generateWebsiteWithGemini({
      prompt: body.prompt,
      industry: body.industry,
      components: componentDefinitions
    });
    return NextResponse.json({ data: { ...generated, metadata: { generator: "gemini", generatedAt: new Date().toISOString() } } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid generation request" }, { status: 400 });
  }
}
