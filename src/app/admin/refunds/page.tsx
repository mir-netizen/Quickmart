"use client";

import { useState } from "react";
import Link from "next/link";
import { RotateCcw, Check, X, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useStoreSnapshot } from "@/hooks/use-async";
import { paymentService } from "@/services/payment.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatInr } from "@/lib/format";
import type { Refund } from "@/types";

export default function AdminRefundsPage() {
  const store = useStoreSnapshot();
  const [selectedRefund, setSelectedRefund] = useState<{ refund: Refund; action: "approved" | "rejected" } | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleDecision() {
    if (!selectedRefund) return;
    setBusy(true);
    try {
      await paymentService.decideRefund(selectedRefund.refund.id, selectedRefund.action);
      toast.success(
        selectedRefund.action === "approved"
          ? `Refund of ${formatInr(selectedRefund.refund.amount)} processed successfully`
          : "Refund request rejected"
      );
      setSelectedRefund(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to process refund decision");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Refunds & Dispute Resolution"
        description="Handle customer cancellation claims, damaged product disputes, and merchant reversal debits."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Refunds" }]}
      />

      <Card className="p-4">
        {store.refunds.length === 0 ? (
          <div className="py-12">
            <EmptyState title="No refund requests" description="No customer disputes or returns have been filed." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Refund ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Merchant Store</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Dispute Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {store.refunds.map((refund) => {
                const customer = store.users.find((u) => u.id === refund.customerId);
                const shop = store.shops.find((s) => s.id === refund.shopId);

                return (
                  <TableRow key={refund.id}>
                    <TableCell className="font-mono text-xs font-semibold">{refund.id}</TableCell>
                    <TableCell>
                      <Link href={`/admin/orders/${refund.orderId}`} className="font-mono text-xs text-primary hover:underline inline-flex items-center gap-1">
                        {refund.orderId} <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{customer?.name ?? "Customer"}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{shop?.name ?? "Shop"}</TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatInr(refund.amount)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {refund.reason}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={refund.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {refund.status === "requested" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:bg-destructive/10 h-8 gap-1"
                            onClick={() => setSelectedRefund({ refund, action: "rejected" })}
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 h-8 gap-1"
                            onClick={() => setSelectedRefund({ refund, action: "approved" })}
                          >
                            <Check className="h-3.5 w-3.5" /> Approve & Refund
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground capitalize font-medium">
                          {refund.status}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <ConfirmationDialog
        open={Boolean(selectedRefund)}
        onOpenChange={(open) => !open && setSelectedRefund(null)}
        title={selectedRefund?.action === "approved" ? "Approve Refund?" : "Reject Refund Request?"}
        description={
          selectedRefund?.action === "approved"
            ? `This will debit ${formatInr(selectedRefund?.refund.amount ?? 0)} from the merchant settlement and mark payment as refunded.`
            : "This will dismiss the customer dispute request."
        }
        confirmLabel={selectedRefund?.action === "approved" ? "Confirm Refund" : "Reject Request"}
        destructive={selectedRefund?.action === "rejected"}
        loading={busy}
        onConfirm={handleDecision}
      />
    </div>
  );
}
