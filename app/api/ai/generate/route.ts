import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ prompt: z.string().min(3), industry: z.string().optional() });

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    // MVP mocked response. Production: call OpenAI, choose template, generate sections/images/SEO metadata.
    return NextResponse.json({
      website: {
        name: body.industry === "SaaS" ? "Aurelia Cloud" : "Maison Aurelia",
        sections: [
          { type: "hero", title: body.industry === "SaaS" ? "Aurelia Cloud" : "Maison Aurelia", body: body.prompt },
          { type: "features", title: "Designed to convert beautifully", body: "AI-selected sections and premium copy." },
          { type: "products", title: "Featured products", body: "Commerce-ready product showcase." }
        ]
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid generation request" }, { status: 400 });
  }
}
