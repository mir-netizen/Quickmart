"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatInr } from "@/lib/format";
import type { OrderStatus } from "@/types";

export default function AdminOrdersPage() {
  const store = useStoreSnapshot();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const orders = store.orders
    .filter((order) => {
      if (selectedStatus === "all") return true;
      return order.status === selectedStatus;
    })
    .filter((order) => {
      if (!search) return true;
      const q = search.toLowerCase();
      const customer = store.users.find((u) => u.id === order.customerId);
      const shop = store.shops.find((s) => s.id === order.shopId);
      return (
        order.id.toLowerCase().includes(q) ||
        customer?.name.toLowerCase().includes(q) ||
        shop?.name.toLowerCase().includes(q)
      );
    });

  const statusFilters = [
    { key: "all", label: "All Orders" },
    { key: "placed", label: "Placed" },
    { key: "accepted", label: "Accepted" },
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Orders"
        description="Global order stream across all 10 neighbourhood partner shops."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Orders" }]}
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((tab) => (
              <Button
                key={tab.key}
                variant={selectedStatus === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search Order ID, customer, shop..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          {orders.length === 0 ? (
            <div className="py-12">
              <EmptyState title="No orders found" description="No orders matched the selected filter." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vendor Shop</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const customer = store.users.find((u) => u.id === order.customerId);
                  const shop = store.shops.find((s) => s.id === order.shopId);

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">{order.id}</TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{customer?.name ?? "Customer"}</p>
                        <p className="text-xs text-muted-foreground">{customer?.phone}</p>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/shops/${shop?.id}`} className="font-medium text-sm hover:underline">
                          {shop?.name ?? "Shop"}
                        </Link>
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {formatInr(order.total)}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs uppercase font-medium">{order.paymentMethod}</span>
                        <span className="block text-[11px] text-muted-foreground capitalize">
                          {order.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDateTime(order.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/orders/${order.id}`}>Details</Link>
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
