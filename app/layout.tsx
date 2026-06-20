import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "ScrollStoryTeller — Cinematic Website Builder SaaS",
  description: "Build cinematic scroll storytelling pages with media, products, checkout, SEO and publishing tools.",
  openGraph: {
    title: "ScrollStoryTeller",
    description: "Create cinematic product pages and scroll storytelling sites.",
    type: "website"
  }
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${interTight.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ClerkProvider><Document>{children}</Document></ClerkProvider>;
  }
  return <Document>{children}</Document>;
}
