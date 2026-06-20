export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const schema = z.object({ business: z.string().min(2), industry: z.string().optional(), audience: z.string().optional(), location: z.string().optional() });

const fallback = (business: string, industry?: string) => ({
  title: `${business} | Premium ${industry || "Brand"} Website`,
  description: `Discover ${business}, a refined destination for thoughtful customers seeking quality, trust and a polished online experience.`,
  keywords: [business, industry || "premium brand", "online store", "luxury website", "customer experience", "modern commerce"].filter(Boolean),
  pageIdeas: ["Homepage", "Product collection", "About the studio", "Contact", "Customer stories"]
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) return NextResponse.json({ data: fallback(input.business, input.industry), source: "local" });
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: `Create search-friendly website copy suggestions for a premium site. Do not mention artificial intelligence. Return JSON only with title, description, keywords array, pageIdeas array.
Business: ${input.business}
Industry: ${input.industry || "general"}
Audience: ${input.audience || "premium customers"}
Location: ${input.location || "global"}` }] }],
      config: { responseMimeType: "application/json" }
    });
    const text = response.text;
    if (!text) return NextResponse.json({ data: fallback(input.business, input.industry), source: "local" });
    return NextResponse.json({ data: JSON.parse(text), source: "gemini" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to suggest keywords" }, { status: 400 });
  }
}
