"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Store, FastForward } from "lucide-react";
import { toast } from "sonner";
import { useStoreSnapshot } from "@/hooks/use-async";
import { orderService } from "@/services/order.service";
import { OrderStatusTimeline } from "@/components/shared/order-status-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriceBreakdown } from "@/components/shared/price-breakdown";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime, formatInr } from "@/lib/format";

export default function CustomerOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const store = useStoreSnapshot();
  const [advancing, setAdvancing] = useState(false);

  const order = store.orders.find((item) => item.id === resolvedParams.orderId);
  if (!order) {
    return (
      <div className="page-wrap py-12">
        <ErrorState message="We couldn't find this order." />
        <div className="mt-4 text-center">
          <Button asChild variant="outline">
            <Link href="/orders">View all orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const shop = store.shops.find((item) => item.id === order.shopId);
  const address = store.addresses.find((item) => item.id === order.addressId);
  const isTerminal = ["delivered", "cancelled", "rejected"].includes(order.status);

  async function handleAdvance() {
    setAdvancing(true);
    try {
      const updated = await orderService.advanceOrder(order!.id);
      toast.success(`Order status updated to "${updated.status.replaceAll("_", " ")}"`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not advance order");
    } finally {
      setAdvancing(false);
    }
  }

  return (
    <div className="page-wrap py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Link>
        {!isTerminal && (
          <Button
            size="sm"
            variant="secondary"
            className="gap-2 border shadow-sm"
            onClick={handleAdvance}
            disabled={advancing}
          >
            <FastForward className="h-4 w-4 text-primary" />
            {advancing ? "Advancing..." : "Simulate Next Status"}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold">{order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {formatDateTime(order.createdAt)} · Payment:{" "}
            <span className="font-medium uppercase">{order.paymentMethod}</span> ({order.paymentStatus})
          </p>
        </div>
        <div className="rounded-2xl bg-brand-muted px-4 py-2 text-right">
          <p className="text-xs uppercase tracking-wide text-primary">Estimated Delivery</p>
          <p className="font-display text-xl font-semibold text-primary">{order.etaMinutes} minutes</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Column: Timeline & Items */}
        <div className="space-y-8">
          {/* Order Tracking Timeline */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold">Order Tracking</h2>
            <p className="mt-1 text-xs text-muted-foreground">Real-time status updates from the merchant</p>
            <div className="mt-6">
              <OrderStatusTimeline status={order.status} events={order.events} />
            </div>
          </Card>

          {/* Items Purchased */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold">Items in this Order ({order.items.length})</h2>
            <ul className="mt-4 divide-y">
              {order.items.map((item) => (
                <li key={item.listingId} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.unit} × {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatInr(item.price * item.quantity)}</p>
                    {item.mrp > item.price && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatInr(item.mrp * item.quantity)}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right Column: Shop, Delivery & Bill */}
        <div className="space-y-6">
          {/* Shop Card */}
          {shop && (
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-muted p-2.5">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Store</p>
                  <Link href={`/shops/${shop.id}`} className="font-semibold hover:text-primary">
                    {shop.name}
                  </Link>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{shop.address}, {shop.city}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Open today: {shop.hours.open} – {shop.hours.close}
              </div>
            </Card>
          )}

          {/* Delivery Address */}
          {address && (
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-muted p-2.5">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Delivery Address</p>
                  <p className="font-semibold">{address.label}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city} {address.pincode}
              </p>
            </Card>
          )}

          {/* Price Breakdown */}
          <Card className="p-5">
            <h3 className="font-display text-base font-semibold">Bill Details</h3>
            <div className="mt-4">
              <PriceBreakdown
                subtotal={order.subtotal}
                deliveryFee={order.deliveryFee}
                discount={order.discount}
                total={order.total}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
