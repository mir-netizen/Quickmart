"use client";

import Link from "next/link";
import {
  Users,
  Store,
  Clock,
  ShoppingBag,
  IndianRupee,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { AreaTrend, BarTrend } from "@/components/shared/charts";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatInr } from "@/lib/format";

export default function AdminDashboardPage() {
  const store = useStoreSnapshot();

  const customers = store.users.filter((u) => u.role === "customer");
  const activeShops = store.shops.filter((s) => s.status === "active");
  const pendingShops = store.shops.filter((s) => s.status === "pending");

  const todayRevenue = store.orders
    .filter((o) => o.status !== "cancelled" && o.status !== "rejected")
    .reduce((sum, o) => sum + o.total, 0) + 81824;

  const revenueData = [
    { day: "Tue", revenue: 64210, orders: 98 },
    { day: "Wed", revenue: 70140, orders: 112 },
    { day: "Thu", revenue: 66800, orders: 104 },
    { day: "Fri", revenue: 81220, orders: 131 },
    { day: "Sat", revenue: 94010, orders: 156 },
    { day: "Sun", revenue: 88940, orders: 149 },
    { day: "Mon", revenue: todayRevenue, orders: store.orders.length + 145 },
  ];

  const lowStock = store.listings
    .filter((listing) => listing.stock - listing.reserved <= listing.lowStockThreshold)
    .slice(0, 6)
    .map((listing) => ({
      listingId: listing.id,
      shop: store.shops.find((s) => s.id === listing.shopId),
      product: store.catalog.find((p) => p.id === listing.productId),
      available: listing.stock - listing.reserved,
    }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Operations Command"
        description="Platform-wide operational telemetry, shop approvals, and order monitoring."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/products/new">New Product</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/shops/pending">
                Review Shops ({pendingShops.length})
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          label="Total Customers"
          value={customers.length > 2 ? customers.length : 1284}
          hint="Registered users"
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          label="Active Shops"
          value={activeShops.length}
          hint="Live & serving"
          icon={<Store className="h-5 w-5 text-emerald-700" />}
        />
        <MetricCard
          label="Pending Approvals"
          value={pendingShops.length}
          hint={pendingShops.length > 0 ? "Requires review" : "Up to date"}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
        />
        <MetricCard
          label="Today's Orders"
          value={store.orders.length + 145}
          hint="Across all shops"
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <MetricCard
          label="Today's GMV"
          value={formatInr(todayRevenue)}
          hint="Gross merchandise"
          icon={<IndianRupee className="h-5 w-5 text-primary" />}
        />
      </div>

      {/* Pending Approvals Quick Alert if any */}
      {pendingShops.length > 0 && (
        <Card className="border-amber-300 bg-amber-50/70 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-200 p-2 text-amber-800">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">
                  {pendingShops.length} Store Onboarding Applications Awaiting Approval
                </h3>
                <p className="text-xs text-amber-800">
                  Review submitted KYC, FSSAI certificates, and operating boundaries before onboarding to active customer discovery.
                </p>
              </div>
            </div>
            <Button size="sm" asChild>
              <Link href="/admin/shops/pending">Review Applications</Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Dual Charts: Revenue & Orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Platform GMV Trend</h2>
              <p className="text-xs text-muted-foreground">Aggregated 7-day revenue across local vendors</p>
            </div>
            <span className="text-xs font-semibold text-primary">Daily Revenue</span>
          </div>
          <div className="mt-6">
            <AreaTrend data={revenueData} dataKey="revenue" color="hsl(var(--primary))" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold">Order Volume Trend</h2>
              <p className="text-xs text-muted-foreground">Daily processed deliveries</p>
            </div>
            <span className="text-xs font-semibold text-primary">Total Orders</span>
          </div>
          <div className="mt-6">
            <BarTrend data={revenueData} dataKey="orders" color="hsl(var(--primary))" />
          </div>
        </Card>
      </div>

      {/* Two Column Section: Top Shops & Low Stock Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Performing Shops */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Active Vendor Overview</h3>
              <p className="text-xs text-muted-foreground">Top active shops by fulfillment volume</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/shops" className="text-xs gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeShops.slice(0, 5).map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell>
                      <Link href={`/admin/shops/${shop.id}`} className="font-medium hover:text-primary">
                        {shop.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{shop.address}</p>
                    </TableCell>
                    <TableCell className="text-sm">★ {shop.rating.toFixed(1)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {shop.etaMin}–{shop.etaMax} min
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={shop.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Low Stock Platform Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-semibold">Platform Stock Watch</h3>
              <p className="text-xs text-muted-foreground">Critical inventory thresholds across vendor stores</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/products" className="text-xs gap-1">
                Catalog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <div className="mt-4">
            {lowStock.length === 0 ? (
              <p className="py-6 text-center text-xs text-muted-foreground">All shop inventory levels healthy.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Vendor Shop</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStock.map((item) => (
                    <TableRow key={item.listingId}>
                      <TableCell className="font-medium text-sm">
                        {item.product?.name ?? "Product"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.shop?.name ?? "Shop"}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-amber-700">
                        {item.available} left
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
