import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export function getGeminiClient() {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export const generatedSectionSchema = z.object({
  id: z.string(),
  type: z.enum(["hero", "features", "gallery", "products", "lead", "model3d"]),
  props: z.record(z.any()),
  animation: z.record(z.any()).default({}),
  metadata: z.record(z.any()).default({})
});

export const generatedWebsiteSchema = z.object({
  name: z.string(),
  industry: z.string().optional(),
  theme: z.record(z.any()),
  seo: z.record(z.any()),
  sections: z.array(generatedSectionSchema)
});

export type GeneratedWebsite = z.infer<typeof generatedWebsiteSchema>;

export async function generateWebsiteWithGemini(input: { prompt: string; industry?: string; components: unknown }) {
  const ai = getGeminiClient();
  if (!ai) throw new Error("GEMINI_API_KEY is missing. Add it in Vercel Project Settings → Environment Variables.");

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{
          text: `You are the AI engine for Aurelia AI, a premium website builder SaaS. Generate a luxury, editable website JSON only.

Brand style:
- Apple meets Webflow meets Shopify
- white/cream backgrounds, champagne/gold accents, charcoal text
- metadata-driven sections
- premium animations

Allowed section types: hero, features, gallery, products, lead, model3d.
Use this component registry as the contract: ${JSON.stringify(input.components)}

User prompt: ${input.prompt}
Industry: ${input.industry || "auto-detect"}

Return only valid JSON matching this shape:
{
  "name": "string",
  "industry": "string",
  "theme": { "background": "#F8F6F0", "accent": "#D4AF37", "text": "#1a1a1a", "fonts": { "heading": "Playfair Display", "body": "Inter" } },
  "seo": { "title": "string", "description": "string" },
  "sections": [
    { "id": "string", "type": "hero|features|gallery|products|lead|model3d", "props": {}, "animation": {}, "metadata": {} }
  ]
}`
        }]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          industry: { type: Type.STRING },
          theme: { type: Type.OBJECT },
          seo: { type: Type.OBJECT },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                props: { type: Type.OBJECT },
                animation: { type: Type.OBJECT },
                metadata: { type: Type.OBJECT }
              },
              required: ["id", "type", "props"]
            }
          }
        },
        required: ["name", "theme", "seo", "sections"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Gemini returned an empty website generation response.");
  return generatedWebsiteSchema.parse(JSON.parse(text));
}

export async function generateCodeWithGemini(input: { website: unknown }) {
  const ai = getGeminiClient();
  if (!ai) throw new Error("GEMINI_API_KEY is missing. Add it in Vercel Project Settings → Environment Variables.");

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_CODE_MODEL || "gemini-2.5-pro",
    contents: [{
      role: "user",
      parts: [{ text: `Generate production-quality exported static HTML for this website JSON. Requirements: inline CSS, responsive, premium cream/gold/charcoal design, accessible semantic HTML, no external network dependencies. Return only the full HTML document.\n\nWebsite JSON:\n${JSON.stringify(input.website)}` }]
    }]
  });
  const text = response.text;
  if (!text) throw new Error("Gemini returned an empty code export response.");
  return text.replace(/^```html\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
}

export async function generateImageWithGemini(input: { prompt: string }) {
  const ai = getGeminiClient();
  if (!ai) throw new Error("GEMINI_API_KEY is missing. Add it in Vercel Project Settings → Environment Variables.");

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image-preview",
    contents: [{ role: "user", parts: [{ text: `Create a premium website visual asset. Style: luxury editorial, cream background, subtle champagne gold light, Apple/Webflow polish. Prompt: ${input.prompt}` }] }]
  });

  const candidates = response.candidates || [];
  for (const candidate of candidates) {
    for (const part of candidate.content?.parts || []) {
      const inlineData = (part as any).inlineData;
      if (inlineData?.data) {
        return {
          buffer: Buffer.from(inlineData.data, "base64"),
          contentType: inlineData.mimeType || "image/png"
        };
      }
    }
  }
  throw new Error("Gemini did not return image data. Check GEMINI_IMAGE_MODEL access for your API key.");
}
