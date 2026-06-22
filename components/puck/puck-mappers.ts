import type { Data } from "@measured/puck";

const typeMap: Record<string, string> = {
  hero: "Hero3D",
  hero3D: "Hero3D",
  bentoGrid: "BentoGrid",
  marquee: "Marquee",
  stats: "Stats",
  pricing: "Pricing",
  faq: "FAQ",
  scrollStory: "ScrollStory",
  products: "ProductGrid",
  ctaFullscreen: "CTA",
  footer: "Footer",
  features: "BentoGrid"
};

const reverseMap: Record<string, string> = Object.fromEntries(Object.entries(typeMap).map(([k, v]) => [v, k]));
reverseMap.Hero3D = "hero3D";
reverseMap.BentoGrid = "bentoGrid";
reverseMap.ProductGrid = "products";
reverseMap.CTA = "ctaFullscreen";
reverseMap.ScrollStory = "scrollStory";

export function sectionsToPuckData(sections: any[] = []): Data {
  return {
    root: { props: { title: "ScrollStoryTeller Page" } },
    content: sections.map((section) => ({
      type: typeMap[section.type] || "BentoGrid",
      props: {
        id: section.id,
        ...(section.props || {}),
        __originalType: section.type,
        __animation: section.animation || {},
        __metadata: section.metadata || {}
      }
    }))
  } as Data;
}

export function puckDataToSections(data: Data): any[] {
  return (data.content || []).map((item: any) => {
    const props = { ...(item.props || {}) };
    const originalType = props.__originalType;
    const animation = props.__animation || { preset: "luxury-reveal" };
    const metadata = props.__metadata || { source: "puck-studio" };
    delete props.__originalType;
    delete props.__animation;
    delete props.__metadata;
    const id = props.id || crypto.randomUUID();
    delete props.id;
    return {
      id,
      type: originalType || reverseMap[item.type] || item.type,
      props,
      animation,
      metadata: { ...metadata, source: "puck-studio" }
    };
  });
}
