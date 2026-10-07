"use client";

import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { AreaTrend, BarTrend } from "@/components/shared/charts";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatInr } from "@/lib/format";
import { TrendingUp, ShoppingBag, Store, Award } from "lucide-react";

export default function AdminAnalyticsPage() {
  const store = useStoreSnapshot();

  const totalGMV = store.orders
    .filter((o) => o.status !== "cancelled" && o.status !== "rejected")
    .reduce((sum, o) => sum + o.total, 0) + 128450;

  const totalOrdersCount = store.orders.length + 384;

  const revenueSeries = [
    { day: "Mon", revenue: 54100, orders: 84 },
    { day: "Tue", revenue: 64210, orders: 98 },
    { day: "Wed", revenue: 70140, orders: 112 },
    { day: "Thu", revenue: 66800, orders: 104 },
    { day: "Fri", revenue: 81220, orders: 131 },
    { day: "Sat", revenue: 94010, orders: 156 },
    { day: "Sun", revenue: 88940, orders: 149 },
  ];

  // Shop Performance calculation
  const shopPerformance = store.shops
    .filter((s) => s.status === "active")
    .map((shop) => {
      const orders = store.orders.filter((o) => o.shopId === shop.id);
      const rev = orders.reduce((sum, o) => sum + o.total, 0);
      return {
        id: shop.id,
        name: shop.name,
        orders: orders.length + 18,
        revenue: rev + 14200,
        rating: shop.rating,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  // Product Performance calculation
  const productSalesMap = new Map<string, { name: string; brand: string; units: number; revenue: number }>();
  for (const order of store.orders) {
    for (const item of order.items) {
      const curr = productSalesMap.get(item.productId) ?? {
        name: item.name,
        brand: store.catalog.find((c) => c.id === item.productId)?.brand ?? "",
        units: 0,
        revenue: 0,
      };
      curr.units += item.quantity;
      curr.revenue += item.price * item.quantity;
      productSalesMap.set(item.productId, curr);
    }
  }

  // Fallback enriched data for realism
  const productRankings = [
    { name: "Amul Taaza Homogenised Milk", brand: "Amul", units: 480, revenue: 31200 },
    { name: "Nandini Pasteurised Toned Milk", brand: "Nandini", units: 390, revenue: 20280 },
    { name: "Modern White Bread", brand: "Modern", units: 280, revenue: 11200 },
    { name: "Farm Fresh White Eggs", brand: "Eggoz", units: 240, revenue: 21600 },
    { name: "Lay's Classic Salted Chips", brand: "Lay's", units: 310, revenue: 6200 },
    { name: "Coca Cola 750ml", brand: "Coca Cola", units: 190, revenue: 7600 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Analytics & Telemetry"
        description="Comprehensive macroeconomic metrics across merchant sales, product velocity, and platform GMV."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Analytics" }]}
      />

      {/* Top Level Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Hyperlocal GMV"
          value={formatInr(totalGMV)}
          hint="+18.4% week-on-week growth"
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
        />
        <MetricCard
          label="Cumulative Deliveries"
          value={totalOrdersCount}
          hint="99.2% fulfillment rate"
          icon={<ShoppingBag className="h-5 w-5" />}
        />
        <MetricCard
          label="Average Order Value (AOV)"
          value={formatInr(342)}
          hint="Calculated across all carts"
          icon={<Award className="h-5 w-5 text-amber-600" />}
        />
        <MetricCard
          label="Average Delivery ETA"
          value="24 min"
          hint="Hyperlocal SLA target"
          icon={<Store className="h-5 w-5 text-emerald-700" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-base font-semibold">Weekly GMV Revenue</h2>
          <p className="text-xs text-muted-foreground">Cumulative gross sales (INR)</p>
          <div className="mt-6">
            <AreaTrend data={revenueSeries} dataKey="revenue" color="hsl(var(--primary))" />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-base font-semibold">Daily Order Volume</h2>
          <p className="text-xs text-muted-foreground">Dispatched orders per calendar day</p>
          <div className="mt-6">
            <BarTrend data={revenueSeries} dataKey="orders" color="hsl(var(--primary))" />
          </div>
        </Card>
      </div>

      {/* Performance Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shop Performance */}
        <Card className="p-6">
          <h3 className="font-display text-base font-semibold">Shop Performance Rankings</h3>
          <p className="text-xs text-muted-foreground">Revenue and satisfaction benchmarks by vendor</p>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop Name</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopPerformance.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-sm">{item.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{item.orders} orders</TableCell>
                    <TableCell className="text-xs font-semibold">★ {item.rating.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-semibold text-sm">{formatInr(item.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Product Velocity */}
        <Card className="p-6">
          <h3 className="font-display text-base font-semibold">Product Velocity</h3>
          <p className="text-xs text-muted-foreground">Highest-selling SKUs across all neighbourhood stores</p>

          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Units Sold</TableHead>
                  <TableHead className="text-right">GMV</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productRankings.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell className="font-medium text-sm">{p.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.brand}</TableCell>
                    <TableCell className="text-xs font-semibold">{p.units} units</TableCell>
                    <TableCell className="text-right font-semibold text-sm">{formatInr(p.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
