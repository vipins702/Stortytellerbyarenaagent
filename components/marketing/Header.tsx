import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-cream/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-charcoal text-gold shadow-glow">✦</span>
          <span>Aurelia <span className="gold-text">AI</span></span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <Link className="rounded-full px-4 py-2 text-sm font-bold text-charcoal/65 hover:bg-white/70" href="/templates">Templates</Link>
          <Link className="rounded-full px-4 py-2 text-sm font-bold text-charcoal/65 hover:bg-white/70" href="/billing">Pricing</Link>
          <Link className="rounded-full px-4 py-2 text-sm font-bold text-charcoal/65 hover:bg-white/70" href="/dashboard">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="light">Login</ButtonLink>
          <ButtonLink href="/signup" variant="gold">Start free</ButtonLink>
        </div>
      </div>
    </header>
  );
}
