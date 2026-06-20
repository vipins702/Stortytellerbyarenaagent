import Link from "next/link";
import { BarChart3, Blocks, Bot, CreditCard, FlaskConical, Globe2, History, Images, LayoutDashboard, Library, Search, Settings, ShoppingBag, Sparkles, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/builder", label: "Builder", icon: Blocks },
  { href: "/cms/products", label: "Products", icon: ShoppingBag },
  { href: "/cms/orders", label: "Orders", icon: BarChart3 },
  { href: "/cms/leads", label: "Leads", icon: Sparkles },
  { href: "/templates", label: "Templates", icon: Library },
  { href: "/assets", label: "Assets", icon: Images },
  { href: "/generations", label: "Generations", icon: Bot },
  { href: "/seo", label: "SEO", icon: Search },
  { href: "/domains", label: "Domains", icon: Globe2 },
  { href: "/team", label: "Team", icon: Users },
  { href: "/commerce", label: "Commerce", icon: CreditCard },
  { href: "/ab-tests", label: "A/B Tests", icon: FlaskConical },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/versions", label: "Versions", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05050A]/78 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyan text-white shadow-glow">S</span>
            <span>ScrollStoryTeller <span className="gold-text">Studio</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <ButtonLink href="/builder" variant="light">Open builder</ButtonLink>
            <ButtonLink href="/login" variant="gold">Account</ButtonLink>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1680px] gap-6 px-5 py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="glass h-fit rounded-[30px] p-3 lg:sticky lg:top-24">
          <p className="px-3 py-2 text-xs font-black uppercase tracking-[.18em] text-white/45">Workspace</p>
          <nav className="grid gap-1">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-white/58 transition hover:bg-white/10 hover:text-white">
                <item.icon className="h-4 w-4" /> {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
