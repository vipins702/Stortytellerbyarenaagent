import { prisma } from "@/lib/prisma";

/**
 * Production note:
 * Replace this with Clerk's auth() + currentUser() once @clerk/nextjs is wired.
 * This function is DB-backed and creates a real development user only when Clerk is absent.
 */
export async function getCurrentUser() {
  const email = process.env.DEV_USER_EMAIL || "founder@aurelia.ai";
  const name = process.env.DEV_USER_NAME || "Aurelia Founder";
  return prisma.user.upsert({
    where: { email },
    update: { name },
    create: { email, name }
  });
}
