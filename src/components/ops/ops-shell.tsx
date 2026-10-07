"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function OpsShell({
  homeHref,
  brand,
  items,
  children,
}: {
  homeHref: string;
  brand: string;
  items: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  function Nav({ onNavigate }: { onNavigate?: () => void }) {
    return (
      <nav className="space-y-1">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== homeHref && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <Logo href={homeHref} />
                <div className="mt-6">
                  <Nav />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Logo href={homeHref} />
          <span className="hidden text-xs uppercase tracking-wide text-muted-foreground sm:inline">{brand}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden sm:inline">{user?.name}</span>
          <Button variant="outline" size="sm" onClick={() => void logout()}>
            Log out
          </Button>
        </div>
      </header>
      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r p-4 lg:block">
          <Nav />
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  crumbs,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  crumbs?: Array<{ href?: string; label: string }>;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        {crumbs ? (
          <p className="mb-1 text-xs text-muted-foreground">
            {crumbs.map((crumb, index) => (
              <span key={crumb.label}>
                {index > 0 ? " / " : null}
                {crumb.href ? (
                  <Link className="hover:text-foreground" href={crumb.href}>
                    {crumb.label}
                  </Link>
                ) : (
                  crumb.label
                )}
              </span>
            ))}
          </p>
        ) : null}
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
