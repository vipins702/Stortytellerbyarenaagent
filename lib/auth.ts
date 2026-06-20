import { prisma } from "@/lib/prisma";
import { ensureTenantForUser } from "@/lib/tenant";

/**
 * Clerk-ready auth bridge.
 * If Clerk env vars are present, this loads the real Clerk user and mirrors it to DB.
 * Without Clerk env vars, it falls back to a real DB dev user for local/Vercel preview setup.
 */
export async function getCurrentUser() {
  if (process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    try {
      const { currentUser } = await import("@clerk/nextjs/server");
      const clerkUser = await currentUser();
      if (clerkUser?.id) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || `${clerkUser.id}@clerk.local`;
        const user = await prisma.user.upsert({
          where: { email },
          update: { clerkId: clerkUser.id, name: clerkUser.fullName || clerkUser.username || email },
          create: { clerkId: clerkUser.id, email, name: clerkUser.fullName || clerkUser.username || email }
        });
        await ensureTenantForUser(user);
        return prisma.user.findUniqueOrThrow({ where: { id: user.id } });
      }
    } catch {
      // Fall through to dev user. This keeps builds/previews resilient.
    }
  }

  const email = process.env.DEV_USER_EMAIL || "founder@aurelia.ai";
  const name = process.env.DEV_USER_NAME || "Aurelia Founder";
  const user = await prisma.user.upsert({ where: { email }, update: { name }, create: { email, name } });
  await ensureTenantForUser(user);
  return prisma.user.findUniqueOrThrow({ where: { id: user.id } });
}
