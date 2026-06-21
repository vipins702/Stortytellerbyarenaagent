import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export function getGeminiClient() {
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
}

export const generatedSectionSchema = z.object({
  id: z.string(),
  type: z.enum(["hero", "hero3D", "features", "bentoGrid", "gallery", "marquee", "testimonials", "comparison", "horizontalScroll", "stats", "process", "pricing", "faq", "portfolioGrid", "team", "ctaFullscreen", "footer", "products", "lead", "model3d", "scrollStory"]),
  props: z.record(z.any()),
  animation: z.record(z.any()).default({}),
  metadata: z.record(z.any()).default({})
});

export const generatedWebsiteSchema = z.object({
  name: z.string(),
  industry: z.string().optional(),
  theme: z.record(z.any()),
  seo: z.record(z.any()),
  page: z.record(z.any()).optional(),
  globalFx: z.record(z.any()).optional(),
  accessibility: z.record(z.any()).optional(),
  performance: z.record(z.any()).optional(),
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
          text: `You are the generation engine for ScrollStoryTeller, a premium cinematic website builder. Generate editable metadata JSON only.

Brand style:
- dark cinematic editorial design
- layered violet/cyan/glow color systems
- metadata-driven sections
- premium animation contracts
- $10K-template quality visual richness

Allowed section types: hero, hero3D, features, bentoGrid, gallery, marquee, testimonials, comparison, horizontalScroll, stats, process, pricing, faq, portfolioGrid, team, ctaFullscreen, footer, products, lead, model3d, scrollStory.
Use this component registry as the contract: ${JSON.stringify(input.components)}

User prompt: ${input.prompt}
Industry: ${input.industry || "auto-detect"}

Return only valid JSON matching this shape:
{
  "name": "string",
  "industry": "string",
  "theme": { "preset": "arcticChrome", "colorSystem": {}, "typography": {}, "depth": {}, "motion": {}, "spacing": {}, "threeD": {} },
  "seo": { "title": "string", "description": "string" },
  "page": { "title": "string", "description": "string", "favicon": "", "ogImage": "", "themeColor": "#05050A" },
  "globalFx": { "customCursor": {}, "pageTransition": {}, "smoothScroll": {}, "noiseOverlay": {}, "loadingScreen": {} },
  "accessibility": { "reducedMotion": true, "focusRing": "#8B5CF6", "skipLink": true, "ariaLabels": true },
  "performance": { "lazyLoad": true, "imageFormat": "webp", "prefetch": true, "criticalCSS": true },
  "sections": [
    { "id": "string", "type": "hero|hero3D|features|bentoGrid|gallery|marquee|testimonials|comparison|horizontalScroll|stats|process|pricing|faq|portfolioGrid|team|ctaFullscreen|footer|products|lead|model3d|scrollStory", "props": {}, "animation": { "preset": "luxury-reveal", "entrance": {}, "scroll": {}, "hover": {}, "background": {}, "textFx": {} }, "metadata": {} }
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
          page: { type: Type.OBJECT },
          globalFx: { type: Type.OBJECT },
          accessibility: { type: Type.OBJECT },
          performance: { type: Type.OBJECT },
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
      parts: [{ text: `Generate production-quality exported static HTML for this website JSON. Requirements: inline CSS, responsive, dark cinematic violet/cyan design, accessible semantic HTML, no external network dependencies. Return only the full HTML document.\n\nWebsite JSON:\n${JSON.stringify(input.website)}` }]
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
    contents: [{ role: "user", parts: [{ text: `Create a premium website visual asset. Style: dark cinematic editorial, violet/cyan glow, subtle film grain, high-end product launch polish. Prompt: ${input.prompt}` }] }]
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
