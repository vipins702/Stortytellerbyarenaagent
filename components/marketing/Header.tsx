import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05050A]/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1680px] items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyan text-white shadow-glow">S</span>
          <span>ScrollStoryTeller <span className="ml-1 rounded-full border border-violet/30 bg-violet/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-violet-200">Beta</span></span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <Link className="rounded-full px-4 py-2 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white" href="/templates">Templates</Link>
          <Link className="rounded-full px-4 py-2 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white" href="/billing">Pricing</Link>
          <Link className="rounded-full px-4 py-2 text-sm font-bold text-white/60 hover:bg-white/10 hover:text-white" href="/dashboard">Studio</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="light">Login</ButtonLink>
          <ButtonLink href="/signup" variant="gold">Start free</ButtonLink>
        </div>
      </div>
    </header>
  );
}
