export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { componentDefinitions, createSection } from "@/lib/component-registry";

const schema = z.object({ prompt: z.string().min(3), industry: z.string().optional() });

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    // API-first contract. If OPENAI_API_KEY exists, this is where the model call is plugged in.
    // The response remains metadata-driven and validates against the builder section schema.
    const isCommerce = /shop|store|product|commerce|skincare|fashion/i.test(body.prompt);
    const isSaas = /saas|software|platform|app/i.test(body.prompt);
    const sections = [
      { ...createSection("hero"), props: { ...createSection("hero").props, title: isSaas ? "Aurelia Cloud" : "Maison Aurelia", body: body.prompt } },
      createSection("features"),
      ...(isCommerce ? [createSection("products")] : []),
      createSection("gallery"),
      createSection("lead")
    ];
    return NextResponse.json({
      data: {
        name: isSaas ? "Aurelia Cloud" : "Maison Aurelia",
        industry: body.industry,
        sections,
        metadata: {
          generator: process.env.OPENAI_API_KEY ? "openai-ready" : "rules-engine",
          componentDefinitions: componentDefinitions.map((d) => ({ type: d.type, schema: d.schema, metadata: d.metadata }))
        }
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid generation request" }, { status: 400 });
  }
}
