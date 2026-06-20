export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: { jobId: string } }) {
  const user = await getCurrentUser();
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      async function send() {
        if (closed) return;
        const job = await prisma.generationJob.findFirst({
          where: { id: params.jobId, userId: user.id },
          include: { steps: { orderBy: { createdAt: "asc" } }, assets: { include: { asset: true } } }
        });
        if (!job) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: "Job not found" })}\n\n`));
          closed = true;
          controller.close();
          return;
        }
        controller.enqueue(encoder.encode(`event: progress\ndata: ${JSON.stringify(job)}\n\n`));
        if (["Completed", "Failed"].includes(job.status)) {
          closed = true;
          controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify({ status: job.status })}\n\n`));
          controller.close();
          return;
        }
        setTimeout(send, 900);
      }
      await send();
    },
    cancel() { closed = true; }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    }
  });
}
