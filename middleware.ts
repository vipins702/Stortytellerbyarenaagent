import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/builder(.*)",
  "/cms(.*)",
  "/assets(.*)",
  "/seo(.*)",
  "/domains(.*)",
  "/team(.*)",
  "/commerce(.*)",
  "/ab-tests(.*)",
  "/analytics(.*)",
  "/versions(.*)",
  "/settings(.*)",
  "/billing(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return NextResponse.next();
  }
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|ttf|txt|xml)).*)"]
};
