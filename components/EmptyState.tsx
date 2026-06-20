import { Card } from "@/components/ui/Card";
import { CreateWebsiteButton } from "@/components/CreateWebsiteButton";

export function EmptyState({ title = "No database records yet", body = "Create your first website to start using the SaaS." }: { title?: string; body?: string }) {
  return <Card className="p-10 text-center"><h2 className="font-serif text-4xl font-black tracking-[-.05em]">{title}</h2><p className="mx-auto mt-3 max-w-xl text-charcoal/60">{body}</p><div className="mt-6"><CreateWebsiteButton /></div></Card>;
}
