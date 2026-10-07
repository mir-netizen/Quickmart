"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, MapPin, UserCheck, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { orderService } from "@/services/order.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { OrderStatusTimeline } from "@/components/shared/order-status-timeline";
import { PriceBreakdown } from "@/components/shared/price-breakdown";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime, formatInr } from "@/lib/format";
import type { OrderStatus } from "@/types";

export default function MerchantOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";

  const [loading, setLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const order = store.orders.find((o) => o.id === resolvedParams.orderId && o.shopId === shopId);
  if (!order) {
    return (
      <div className="py-12">
        <ErrorState message="Order not found or does not belong to your store." />
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/merchant/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const customer = store.users.find((u) => u.id === order.customerId);
  const address = store.addresses.find((a) => a.id === order.addressId);

  async function handleAdvance(nextStatus?: OrderStatus) {
    setLoading(true);
    try {
      const updated = await orderService.advanceOrder(order!.id, nextStatus);
      toast.success(`Order #${order!.id} moved to "${updated.status.replaceAll("_", " ")}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update order");
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    try {
      await orderService.rejectOrder(order!.id);
      toast.error(`Order #${order!.id} rejected and inventory released.`);
      setRejectDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/merchant/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
      </div>

      <PageHeader
        title={`Order ${order.id}`}
        description={`Received on ${formatDateTime(order.createdAt)}`}
        crumbs={[
          { label: "Merchant", href: "/merchant" },
          { label: "Orders", href: "/merchant/orders" },
          { label: order.id },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />

            {/* Workflow Action Buttons */}
            {order.status === "placed" && (
              <div className="flex gap-2">
                <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => setRejectDialogOpen(true)}>
                  Reject
                </Button>
                <Button disabled={loading} onClick={() => handleAdvance("accepted")}>
                  Accept Order
                </Button>
              </div>
            )}

            {order.status === "accepted" && (
              <Button disabled={loading} onClick={() => handleAdvance("preparing")}>
                Start Preparing
              </Button>
            )}

            {order.status === "preparing" && (
              <Button disabled={loading} onClick={() => handleAdvance("ready")}>
                Mark Ready for Pickup
              </Button>
            )}

            {order.status === "ready" && (
              <Button disabled={loading} onClick={() => handleAdvance("out_for_delivery")}>
                Dispatch for Delivery
              </Button>
            )}

            {order.status === "out_for_delivery" && (
              <Button disabled={loading} onClick={() => handleAdvance("delivered")}>
                Confirm Delivered
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Items & Progress */}
        <div className="space-y-6">
          {/* Order Items Table */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold">Ordered Items</h2>
            <ul className="mt-4 divide-y">
              {order.items.map((item) => (
                <li key={item.listingId} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.unit}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-sm">Qty: <strong className="font-semibold">{item.quantity}</strong></span>
                    <span className="font-semibold text-sm w-20 text-right">{formatInr(item.price * item.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* Timeline of events */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold">Order Status Timeline</h2>
            <div className="mt-6">
              <OrderStatusTimeline status={order.status} events={order.events} />
            </div>
          </Card>
        </div>

        {/* Right Column: Customer Info & Bill */}
        <div className="space-y-6">
          {/* Customer Details */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted p-2.5">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Customer</p>
                <p className="font-semibold text-sm">{customer?.name ?? "Customer"}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground border-t pt-3">
              <p>Email: <span className="text-foreground">{customer?.email}</span></p>
              <p>Phone: <span className="text-foreground">{customer?.phone}</span></p>
            </div>
          </Card>

          {/* Delivery Address */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted p-2.5">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Delivery Destination</p>
                <p className="font-semibold text-sm">{address?.label ?? "Home"}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground border-t pt-3">
              {address?.line1}{address?.line2 ? `, ${address?.line2}` : ""}, {address?.city} {address?.pincode}
            </p>
          </Card>

          {/* Pricing Breakdown */}
          <Card className="p-5">
            <h3 className="font-display text-base font-semibold">Order Financials</h3>
            <div className="mt-4">
              <PriceBreakdown
                subtotal={order.subtotal}
                deliveryFee={order.deliveryFee}
                discount={order.discount}
                total={order.total}
              />
            </div>
            <div className="mt-4 border-t pt-3 text-xs text-muted-foreground flex justify-between">
              <span>Platform Fee (retained)</span>
              <span>{formatInr(order.platformFee)}</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-emerald-700 flex justify-between">
              <span>Your Net Payout</span>
              <span>{formatInr(order.subtotal - order.platformFee)}</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Reject Confirmation Dialog */}
      <ConfirmationDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        title={`Reject Order #${order.id}?`}
        description="This will cancel the order, release reserved inventory back to available stock, and notify the customer."
        confirmLabel="Reject Order"
        destructive
        loading={loading}
        onConfirm={handleReject}
      />
    </div>
  );
}
