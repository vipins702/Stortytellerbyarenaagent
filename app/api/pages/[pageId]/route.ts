export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { updatePageSectionsSchema } from "@/lib/validators";
import { assertWebsitePermission } from "@/lib/permissions";
import { audit } from "@/lib/audit";
import { assertRateLimit, rateLimitKey } from "@/lib/rate-limit";

export async function PATCH(request: Request, { params }: { params: { pageId: string } }) {
  try {
    assertRateLimit({ key: rateLimitKey(request, "page-save"), limit: 60, windowMs: 60_000 });
    const user = await getCurrentUser();
    const input = updatePageSectionsSchema.parse(await request.json());
    const page = await prisma.page.findUnique({ where: { id: params.pageId } });
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    await assertWebsitePermission({ userId: user.id, websiteId: page.websiteId, permission: "website:write" });
    const updated = await prisma.page.update({ where: { id: params.pageId }, data: { sections: input.sections } });
    await audit({ userId: user.id, action: "page.update_sections", resource: "Page", resourceId: page.id, request, metadata: { sectionCount: input.sections.length } });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save page" }, { status: 400 });
  }
}
