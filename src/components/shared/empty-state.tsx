import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: { label: string; onClick?: () => void; href?: string };
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border bg-card px-6 py-16 text-center shadow-card", className)}>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? (
        action.href ? (
          <Button className="mt-5" asChild>
            <a href={action.href}>{action.label}</a>
          </Button>
        ) : (
          <Button className="mt-5" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      ) : null}
    </div>
  );
}
