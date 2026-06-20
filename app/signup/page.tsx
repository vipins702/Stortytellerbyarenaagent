import Link from "next/link";
import { Header } from "@/components/marketing/Header";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  return <><Header /><main className="mx-auto grid min-h-[calc(100vh-80px)] max-w-md place-items-center px-4"><Card className="w-full p-8"><h1 className="font-serif text-5xl font-black tracking-[-.05em]">Create account</h1><p className="mt-2 text-charcoal/60">Start with 2 free websites.</p><input className="mt-6 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="Name"/><input className="mt-3 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="email@company.com"/><input className="mt-3 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3" placeholder="Password" type="password"/><Button className="mt-5 w-full" variant="gold">Create workspace</Button><p className="mt-4 text-center text-sm text-charcoal/55">Already have an account? <Link className="font-bold text-charcoal" href="/login">Login</Link></p></Card></main></>;
}
