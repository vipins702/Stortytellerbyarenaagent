import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass rounded-[30px]", className)}>{children}</div>;
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-full border border-violet/40 bg-violet/15 px-3 py-1 text-xs font-extrabold uppercase tracking-[.12em] text-violet-200", className)}>{children}</span>;
}
