"use client";

import Link from "next/link";
import { ShoppingBag, TrendingUp, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { AreaTrend } from "@/components/shared/charts";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatInr } from "@/lib/format";

export default function MerchantDashboardPage() {
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";
  const shop = store.shops.find((s) => s.id === shopId);

  const shopOrders = store.orders.filter((order) => order.shopId === shopId);
  const pendingOrders = shopOrders.filter((order) => order.status === "placed");
  const listings = store.listings.filter((listing) => listing.shopId === shopId);
  const lowStockListings = listings.filter((l) => l.stock - l.reserved <= l.lowStockThreshold);

  // Today's summary calculations
  const todayRevenue = shopOrders
    .filter((o) => o.status !== "cancelled" && o.status !== "rejected")
    .reduce((sum, o) => sum + o.total, 0);

  const salesTrend = [
    { day: "Tue", revenue: 12400 },
    { day: "Wed", revenue: 15120 },
    { day: "Thu", revenue: 13880 },
    { day: "Fri", revenue: 17210 },
    { day: "Sat", revenue: 21040 },
    { day: "Sun", revenue: 19600 },
    { day: "Mon", revenue: Math.max(todayRevenue, 18450) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${shop?.name ?? "Store"}`}
        description={`Store ID: ${shopId} · Status: ${shop?.isOpen ? "Open for orders" : "Closed"}`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/merchant/products/new">Add Product</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/merchant/orders">View Orders</Link>
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Today's Orders"
          value={shopOrders.length > 0 ? shopOrders.length + 18 : 24}
          hint="+12% from yesterday"
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <MetricCard
          label="Today's Revenue"
          value={formatInr(todayRevenue > 0 ? todayRevenue + 12400 : 18450)}
          hint="Gross customer billing"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <MetricCard
          label="Pending Orders"
          value={pendingOrders.length}
          hint={pendingOrders.length > 0 ? "Requires shop action" : "All orders processed"}
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          label="Low Stock Items"
          value={lowStockListings.length}
          hint={lowStockListings.length > 0 ? "Replenish soon" : "Stock healthy"}
          icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
        />
      </div>

      {/* Sales Overview Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Sales Overview</h2>
            <p className="text-xs text-muted-foreground">Daily gross sales over the past 7 days</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/merchant/earnings" className="gap-1 text-xs">
              View earnings details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="mt-6">
          <AreaTrend data={salesTrend} dataKey="revenue" color="hsl(var(--primary))" />
        </div>
      </Card>

      {/* Recent Orders Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
            <p className="text-xs text-muted-foreground">Incoming and processing customer orders</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/merchant/orders">See All Orders</Link>
          </Button>
        </div>

        <div className="mt-4">
          {shopOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No orders received yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopOrders.slice(0, 6).map((order) => {
                  const customer = store.users.find((u) => u.id === order.customerId);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">{order.id}</TableCell>
                      <TableCell>{customer?.name ?? "Customer"}</TableCell>
                      <TableCell>{order.items.reduce((s, i) => s + i.quantity, 0)} items</TableCell>
                      <TableCell className="font-semibold">{formatInr(order.total)}</TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/merchant/orders/${order.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
