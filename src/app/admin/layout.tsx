"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  Layers,
  ShoppingBag,
  CreditCard,
  RotateCcw,
  BarChart3,
  Settings,
} from "lucide-react";
import { OpsShell, type NavItem } from "@/components/ops/ops-shell";
import { PortalGuard } from "@/components/shared/portal-guard";

const adminNavItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: "/admin/shops", label: "Shops", icon: <Store className="h-4 w-4" /> },
  { href: "/admin/users", label: "Users", icon: <Users className="h-4 w-4" /> },
  { href: "/admin/products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { href: "/admin/categories", label: "Categories", icon: <Layers className="h-4 w-4" /> },
  { href: "/admin/orders", label: "Orders", icon: <ShoppingBag className="h-4 w-4" /> },
  { href: "/admin/payments", label: "Payments", icon: <CreditCard className="h-4 w-4" /> },
  { href: "/admin/refunds", label: "Refunds", icon: <RotateCcw className="h-4 w-4" /> },
  { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <div className="theme-admin min-h-screen bg-background text-foreground">{children}</div>;
  }

  return (
    <div className="theme-admin min-h-screen bg-background text-foreground">
      <PortalGuard allow={["admin"]}>
        <OpsShell homeHref="/admin" brand="Platform Admin" items={adminNavItems}>
          {children}
        </OpsShell>
      </PortalGuard>
    </div>
  );
}
