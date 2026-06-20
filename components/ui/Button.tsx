import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "dark" | "gold" | "light" | "ghost";
};

const base = "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-black tracking-[-.01em] transition active:scale-[.98] disabled:opacity-60";

export function Button({ className, variant = "dark", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        base,
        variant === "dark" && "border border-white/10 bg-white/10 text-white shadow-luxury hover:bg-white/15",
        variant === "gold" && "bg-gradient-to-r from-violet via-[#7C3AED] to-cyan text-white shadow-glow hover:brightness-110",
        variant === "light" && "border border-white/10 bg-white/[.08] text-white hover:bg-white/[.14]",
        variant === "ghost" && "text-white/65 hover:bg-white/10 hover:text-white",
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({ href, children, className, variant = "dark" }: { href: string; children: React.ReactNode; className?: string; variant?: ButtonProps["variant"] }) {
  return (
    <Link
      href={href}
      className={cn(
        base,
        variant === "dark" && "border border-white/10 bg-white/10 text-white shadow-luxury hover:bg-white/15",
        variant === "gold" && "bg-gradient-to-r from-violet via-[#7C3AED] to-cyan text-white shadow-glow hover:brightness-110",
        variant === "light" && "border border-white/10 bg-white/[.08] text-white hover:bg-white/[.14]",
        variant === "ghost" && "text-white/65 hover:bg-white/10 hover:text-white",
        className
      )}
    >
      {children}
    </Link>
  );
}
