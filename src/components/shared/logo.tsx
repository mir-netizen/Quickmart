import Link from "next/link";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ href = "/", compact = false, className }: { href?: string; compact?: boolean; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2 font-display text-lg font-semibold tracking-tight", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Leaf className="h-5 w-5" />
      </span>
      {compact ? null : (
        <span>
          Quick<span className="text-primary">Mart</span>
        </span>
      )}
    </Link>
  );
}
