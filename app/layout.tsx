import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Aurelia AI — Premium Website Builder SaaS",
  description: "AI-powered website builder SaaS MVP with visual builder, templates, CMS and commerce tools.",
  openGraph: {
    title: "Aurelia AI",
    description: "Apple meets Webflow meets Shopify for AI-generated luxury websites.",
    type: "website"
  }
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ClerkProvider><Document>{children}</Document></ClerkProvider>;
  }
  return <Document>{children}</Document>;
}
