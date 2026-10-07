"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Search, ArrowUpRight } from "lucide-react";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatInr } from "@/lib/format";
import type { PaymentStatus } from "@/types";

export default function AdminPaymentsPage() {
  const store = useStoreSnapshot();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const payments = store.payments
    .filter((p) => {
      if (filterStatus === "all") return true;
      return p.status === filterStatus;
    })
    .filter((p) => {
      if (!search) return true;
      const q = search.toLowerCase();
      const customer = store.users.find((u) => u.id === p.customerId);
      const shop = store.shops.find((s) => s.id === p.shopId);
      return (
        p.id.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q) ||
        customer?.name.toLowerCase().includes(q) ||
        shop?.name.toLowerCase().includes(q)
      );
    });

  const statusFilters = [
    { key: "all", label: "All Payments" },
    { key: "paid", label: "Paid" },
    { key: "pending", label: "Pending" },
    { key: "refunded", label: "Refunded" },
    { key: "failed", label: "Failed" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Transactions"
        description="Unified ledger of customer payments across UPI, Cards, and Cash on Delivery."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Payments" }]}
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((tab) => (
              <Button
                key={tab.key}
                variant={filterStatus === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search transaction, order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          {payments.length === 0 ? (
            <div className="py-12">
              <EmptyState title="No transactions found" description="No payment records matched the criteria." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Associated Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Merchant Store</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => {
                  const customer = store.users.find((u) => u.id === p.customerId);
                  const shop = store.shops.find((s) => s.id === p.shopId);

                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs font-semibold">{p.id}</TableCell>
                      <TableCell>
                        <Link href={`/admin/orders/${p.orderId}`} className="font-mono text-xs text-primary hover:underline inline-flex items-center gap-1">
                          {p.orderId} <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-sm">{customer?.name ?? "Customer"}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{shop?.name ?? "Shop"}</span>
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {formatInr(p.amount)}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs uppercase font-medium bg-muted px-2 py-0.5 rounded">
                          {p.method}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {formatDateTime(p.createdAt)}
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
