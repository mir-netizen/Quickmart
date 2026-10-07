"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Boxes, Store, TrendingUp, Settings } from "lucide-react";
import { OpsShell, type NavItem } from "@/components/ops/ops-shell";
import { PortalGuard } from "@/components/shared/portal-guard";

const merchantNavItems: NavItem[] = [
  { href: "/merchant", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/merchant/orders", label: "Orders", icon: <ShoppingBag className="h-4 w-4" /> },
  { href: "/merchant/products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { href: "/merchant/inventory", label: "Inventory", icon: <Boxes className="h-4 w-4" /> },
  { href: "/merchant/shop", label: "Shop Profile", icon: <Store className="h-4 w-4" /> },
  { href: "/merchant/earnings", label: "Earnings", icon: <TrendingUp className="h-4 w-4" /> },
  { href: "/merchant/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/merchant/login") {
    return <div className="theme-merchant min-h-screen bg-background text-foreground">{children}</div>;
  }

  return (
    <div className="theme-merchant min-h-screen bg-background text-foreground">
      <PortalGuard allow={["merchant"]}>
        <OpsShell homeHref="/merchant" brand="Merchant Hub" items={merchantNavItems}>
          {children}
        </OpsShell>
      </PortalGuard>
    </div>
  );
}
