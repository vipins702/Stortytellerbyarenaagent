import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  return <><Header /><main className="mx-auto grid min-h-[calc(100vh-80px)] max-w-md place-items-center px-4"><Card className="w-full p-8"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Login</h1><p className="mt-2 text-charcoal/60">MVP auth screen. Production uses Clerk.</p><input className="mt-6 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="email@company.com"/><input className="mt-3 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="Password" type="password"/><Button className="mt-5 w-full" variant="gold">Continue</Button><p className="mt-4 text-center text-sm text-charcoal/55">No account? <Link className="font-bold text-charcoal" href="/signup">Sign up</Link></p></Card></main></>;
}
