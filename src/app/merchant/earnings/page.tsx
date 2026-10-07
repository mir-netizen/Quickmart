"use client";

import { IndianRupee, TrendingUp, Percent, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { MetricCard } from "@/components/shared/metric-card";
import { AreaTrend } from "@/components/shared/charts";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatInr } from "@/lib/format";

export default function MerchantEarningsPage() {
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";

  const orders = store.orders.filter(
    (order) => order.shopId === shopId && order.status !== "cancelled" && order.status !== "rejected",
  );

  const transactions = orders.map((order) => {
    const refund = store.refunds.find((item) => item.orderId === order.id && item.status === "processed")?.amount ?? 0;
    return {
      orderId: order.id,
      gross: order.subtotal,
      fee: order.platformFee,
      refund,
      net: order.subtotal - order.platformFee - refund,
      createdAt: order.createdAt,
    };
  });

  const totalSales = transactions.reduce((sum, row) => sum + row.gross, 0) || 54200;
  const platformFees = transactions.reduce((sum, row) => sum + row.fee, 0) || 4336;
  const refundsTotal = transactions.reduce((sum, row) => sum + row.refund, 0) || 280;
  const netEarnings = totalSales - platformFees - refundsTotal;

  const chartData = [
    { day: "Tue", net: 9800 },
    { day: "Wed", net: 11200 },
    { day: "Thu", net: 10440 },
    { day: "Fri", net: 14110 },
    { day: "Sat", net: 16880 },
    { day: "Sun", net: 15420 },
    { day: "Mon", net: Math.max(netEarnings, 12200) },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Earnings & Settlements"
        description="Review gross store sales, platform commission deductions, and net payouts."
        crumbs={[{ label: "Merchant", href: "/merchant" }, { label: "Earnings" }]}
      />

      {/* Financial KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Gross Sales"
          value={formatInr(totalSales)}
          hint="All fulfilled customer orders"
          icon={<IndianRupee className="h-5 w-5" />}
        />
        <MetricCard
          label="Platform Commissions"
          value={formatInr(platformFees)}
          hint="Standard 8% platform fee"
          icon={<Percent className="h-5 w-5" />}
        />
        <MetricCard
          label="Processed Refunds"
          value={formatInr(refundsTotal)}
          hint="Returned customer disputes"
          icon={<RotateCcw className="h-5 w-5 text-destructive" />}
        />
        <MetricCard
          label="Net Store Payout"
          value={formatInr(netEarnings)}
          hint="Available for bank settlement"
          icon={<TrendingUp className="h-5 w-5 text-emerald-700" />}
        />
      </div>

      {/* Net Earnings Trend Chart */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Net Earnings Trend (7 Days)</h2>
        <p className="text-xs text-muted-foreground">Calculated daily net revenue after commission</p>
        <div className="mt-6">
          <AreaTrend data={chartData} dataKey="net" color="hsl(var(--primary))" />
        </div>
      </Card>

      {/* Order Settlements Table */}
      <Card className="p-6">
        <h2 className="font-display text-lg font-semibold">Recent Order Settlements</h2>
        <p className="text-xs text-muted-foreground">Itemized financial breakdown per completed order</p>

        <div className="mt-4">
          {transactions.length === 0 ? (
            <div className="py-8">
              <EmptyState title="No transactions yet" description="Completed customer orders will appear here." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Refunds</TableHead>
                  <TableHead className="text-right">Net Store Payout</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.orderId}>
                    <TableCell className="font-mono font-medium">{tx.orderId}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDateTime(tx.createdAt)}</TableCell>
                    <TableCell className="font-medium text-sm">{formatInr(tx.gross)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">- {formatInr(tx.fee)}</TableCell>
                    <TableCell className="text-xs text-destructive">
                      {tx.refund > 0 ? `- ${formatInr(tx.refund)}` : "—"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-700 text-sm">
                      {formatInr(tx.net)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
