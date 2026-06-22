import { defaultAnimationContract, defaultPremiumTheme, premiumColorSystems } from "@/lib/premium-schema";

const a = defaultAnimationContract;

export const premiumTemplates = [
  {
    name: "Apex Product Launch",
    slug: "apex-product-launch",
    industry: "Luxury Tech",
    description: "A cinematic launch page for premium hardware and wearable products.",
    colorSystem: "arcticChrome",
    sections: ["hero3D", "marquee", "bentoGrid", "scrollStory", "stats", "products", "faq", "ctaFullscreen", "footer"],
    theme: { ...defaultPremiumTheme, preset: "arcticChrome", colorSystem: premiumColorSystems.arcticChrome.palette },
    preview: { gradient: "from-cyan/30 via-violet/25 to-emerald-400/20" },
    page: { title: "Apex — Premium Product Experience", description: "A cinematic product page for premium hardware.", themeColor: "#06080F" }
  },
  {
    name: "Noir Beauty Drop",
    slug: "noir-beauty-drop",
    industry: "Beauty / Fashion",
    description: "A rose-toned editorial launch page for beauty, skincare and fashion drops.",
    colorSystem: "roseNoir",
    sections: ["hero3D", "gallery", "bentoGrid", "testimonials", "products", "faq", "footer"],
    theme: { ...defaultPremiumTheme, preset: "roseNoir", colorSystem: premiumColorSystems.roseNoir.palette },
    preview: { gradient: "from-pink-400/30 via-purple-400/25 to-orange-300/20" },
    page: { title: "Noir Beauty Drop", description: "Editorial beauty landing page.", themeColor: "#080408" }
  },
  {
    name: "Obsidian Advisor",
    slug: "obsidian-advisor",
    industry: "Finance / Legal",
    description: "A refined authority site for premium advisory, finance and legal brands.",
    colorSystem: "obsidianGold",
    sections: ["hero3D", "stats", "comparison", "process", "testimonials", "pricing", "faq", "footer"],
    theme: { ...defaultPremiumTheme, preset: "obsidianGold", colorSystem: premiumColorSystems.obsidianGold.palette },
    preview: { gradient: "from-yellow-500/30 via-amber-300/20 to-stone-600/25" },
    page: { title: "Obsidian Advisor", description: "Premium advisory website.", themeColor: "#0A0800" }
  },
  {
    name: "Ember Agency Reel",
    slug: "ember-agency-reel",
    industry: "Creative Agency",
    description: "A fiery motion-forward site for studios, agencies and creative portfolios.",
    colorSystem: "emberDark",
    sections: ["hero3D", "portfolioGrid", "horizontalScroll", "stats", "process", "ctaFullscreen", "footer"],
    theme: { ...defaultPremiumTheme, preset: "emberDark", colorSystem: premiumColorSystems.emberDark.palette },
    preview: { gradient: "from-orange-600/35 via-amber-400/20 to-yellow-300/20" },
    page: { title: "Ember Agency Reel", description: "Motion-first agency page.", themeColor: "#080500" }
  },
  {
    name: "Malachite Wellness",
    slug: "malachite-wellness",
    industry: "Wellness / Eco",
    description: "A calm premium wellness page with organic visuals and product storytelling.",
    colorSystem: "malachite",
    sections: ["hero3D", "bentoGrid", "scrollStory", "products", "testimonials", "lead", "footer"],
    theme: { ...defaultPremiumTheme, preset: "malachite", colorSystem: premiumColorSystems.malachite.palette },
    preview: { gradient: "from-emerald-400/30 via-teal-300/20 to-lime-300/20" },
    page: { title: "Malachite Wellness", description: "Premium wellness product story.", themeColor: "#020A04" }
  },
  {
    name: "SaaS Aurora",
    slug: "saas-aurora",
    industry: "SaaS",
    description: "A crisp conversion page for modern software with pricing and proof.",
    colorSystem: "arcticChrome",
    sections: ["hero3D", "marquee", "features", "bentoGrid", "pricing", "faq", "ctaFullscreen", "footer"],
    theme: { ...defaultPremiumTheme, preset: "arcticChrome", colorSystem: premiumColorSystems.arcticChrome.palette },
    preview: { gradient: "from-sky-400/30 via-indigo-400/25 to-cyan-300/20" },
    page: { title: "SaaS Aurora", description: "Modern SaaS landing page.", themeColor: "#06080F" }
  },
  {
    name: "Spline Hardware Reveal",
    slug: "spline-hardware-reveal",
    industry: "3D Hardware",
    description: "A 3D-first product story designed for Spline or GLB model showcases.",
    colorSystem: "arcticChrome",
    sections: ["hero3D", "model3d", "scrollStory", "stats", "products", "ctaFullscreen", "footer"],
    theme: { ...defaultPremiumTheme, preset: "arcticChrome", colorSystem: premiumColorSystems.arcticChrome.palette },
    preview: { gradient: "from-violet/30 via-cyan/25 to-white/10" },
    page: { title: "Spline Hardware Reveal", description: "3D hardware product launch.", themeColor: "#06080F" }
  },
  {
    name: "Creator Course Launch",
    slug: "creator-course-launch",
    industry: "Creator / Education",
    description: "A polished launch page for courses, cohorts, creators and digital products.",
    colorSystem: "emberDark",
    sections: ["hero3D", "marquee", "process", "testimonials", "pricing", "faq", "lead", "footer"],
    theme: { ...defaultPremiumTheme, preset: "emberDark", colorSystem: premiumColorSystems.emberDark.palette },
    preview: { gradient: "from-purple-400/25 via-orange-400/25 to-yellow-300/20" },
    page: { title: "Creator Course Launch", description: "Premium creator launch page.", themeColor: "#080500" }
  }
] as const;

export function buildTemplateSections(template: (typeof premiumTemplates)[number]) {
  return template.sections.map((type, index) => ({
    id: `${template.slug}-${type}-${index + 1}`,
    type,
    props: defaultPropsFor(type, template),
    animation: a,
    metadata: { source: "premium-template", template: template.slug }
  }));
}

function defaultPropsFor(type: string, template: (typeof premiumTemplates)[number]) {
  const title = template.name;
  const product = template.industry.includes("SaaS") ? "platform" : "product";
  const map: Record<string, any> = {
    hero3D: { eyebrow: template.industry, title, titleHighlight: "in motion", subtitle: template.description, primaryCta: "Start building", secondaryCta: "View story", sceneType: "particles", badge: { text: "Now available", icon: "sparkle" }, socialProof: { count: "2,400+", label: "launches created", avatars: [] }, backgroundFx: { type: "mesh-gradient", animated: true, intensity: 0.6 } },
    hero: { eyebrow: template.industry, title, body: template.description, cta: "Start building" },
    bentoGrid: { eyebrow: "Why it works", title: `Built for ${template.industry}`, cards: [{ id: "b1", size: "2x1", type: "feature", title: "Cinematic layout", body: "Designed with layered depth and motion.", accentColor: "#8B5CF6", backgroundFx: "glass", hoverFx: "tilt" }, { id: "b2", size: "1x1", type: "stat", title: "98%", body: "Launch confidence", accentColor: "#22D3EE", backgroundFx: "gradient", hoverFx: "glow" }, { id: "b3", size: "1x1", type: "quote", title: "Premium", body: "Feels like a bespoke campaign.", accentColor: "#F59E0B", backgroundFx: "noise", hoverFx: "scale" }] },
    marquee: { eyebrow: "Built for", items: [{ type: "text", value: "Product Launch" }, { type: "tag", value: "Scroll Story" }, { type: "tag", value: "3D" }, { type: "text", value: "Commerce" }], speed: "normal", direction: "left", pauseOnHover: true, rows: 1, gradient: true },
    stats: { title: "Proof that moves", items: [{ value: "98%", label: "Launch satisfaction", suffix: "%", countUp: true }, { value: "50K+", label: "Visitors reached", countUp: true }, { value: "4.9", label: "Average rating", suffix: "★", countUp: true }] },
    scrollStory: { eyebrow: "Story", title: `A ${product} story in motion`, body: "Use media chapters to guide visitors through the product, proof and purchase moment.", mediaUrl: "", mediaType: "video", chapters: [{ title: "Opening moment", body: "Set the tone and show the promise." }, { title: "Craft and detail", body: "Explain what makes the offer valuable." }, { title: "Conversion", body: "End with a clear action." }] },
    products: { title: "Featured products", limit: 3 },
    features: { title: "What makes it different", items: [{ title: "Fast setup", body: "Launch without complex tooling." }, { title: "Premium media", body: "Use images, video and 3D." }, { title: "Commerce ready", body: "Checkout and lead capture included." }] },
    process: { eyebrow: "How it works", title: "From media to launch", steps: [{ number: "01", title: "Upload", body: "Add product video and visuals." }, { number: "02", title: "Generate", body: "Create a structured page." }, { number: "03", title: "Publish", body: "Launch with SEO and checkout." }], layout: "zigzag", connectorStyle: "gradient" },
    pricing: { eyebrow: "Pricing", title: "Choose your launch plan", billing: "both", layout: "cards", plans: [{ id: "starter", name: "Starter", price: { monthly: 0, annual: 0 }, currency: "$", badge: "Free", highlighted: false, description: "Start simple", features: [{ text: "2 pages", included: true }], cta: { label: "Start", url: "/signup" } }, { id: "pro", name: "Pro", price: { monthly: 29, annual: 290 }, currency: "$", badge: "Popular", highlighted: true, description: "Launch faster", features: [{ text: "Premium sections", included: true }], cta: { label: "Upgrade", url: "/billing" } }], guarantee: "30-day money back guarantee" },
    faq: { eyebrow: "FAQ", title: "Questions before launch", searchable: true, items: [{ question: "Can I use videos?", answer: "Yes, upload MP4/WebM and use them in scroll stories." }, { question: "Can I sell products?", answer: "Yes, products, variants and checkout are supported." }] },
    testimonials: { layout: "spotlight", items: [{ quote: "The result felt custom and cinematic.", author: "Maya Chen", role: "Founder", company: "Luminary", rating: 5, featured: true }], backgroundFx: "mesh", autoPlay: true },
    comparison: { eyebrow: "Why us", title: "More than a flat template", beforeLabel: "Flat sites", afterLabel: "ScrollStoryTeller", features: [{ label: "Cinematic motion", before: false, after: true }, { label: "Media library", before: "Limited", after: true }, { label: "Checkout", before: false, after: true }] },
    horizontalScroll: { eyebrow: "Explore", title: "A story across panels", panels: [{ id: "p1", title: "Mood", body: "Set the scene." }, { id: "p2", title: "Proof", body: "Show the value." }, { id: "p3", title: "Action", body: "Invite conversion." }], pinDuration: "200vh", progressBar: true },
    portfolioGrid: { eyebrow: "Work", title: "Selected launches", filterable: true, categories: ["All", "Product", "Motion"], items: [{ id: "w1", title: title, category: template.industry, year: "2026", tags: ["Story", "Launch"] }], cta: { label: "View work", url: "#" } },
    team: { eyebrow: "Team", title: "Built by specialists", members: [{ name: "Alex Morgan", role: "Creative Director", bio: "Builds cinematic systems." }] },
    model3d: { title: "Explore every detail", body: "Add a GLB/GLTF model or Spline scene for a richer product experience.", assetUrl: "", scale: 1.6, autoRotate: true, environment: "city" },
    ctaFullscreen: { eyebrow: "Ready", title: "Launch a page that feels", titleHighlight: "cinematic", body: "Turn your product story into a premium experience.", cta: { primary: "Start building", secondary: "View demo" }, backgroundFx: { type: "aurora", intensity: 0.8 }, layout: "center" },
    lead: { title: "Join the private list", placeholder: "email@brand.com" },
    footer: { logo: { text: "ScrollStoryTeller", imageUrl: "" }, tagline: "Build cinematic product pages.", links: [{ group: "Product", items: [{ label: "Studio", url: "/studio" }, { label: "Templates", url: "/templates" }] }], socials: [], newsletter: { enabled: true, headline: "Stay in the loop", placeholder: "your@email.com" }, backgroundFx: "mesh", bottomBar: { copyright: "© 2026", links: [{ label: "Privacy", url: "#" }, { label: "Terms", url: "#" }] } }
  };
  return map[type] || { title, body: template.description };
}
