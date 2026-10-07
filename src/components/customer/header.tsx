"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, Search, ShoppingBag, UserRound } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useStoreSnapshot } from "@/hooks/use-async";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CustomerHeader() {
  const { user, logout, demo } = useAuth();
  const { count } = useCart();
  const store = useStoreSnapshot();
  const selected = store.addresses.find((item) => item.id === store.selectedAddressId) ?? store.addresses.find((item) => item.userId === user?.id && item.isDefault);
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) return null;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="page-wrap flex h-16 items-center gap-3">
        <Logo />
        <button
          type="button"
          className="hidden min-w-0 items-center gap-2 rounded-full bg-secondary px-3 py-2 text-left text-sm md:flex"
          onClick={() => router.push("/profile/addresses")}
        >
          <MapPin className="h-4 w-4 text-primary" />
          <span className="truncate">
            <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">Deliver to</span>
            <span className="font-medium">{selected ? `${selected.label} · ${selected.city}` : "Select location"}</span>
          </span>
        </button>
        <form
          className="relative min-w-0 flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            router.push(`/search?q=${encodeURIComponent(query)}`);
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search milk, bread, shops..."
            className="h-11 w-full rounded-full border bg-card pl-10 pr-4 text-sm shadow-sm"
            aria-label="Search products"
          />
        </form>
        <Link href="/cart" className="relative rounded-full p-2 hover:bg-muted" aria-label="Cart">
          <ShoppingBag className="h-5 w-5" />
          {count > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] text-primary-foreground">
              {count}
            </span>
          ) : null}
        </Link>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <UserRound className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders">Orders</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/addresses">Addresses</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 h-px bg-border" />
              <DropdownMenuItem onClick={() => void demo("merchant")}>
                Switch to Merchant Portal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void demo("admin")}>
                Switch to Admin Portal
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 h-px bg-border" />
              <DropdownMenuItem onClick={() => void logout()}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export function CustomerFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="page-wrap flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 QuickMart. Groceries from shops around you.</p>
        <nav className="flex gap-4">
          <Link href="/merchant/login" className="hover:text-foreground">
            Merchant portal
          </Link>
          <Link href="/admin/login" className="hover:text-foreground">
            Admin portal
          </Link>
        </nav>
      </div>
    </footer>
  );
}
