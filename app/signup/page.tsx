import Link from "next/link";
import { SignUp } from "@clerk/nextjs";
import { Header } from "@/components/marketing/Header";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <>
      <Header />
      <main className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-[.9fr_1.1fr]">
        <section>
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#8a6818]">Start free</p>
          <h1 className="mt-4 font-serif text-6xl font-black leading-[.92] tracking-[-.06em]">Create your workspace with Google.</h1>
          <p className="mt-5 max-w-xl leading-8 text-charcoal/60">Use Google sign-up for a fast, secure start. After account creation, continue to onboarding and launch your first premium site.</p>
          <div className="mt-7 flex flex-wrap gap-3"><ButtonLink href="/onboarding" variant="gold">View onboarding</ButtonLink><ButtonLink href="/guide" variant="light">Read guide</ButtonLink></div>
        </section>
        <Card className="grid min-h-[600px] place-items-center p-6">
          {clerkEnabled ? (
            <SignUp routing="path" path="/signup" signInUrl="/login" appearance={{ elements: { rootBox: "mx-auto", cardBox: "shadow-none" } }} />
          ) : (
            <div className="max-w-md text-center">
              <h2 className="font-serif text-4xl font-black tracking-[-.05em]">Google sign-up is ready to enable.</h2>
              <p className="mt-4 leading-7 text-charcoal/60">Connect Clerk, enable Google in Social Connections, and set the sign-up redirect to onboarding for the best tenant setup flow.</p>
              <pre className="mt-5 overflow-auto rounded-2xl bg-charcoal p-4 text-left text-xs text-cream">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."{"\n"}CLERK_SECRET_KEY="..."</pre>
              <p className="mt-5 text-sm text-charcoal/50">Already have an account? <Link href="/login" className="font-black text-charcoal">Sign in</Link></p>
            </div>
          )}
        </Card>
      </main>
    </>
  );
}
