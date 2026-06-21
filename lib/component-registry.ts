import { z } from "zod";
import { defaultAnimationContract } from "@/lib/premium-schema";

export const sectionTypes = [
  "hero", "hero3D", "features", "bentoGrid", "gallery", "marquee", "testimonials", "comparison", "horizontalScroll", "stats", "process", "pricing", "faq", "portfolioGrid", "team", "ctaFullscreen", "footer", "products", "lead", "model3d", "scrollStory"
] as const;
export const sectionTypeSchema = z.enum(sectionTypes);

export const sectionSchema = z.object({
  id: z.string(),
  type: sectionTypeSchema,
  props: z.record(z.any()).default({}),
  animation: z.record(z.any()).default({}),
  metadata: z.record(z.any()).default({})
});

export const pageSectionsSchema = z.array(sectionSchema);

function def(type: typeof sectionTypes[number], label: string, category: string, description: string, schema: Record<string, unknown>, defaults: Record<string, unknown>, metadata: Record<string, unknown> = {}) {
  return { type, label, category, description, schema, defaults, metadata: { premium: true, ...metadata } };
}

export const componentDefinitions = [
  def("hero", "Hero", "Sections", "Premium conversion hero with headline, copy and CTA.",
    { title: { type: "string", label: "Headline", required: true }, eyebrow: { type: "string" }, body: { type: "string" }, cta: { type: "string" }, imageUrl: { type: "asset" } },
    { eyebrow: "Cinematic launch", title: "Build a Scroll Scrub Page", body: "A polished landing page with motion, products and story.", cta: "Start building", imageUrl: "" },
    { supports: ["seo", "motion", "assetPicker"] }
  ),
  def("hero3D", "3D Hero", "3D", "Premium hero with Spline/Three/particles scene metadata.",
    { eyebrow: { type: "string" }, title: { type: "string" }, titleHighlight: { type: "string" }, subtitle: { type: "string" }, cta: { type: "object" }, scene: { type: "object" }, badge: { type: "object" }, socialProof: { type: "object" }, backgroundFx: { type: "object" } },
    { eyebrow: "Introducing", title: "The next product story", titleHighlight: "in motion", subtitle: "A cinematic hero with depth, glow and interactive scene support.", cta: { primary: "Get access", secondary: "Watch demo" }, scene: { type: "particles", splineUrl: "", fallbackImageUrl: "", interactionMode: "mouse-parallax" }, badge: { text: "Now available", icon: "sparkle" }, socialProof: { avatars: [], count: "2,400+", label: "brands launched" }, backgroundFx: { type: "mesh-gradient", animated: true, intensity: 0.6 } },
    { supports: ["spline", "three", "particles", "hero"] }
  ),
  def("features", "Features", "Sections", "Three glass feature cards with premium motion metadata.",
    { title: { type: "string" }, items: { type: "array" } },
    { title: "Everything your customers need", items: [{ title: "Cinematic sections", body: "Rich layouts built from metadata." }, { title: "Media-first", body: "Images, video and 3D assets." }, { title: "Commerce ready", body: "Products, cart and leads." }] },
    { premium: false, supports: ["cards", "icons"] }
  ),
  def("bentoGrid", "Bento Grid", "Premium", "Asymmetric bento cards for stats, images, quotes and features.",
    { eyebrow: { type: "string" }, title: { type: "string" }, layout: { type: "string" }, cards: { type: "array" } },
    { eyebrow: "Why it works", title: "Built like a premium product system", layout: "asymmetric", cards: [{ id: "b1", size: "2x1", type: "feature", title: "Cinematic layouts", body: "Every section has depth and movement.", icon: "sparkle", accentColor: "#8B5CF6", backgroundFx: "glass", hoverFx: "tilt", mediaUrl: "", badge: "New" }, { id: "b2", size: "1x1", type: "stat", title: "98%", body: "Launch satisfaction", icon: "trophy", accentColor: "#22D3EE", backgroundFx: "gradient", hoverFx: "glow" }, { id: "b3", size: "1x1", type: "quote", title: "Feels bespoke", body: "Not another template.", icon: "quote", accentColor: "#F59E0B", backgroundFx: "noise", hoverFx: "scale" }] },
    { supports: ["masonry", "tilt", "stats"] }
  ),
  def("gallery", "Gallery", "Media", "Editorial parallax image grid.",
    { title: { type: "string" }, images: { type: "asset[]" } }, { title: "Editorial gallery", images: [] }, { supports: ["parallax", "assetLibrary"] }
  ),
  def("marquee", "Marquee", "Motion", "Infinite logo/text/image ticker.",
    { items: { type: "array" }, speed: { type: "string" }, direction: { type: "string" }, pauseOnHover: { type: "boolean" }, rows: { type: "number" }, gradient: { type: "boolean" }, eyebrow: { type: "string" } },
    { eyebrow: "Trusted by", speed: "normal", direction: "left", pauseOnHover: true, rows: 1, gradient: true, items: [{ type: "text", value: "Luminary" }, { type: "text", value: "Apex" }, { type: "tag", value: "Scroll Story" }, { type: "tag", value: "No Code" }] },
    { supports: ["infinite", "logos"] }
  ),
  def("testimonials", "Testimonials", "Social Proof", "Immersive testimonials carousel/wall metadata.",
    { layout: { type: "string" }, items: { type: "array" }, backgroundFx: { type: "string" }, autoPlay: { type: "boolean" } },
    { layout: "spotlight", backgroundFx: "mesh", autoPlay: true, items: [{ quote: "The page felt custom from day one.", author: "Maya Chen", role: "Founder", company: "Luminary", avatarUrl: "", rating: 5, videoUrl: "", featured: true, companyLogoUrl: "" }] },
    { supports: ["carousel", "masonry", "video"] }
  ),
  def("comparison", "Comparison", "Conversion", "Before/after or vs table comparison section.",
    { eyebrow: { type: "string" }, title: { type: "string" }, mode: { type: "string" }, beforeLabel: { type: "string" }, afterLabel: { type: "string" }, features: { type: "array" } },
    { eyebrow: "Why us", title: "Not another flat landing page", mode: "table", beforeLabel: "Templates", afterLabel: "ScrollStoryTeller", features: [{ label: "Cinematic motion", before: false, after: true }, { label: "Reusable media library", before: false, after: true }, { label: "Checkout ready", before: "Limited", after: "Built in" }] },
    { supports: ["table", "slider"] }
  ),
  def("horizontalScroll", "Horizontal Scroll", "Story", "Pinned horizontal scroll panels.",
    { eyebrow: { type: "string" }, title: { type: "string" }, panels: { type: "array" }, pinDuration: { type: "string" }, progressBar: { type: "boolean" } },
    { eyebrow: "Explore", title: "A product story in chapters", pinDuration: "200vh", progressBar: true, panels: [{ id: "p1", type: "feature", title: "Design", body: "Set the mood.", mediaUrl: "", accent: "#8B5CF6" }, { id: "p2", type: "stat", title: "Performance", body: "Show proof.", mediaUrl: "", accent: "#22D3EE" }] },
    { supports: ["pin", "scroll"] }
  ),
  def("stats", "Stats", "Proof", "Premium stats with count-up metadata.",
    { layout: { type: "string" }, backgroundFx: { type: "string" }, items: { type: "array" } },
    { layout: "row", backgroundFx: "gradient", items: [{ value: "98%", label: "Client satisfaction", prefix: "", suffix: "%", countUp: true, icon: "trophy", description: "Based on launches" }, { value: "50K+", label: "Visitors converted", countUp: true, icon: "sparkle" }, { value: "4.9", label: "Average rating", suffix: "★", countUp: true, icon: "star" }] },
    { supports: ["countUp", "proof"] }
  ),
  def("process", "Process", "Conversion", "Timeline/process section.",
    { eyebrow: { type: "string" }, title: { type: "string" }, layout: { type: "string" }, steps: { type: "array" }, connectorStyle: { type: "string" } },
    { eyebrow: "How it works", title: "From footage to page", layout: "vertical", connectorStyle: "gradient", steps: [{ number: "01", title: "Upload", body: "Add product video or images.", icon: "upload", mediaUrl: "", accentColor: "#8B5CF6" }, { number: "02", title: "Generate", body: "Create story sections.", icon: "sparkle", accentColor: "#22D3EE" }, { number: "03", title: "Publish", body: "Launch with checkout and SEO.", icon: "rocket", accentColor: "#F59E0B" }] },
    { supports: ["timeline", "steps"] }
  ),
  def("pricing", "Pricing", "Commerce", "Pricing cards/table metadata.",
    { eyebrow: { type: "string" }, title: { type: "string" }, billing: { type: "string" }, layout: { type: "string" }, plans: { type: "array" }, guarantee: { type: "string" } },
    { eyebrow: "Pricing", title: "Choose your launch plan", billing: "monthly", layout: "cards", guarantee: "30-day money back guarantee", plans: [{ id: "starter", name: "Starter", price: { monthly: 0, annual: 0 }, currency: "$", badge: "Free", highlighted: false, description: "Start simple", features: [{ text: "2 websites", included: true }], cta: { label: "Start", url: "/signup" }, accentColor: "#8B5CF6" }, { id: "pro", name: "Pro", price: { monthly: 29, annual: 290 }, currency: "$", badge: "Popular", highlighted: true, description: "For active brands", features: [{ text: "10 websites", included: true }, { text: "Custom domain", included: true }], cta: { label: "Upgrade", url: "/billing" }, accentColor: "#22D3EE" }] },
    { supports: ["billing", "cards"] }
  ),
  def("faq", "FAQ", "Support", "Searchable FAQ/accordion metadata.",
    { eyebrow: { type: "string" }, title: { type: "string" }, layout: { type: "string" }, searchable: { type: "boolean" }, items: { type: "array" } },
    { eyebrow: "FAQ", title: "Questions before launch", layout: "accordion", searchable: true, items: [{ question: "Can I upload video?", answer: "Yes, MP4 and WebM uploads are supported.", category: "Media" }, { question: "Can I sell products?", answer: "Yes, products, variants and checkout are included.", category: "Commerce" }] },
    { supports: ["accordion", "search"] }
  ),
  def("portfolioGrid", "Portfolio Grid", "Portfolio", "Premium work grid with media hover metadata.",
    { eyebrow: { type: "string" }, title: { type: "string" }, layout: { type: "string" }, filterable: { type: "boolean" }, categories: { type: "array" }, items: { type: "array" }, cta: { type: "object" } },
    { eyebrow: "Work", title: "Selected launches", layout: "featured", filterable: true, categories: ["All", "Product", "Motion"], items: [{ id: "work-1", title: "Apex Launch", category: "Product", thumbnailUrl: "", videoUrl: "", hoverFx: "video-preview", accentColor: "#8B5CF6", client: "Luminary", year: "2026", tags: ["Scroll", "Commerce"] }], cta: { label: "View all work", url: "#" } },
    { supports: ["portfolio", "filters"] }
  ),
  def("team", "Team", "Company", "Team grid/carousel metadata.",
    { eyebrow: { type: "string" }, title: { type: "string" }, layout: { type: "string" }, members: { type: "array" } },
    { eyebrow: "Team", title: "Built by specialists", layout: "grid", members: [{ name: "Alex Morgan", role: "Creative Director", bio: "Builds cinematic product systems.", avatarUrl: "", socials: { linkedin: "", twitter: "", instagram: "" }, hoverFx: "reveal-bio" }] },
    { supports: ["people", "social"] }
  ),
  def("ctaFullscreen", "Fullscreen CTA", "Conversion", "Full-screen final CTA with aurora/video background.",
    { eyebrow: { type: "string" }, title: { type: "string" }, titleHighlight: { type: "string" }, body: { type: "string" }, cta: { type: "object" }, backgroundFx: { type: "object" }, layout: { type: "string" } },
    { eyebrow: "Ready", title: "Launch a page that feels", titleHighlight: "cinematic", body: "Turn your product story into a premium page today.", cta: { primary: "Start building", secondary: "View demo" }, backgroundFx: { type: "aurora", videoUrl: "", intensity: 0.8 }, layout: "center" },
    { supports: ["aurora", "video", "finalCta"] }
  ),
  def("footer", "Ambient Footer", "Navigation", "Premium footer with newsletter and grouped links.",
    { logo: { type: "object" }, tagline: { type: "string" }, links: { type: "array" }, socials: { type: "array" }, newsletter: { type: "object" }, backgroundFx: { type: "string" }, bottomBar: { type: "object" } },
    { logo: { text: "ScrollStoryTeller", imageUrl: "" }, tagline: "Build cinematic product pages.", links: [{ group: "Product", items: [{ label: "Studio", url: "/builder" }, { label: "Templates", url: "/templates" }] }], socials: [], newsletter: { enabled: true, headline: "Stay in the loop", placeholder: "your@email.com" }, backgroundFx: "mesh", bottomBar: { copyright: "© 2026", links: [{ label: "Privacy", url: "#" }, { label: "Terms", url: "#" }] } },
    { supports: ["newsletter", "links"] }
  ),
  def("products", "Product cards", "Commerce", "DB-driven product showcase connected to CMS products.",
    { title: { type: "string" }, limit: { type: "number" } }, { title: "Featured products", limit: 3 }, { premium: false, supports: ["productSource", "checkout"] }
  ),
  def("scrollStory", "Scroll Storytelling", "Story", "Premium scroll-driven story section with image or video panels.",
    { eyebrow: { type: "string" }, title: { type: "string" }, body: { type: "string" }, mediaUrl: { type: "asset" }, mediaType: { type: "string" }, chapters: { type: "array" } },
    { eyebrow: "Story", title: "A journey told in motion", body: "Guide visitors through a polished sequence of visuals, product moments and narrative details.", mediaUrl: "", mediaType: "video", chapters: [{ title: "Opening moment", body: "Introduce the world, mood and promise." }, { title: "Craft and detail", body: "Show what makes the product or service valuable." }, { title: "Invitation", body: "End with a clear next step for the visitor." }] },
    { supports: ["video", "image", "stickyScroll", "storytelling"] }
  ),
  def("model3d", "3D Model Showcase", "3D", "Premium GLB/GLTF product model section backed by Vercel Blob assets.",
    { title: { type: "string" }, body: { type: "string" }, assetUrl: { type: "asset" }, scale: { type: "number" }, autoRotate: { type: "boolean" }, environment: { type: "string" } },
    { title: "Explore every detail", body: "A closer look at the craftsmanship, materials and form.", assetUrl: "", scale: 1.6, autoRotate: true, environment: "city" },
    { supports: ["modelViewer", "lighting", "commerce"] }
  ),
  def("lead", "Lead capture", "Forms", "Contact capture block connected to Lead API.",
    { title: { type: "string" }, placeholder: { type: "string" } }, { title: "Join the private list", placeholder: "email@brand.com" }, { premium: false, supports: ["notifications", "webhooks"] }
  )
] as const;

export function createSection(type: string) {
  const definition = componentDefinitions.find((item) => item.type === type);
  if (!definition) throw new Error(`Unknown component type: ${type}`);
  return {
    id: crypto.randomUUID(),
    type: definition.type,
    props: definition.defaults,
    animation: defaultAnimationContract,
    metadata: { source: "component-library", definitionVersion: 2 }
  };
}
