import Link from "next/link";
import { Blocks, Library, Rocket, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const nav = [
  { href: "/create", label: "Create", icon: Sparkles, hint: "Generate story" },
  { href: "/studio", label: "Studio", icon: Blocks, hint: "Edit visually" },
  { href: "/library", label: "Library", icon: Library, hint: "Media + content" },
  { href: "/launch", label: "Launch", icon: Rocket, hint: "Publish + grow" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05050A]/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1760px] items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyan text-white shadow-glow">S</span>
            <span>ScrollStoryTeller <span className="rounded-full border border-violet/30 bg-violet/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-violet-200">Studio</span></span>
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <ButtonLink href="/preview/web_maison_aurelia" variant="light">Preview</ButtonLink>
            <ButtonLink href="/launch" variant="gold">Launch</ButtonLink>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1760px] gap-6 px-5 py-6 lg:grid-cols-[118px_minmax(0,1fr)]">
        <aside className="glass h-fit rounded-[32px] p-3 lg:sticky lg:top-24">
          <nav className="grid gap-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="group grid place-items-center rounded-[24px] border border-transparent px-2 py-4 text-center transition hover:border-white/10 hover:bg-white/10">
                <item.icon className="h-5 w-5 text-white/65 transition group-hover:text-cyan" />
                <span className="mt-2 text-xs font-black text-white/80">{item.label}</span>
                <span className="mt-1 text-[10px] leading-3 text-white/35">{item.hint}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-3 border-t border-white/10 pt-3">
            <Link href="/dashboard" className="block rounded-2xl px-2 py-3 text-center text-[11px] font-bold text-white/35 hover:bg-white/10 hover:text-white/70">More</Link>
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
