import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import { Header } from "@/components/marketing/Header";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <>
      <Header />
      <main className="mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-8 px-4 py-12 lg:grid-cols-[.9fr_1.1fr]">
        <section>
          <p className="text-xs font-black uppercase tracking-[.22em] text-[#8a6818]">Welcome back</p>
          <h1 className="mt-4 font-serif text-6xl font-black leading-[.92] tracking-[-.06em]">Continue building your workspace.</h1>
          <p className="mt-5 max-w-xl leading-8 text-charcoal/60">Sign in with Google or email to manage websites, products, domains, analytics and publishing from one premium dashboard.</p>
          <div className="mt-7 flex flex-wrap gap-3"><ButtonLink href="/guide" variant="light">Read guide</ButtonLink><ButtonLink href="/signup" variant="gold">Create account</ButtonLink></div>
        </section>
        <Card className="grid min-h-[560px] place-items-center p-6">
          {clerkEnabled ? (
            <SignIn routing="path" path="/login" signUpUrl="/signup" appearance={{ elements: { rootBox: "mx-auto", cardBox: "shadow-none" } }} />
          ) : (
            <div className="max-w-md text-center">
              <h2 className="font-serif text-4xl font-black tracking-[-.05em]">Google sign-in is ready to enable.</h2>
              <p className="mt-4 leading-7 text-charcoal/60">Add your Clerk publishable and secret keys in Vercel, then enable Google in Clerk Social Connections. This fallback keeps local builds working safely.</p>
              <pre className="mt-5 overflow-auto rounded-2xl bg-charcoal p-4 text-left text-xs text-cream">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."{"\n"}CLERK_SECRET_KEY="..."</pre>
              <p className="mt-5 text-sm text-charcoal/50">No account? <Link href="/signup" className="font-black text-charcoal">Create one</Link></p>
            </div>
          )}
        </Card>
      </main>
    </>
  );
}
