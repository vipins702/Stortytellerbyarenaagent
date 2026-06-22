import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

export const blueprintInputSchema = z.object({
  brandName: z.string().min(2),
  productService: z.string().min(2),
  targetAudience: z.string().min(2),
  vibe: z.string().min(2),
  colors: z.string().optional(),
  websiteId: z.string().optional()
});

export const creativeBlueprintSchema = z.object({
  brandIdentity: z.record(z.any()),
  loadingScreen: z.record(z.any()),
  navigation: z.record(z.any()),
  hero: z.record(z.any()),
  scrollNarrative: z.object({ chapters: z.array(z.record(z.any())) }).passthrough(),
  productDisplay: z.record(z.any()),
  leadCapture: z.record(z.any()),
  socialProof: z.record(z.any()),
  footer: z.record(z.any()),
  microInteractions: z.record(z.any()),
  imagePromptPack: z.array(z.record(z.any())),
  summaryCard: z.record(z.any())
});

export type BlueprintInput = z.infer<typeof blueprintInputSchema>;
export type CreativeBlueprint = z.infer<typeof creativeBlueprintSchema>;

export function buildCreativeDirectorPrompt(input: BlueprintInput) {
  return `You are an elite premium website architect, creative director, and storytelling engineer for 2026. Generate a COMPLETE, DETAILED, SECTION-BY-SECTION premium website blueprint that feels like Awwwards, FWA, Apple.com, Runway and Spline.

USER INPUT:
Brand Name: ${input.brandName}
Product/Service: ${input.productService}
Target Audience: ${input.targetAudience}
Vibe/Mood: ${input.vibe}
Colors: ${input.colors || "choose premium colors based on vibe"}

Return ONLY valid JSON. No markdown. No commentary.

JSON SHAPE:
{
  "brandIdentity": {
    "personality": ["word", "word", "word"],
    "emotionalPromise": "what visitor feels in first 3 seconds",
    "primaryColor": "#hex",
    "secondaryAccentColor": "#hex",
    "backgroundColor": "#hex",
    "fontPairing": { "heading": "font", "body": "font", "accent": "font" },
    "visualMetaphor": "specific visual world"
  },
  "loadingScreen": { "animationStyle": "specific", "soundDesign": "specific", "transitionIntoSite": "specific" },
  "navigation": { "navStyle": "specific", "logoPlacement": "Left|Center", "links": ["4-5 links"], "ctaButton": { "text": "", "style": "" }, "scrollBehavior": "specific", "customCursor": "specific" },
  "hero": { "aiVideoBackgroundPrompt": "Runway/Kling-ready prompt", "webglShaderOverlay": "specific", "headline": "5-8 words", "headlineAnimation": "timing specific", "subHeadline": "1-2 lines", "ctaButtons": { "primary": "", "secondary": "", "hoverAnimation": "" }, "splineObjectDescription": "specific", "scrollIndicator": "specific" },
  "scrollNarrative": { "chapters": [ { "chapterTitle": "", "scrollTrigger": "", "visual": "", "headline": "", "bodyCopy": "", "animationDetail": "", "transition": "", "imagePrompt": "optional direct image prompt" } ] },
  "productDisplay": { "sectionHeadline": "", "sectionSubCopy": "", "cardStyleDescription": "", "cardHoverInteraction": "", "cardEntranceAnimation": "", "quickViewModal": "" },
  "leadCapture": { "sectionVisual": "", "backgroundImagePrompt": "", "headline": "", "subCopy": "", "formFields": ["max 3"], "submitButton": { "text": "", "style": "" }, "formAnimation": "", "urgencyElement": "" },
  "socialProof": { "stats": [ { "value": "", "label": "", "animation": "" } ], "testimonialStyle": "", "logoStrip": "" },
  "footer": { "footerHeadline": "", "footerVisual": "", "footerLayout": "", "finalCta": "", "copyrightLine": "" },
  "microInteractions": { "smoothScroll": "Lenis settings", "pageTransition": "", "imageHover": "", "buttonStates": "", "linkUnderline": "", "sectionEntrance": "", "mobileAdaptations": "", "performanceNote": "" },
  "imagePromptPack": [ { "label": "Prompt 1 — Hero background fallback image", "prompt": "direct prompt" } ],
  "summaryCard": { "primaryColor": "#hex", "accentColor": "#hex", "background": "#hex", "headingFont": "", "bodyFont": "", "heroVideoStyle": "", "threeDObject": "", "storyArc": "", "leadFormGoal": "", "emotionalFeeling": "", "awwwardsScore": "x/10" }
}

Rules:
- Exactly 5 scrollNarrative chapters.
- Include exactly 9 imagePromptPack prompts.
- Every animation includes timing in ms.
- Every color is a hex code.
- Use specific cinematic language.
- No generic words like beautiful/modern unless qualified by exact visual details.`;
}

export async function generateCreativeBlueprint(input: BlueprintInput) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is missing.");
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: buildCreativeDirectorPrompt(input) }] }],
    config: { responseMimeType: "application/json" }
  });
  const text = response.text;
  if (!text) throw new Error("Gemini returned an empty blueprint.");
  return creativeBlueprintSchema.parse(JSON.parse(text));
}

export function blueprintToSections(blueprint: CreativeBlueprint) {
  return [
    { id: crypto.randomUUID(), type: "hero3D", props: { eyebrow: blueprint.brandIdentity.personality?.join(" · "), title: blueprint.hero.headline, titleHighlight: "", subtitle: blueprint.hero.subHeadline, cta: { primary: blueprint.hero.ctaButtons?.primary, secondary: blueprint.hero.ctaButtons?.secondary }, scene: { type: "particles", interactionMode: "mouse-parallax" }, badge: { text: "Now available", icon: "sparkle" }, backgroundFx: { type: "mesh-gradient", animated: true, intensity: 0.7 } }, animation: { preset: "luxury-reveal" }, metadata: { source: "creative-blueprint" } },
    { id: crypto.randomUUID(), type: "scrollStory", props: { eyebrow: "Story", title: "The story unfolds", body: blueprint.brandIdentity.visualMetaphor, chapters: blueprint.scrollNarrative.chapters.map((chapter) => ({ title: chapter.headline, body: chapter.bodyCopy, visual: chapter.visual })), mediaUrl: "", mediaType: "video" }, animation: { preset: "scroll-scrub" }, metadata: { source: "creative-blueprint" } },
    { id: crypto.randomUUID(), type: "stats", props: { title: "Proof in motion", items: blueprint.socialProof.stats }, animation: { preset: "count-up" }, metadata: { source: "creative-blueprint" } },
    { id: crypto.randomUUID(), type: "products", props: { title: blueprint.productDisplay.sectionHeadline, body: blueprint.productDisplay.sectionSubCopy, limit: 3 }, animation: { preset: "stagger" }, metadata: { source: "creative-blueprint" } },
    { id: crypto.randomUUID(), type: "lead", props: { title: blueprint.leadCapture.headline, placeholder: blueprint.leadCapture.formFields?.[0] || "email@brand.com" }, animation: { preset: "reveal" }, metadata: { source: "creative-blueprint" } },
    { id: crypto.randomUUID(), type: "ctaFullscreen", props: { eyebrow: "Invitation", title: blueprint.footer.footerHeadline, body: blueprint.footer.finalCta, cta: { primary: blueprint.hero.ctaButtons?.primary || "Start" } }, animation: { preset: "cinematic" }, metadata: { source: "creative-blueprint" } },
    { id: crypto.randomUUID(), type: "footer", props: { logo: { text: blueprint.summaryCard?.brandName || "ScrollStory" }, tagline: blueprint.footer.copyrightLine, links: [], socials: [], newsletter: { enabled: true, headline: "Stay in the loop", placeholder: "your@email.com" }, bottomBar: { copyright: blueprint.footer.copyrightLine, links: [] } }, animation: { preset: "fade" }, metadata: { source: "creative-blueprint" } }
  ];
}
