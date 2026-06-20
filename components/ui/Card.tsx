import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("glass rounded-[28px]", className)}>{children}</div>;
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-extrabold text-[#755812]", className)}>{children}</span>;
}
