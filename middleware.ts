import { NextRequest, NextResponse } from "next/server";

const protectedPatterns = [
  /^\/dashboard/,
  /^\/builder/,
  /^\/cms/,
  /^\/assets/,
  /^\/generations/,
  /^\/seo/,
  /^\/domains/,
  /^\/team/,
  /^\/commerce/,
  /^\/ab-tests/,
  /^\/analytics/,
  /^\/versions/,
  /^\/settings/,
  /^\/billing/,
  /^\/admin/
];

function isProtectedPath(pathname: string) {
  return protectedPatterns.some((pattern) => pattern.test(pathname));
}

function isLikelyCustomHost(host: string) {
  const clean = host.split(":")[0].toLowerCase();
  const appHost = process.env.NEXT_PUBLIC_APP_URL ? new URL(process.env.NEXT_PUBLIC_APP_URL).hostname.toLowerCase() : "";
  return clean && clean !== "localhost" && clean !== "127.0.0.1" && clean !== appHost && !clean.endsWith(".vercel.app");
}

export default async function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const pathname = req.nextUrl.pathname;

  if (isLikelyCustomHost(host) && !pathname.startsWith("/api") && !pathname.startsWith("/host-sites")) {
    const url = req.nextUrl.clone();
    url.pathname = `/host-sites/${encodeURIComponent(host.split(":")[0].toLowerCase())}`;
    return NextResponse.rewrite(url);
  }

  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
  if (!clerkEnabled || !isProtectedPath(pathname)) return NextResponse.next();

  const { clerkMiddleware } = await import("@clerk/nextjs/server");
  const handler = clerkMiddleware(async (auth) => {
    await auth.protect();
    return NextResponse.next();
  });
  return handler(req, {} as any);
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ico|woff2?|ttf|txt|xml)).*)"]
};
