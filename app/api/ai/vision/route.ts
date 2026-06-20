export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { componentDefinitions } from "@/lib/component-registry";
import { generatedWebsiteSchema } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is missing.");
    const form = await request.formData();
    const file = form.get("image");
    const prompt = String(form.get("prompt") || "Convert this scene or screenshot into a premium editable website.");
    if (!(file instanceof File)) return NextResponse.json({ error: "Missing image" }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `Analyze this uploaded scene/screenshot and generate website JSON for Aurelia AI. Use only section types hero, features, gallery, products, lead. Component registry: ${JSON.stringify(componentDefinitions)}. User instruction: ${prompt}. Return only JSON with name, industry, theme, seo, sections.` }, { inlineData: { data: bytes.toString("base64"), mimeType: file.type || "image/png" } }] }],
      config: { responseMimeType: "application/json" }
    });
    const text = response.text;
    if (!text) throw new Error("Gemini returned empty vision response.");
    return NextResponse.json({ data: generatedWebsiteSchema.parse(JSON.parse(text)) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Vision generation failed" }, { status: 400 });
  }
}
