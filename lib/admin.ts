import { getCurrentUser } from "@/lib/auth";

export async function requireAdmin() {
  const user = await getCurrentUser();
  const admins = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!admins.includes(user.email.toLowerCase())) {
    throw new Error("Admin access required. Add this email to ADMIN_EMAILS.");
  }
  return user;
}
