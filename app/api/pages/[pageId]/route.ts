export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { updatePageSectionsSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: { pageId: string } }) {
  try {
    const user = await getCurrentUser();
    const input = updatePageSectionsSchema.parse(await request.json());
    const page = await prisma.page.findFirst({ where: { id: params.pageId, website: { ownerId: user.id } } });
    if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
    const updated = await prisma.page.update({ where: { id: params.pageId }, data: { sections: input.sections } });
    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save page" }, { status: 400 });
  }
}
