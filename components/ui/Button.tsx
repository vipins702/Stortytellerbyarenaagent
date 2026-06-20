import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "dark" | "gold" | "light" | "ghost";
};

export function Button({ className, variant = "dark", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition active:scale-[.98]",
        variant === "dark" && "bg-charcoal text-white shadow-luxury hover:bg-black",
        variant === "gold" && "bg-gradient-to-br from-gold to-[#967019] text-white shadow-glow hover:brightness-105",
        variant === "light" && "border border-black/10 bg-white/75 text-charcoal hover:bg-white",
        variant === "ghost" && "text-charcoal/70 hover:bg-white/60 hover:text-charcoal",
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
        "focus-ring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition active:scale-[.98]",
        variant === "dark" && "bg-charcoal text-white shadow-luxury hover:bg-black",
        variant === "gold" && "bg-gradient-to-br from-gold to-[#967019] text-white shadow-glow hover:brightness-105",
        variant === "light" && "border border-black/10 bg-white/75 text-charcoal hover:bg-white",
        variant === "ghost" && "text-charcoal/70 hover:bg-white/60 hover:text-charcoal",
        className
      )}
    >
      {children}
    </Link>
  );
}
