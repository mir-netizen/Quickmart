"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
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

export default function MerchantOrdersPage() {
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const orders = store.orders
    .filter((order) => order.shopId === shopId)
    .filter((order) => {
      if (selectedStatus === "all") return true;
      if (selectedStatus === "pending") return order.status === "placed";
      return order.status === selectedStatus;
    })
    .filter((order) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const customer = store.users.find((u) => u.id === order.customerId);
      return order.id.toLowerCase().includes(q) || customer?.name.toLowerCase().includes(q);
    });

  const filterTabs = [
    { key: "all", label: "All Orders" },
    { key: "pending", label: "Pending Acceptance" },
    { key: "accepted", label: "Accepted" },
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
    { key: "out_for_delivery", label: "Out for Delivery" },
    { key: "delivered", label: "Delivered" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Orders"
        description="Monitor, accept, and update incoming customer orders in real-time."
        crumbs={[{ label: "Merchant", href: "/merchant" }, { label: "Orders" }]}
      />

      <Card className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
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
              placeholder="Search by Order ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          {orders.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No orders found"
                description={
                  selectedStatus !== "all"
                    ? `There are no orders with status "${selectedStatus}".`
                    : "No orders have been placed with your shop yet."
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time Placed</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const customer = store.users.find((u) => u.id === order.customerId);
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">{order.id}</TableCell>
                      <TableCell>
                        <p className="font-medium">{customer?.name ?? "Customer"}</p>
                        <p className="text-xs text-muted-foreground">{customer?.phone}</p>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {order.items.map((i) => `${i.name} (${i.quantity})`).join(", ")}
                        </p>
                      </TableCell>
                      <TableCell className="font-semibold">{formatInr(order.total)}</TableCell>
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
                          <Link href={`/merchant/orders/${order.id}`}>Manage</Link>
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
