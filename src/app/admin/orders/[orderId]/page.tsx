"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, CreditCard, MapPin, Store, UserCheck, ShieldCheck } from "lucide-react";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { OrderStatusTimeline } from "@/components/shared/order-status-timeline";
import { PriceBreakdown } from "@/components/shared/price-breakdown";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime, formatInr } from "@/lib/format";

export default function AdminOrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const store = useStoreSnapshot();

  const order = store.orders.find((o) => o.id === resolvedParams.orderId);
  if (!order) {
    return (
      <div className="py-12">
        <ErrorState message="Order not found in platform records." />
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/admin/orders">Back to orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const customer = store.users.find((u) => u.id === order.customerId);
  const shop = store.shops.find((s) => s.id === order.shopId);
  const address = store.addresses.find((a) => a.id === order.addressId);
  const payment = store.payments.find((p) => p.orderId === order.id);

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to platform orders
      </Link>

      <PageHeader
        title={`Order ${order.id}`}
        description={`Placed on ${formatDateTime(order.createdAt)}`}
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Orders", href: "/admin/orders" },
          { label: order.id },
        ]}
        actions={<StatusBadge status={order.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Items & Visual Timeline */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-display text-base font-semibold">Ordered Line Items ({order.items.length})</h3>
            <ul className="mt-4 divide-y">
              {order.items.map((item) => (
                <li key={item.listingId} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.unit}</p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-sm">Quantity: <strong>{item.quantity}</strong></span>
                    <span className="font-semibold text-sm w-20 text-right">{formatInr(item.price * item.quantity)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-base font-semibold">Full Event History & Status Progression</h3>
            <p className="text-xs text-muted-foreground">Chronological audit trail of customer and vendor milestones</p>
            <div className="mt-6">
              <OrderStatusTimeline status={order.status} events={order.events} />
            </div>
          </Card>
        </div>

        {/* Right Column: Stakeholders & Financials */}
        <div className="space-y-6">
          {/* Customer Card */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted p-2 text-primary">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Customer</p>
                <Link href={`/admin/users/${customer?.id}`} className="font-semibold text-sm hover:underline">
                  {customer?.name ?? "Customer"}
                </Link>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground border-t pt-2.5">
              <p>Email: <span className="text-foreground">{customer?.email}</span></p>
              <p>Phone: <span className="text-foreground">{customer?.phone}</span></p>
            </div>
          </Card>

          {/* Shop Card */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted p-2 text-primary">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Fulfilling Merchant</p>
                <Link href={`/admin/shops/${shop?.id}`} className="font-semibold text-sm hover:underline">
                  {shop?.name ?? "Shop"}
                </Link>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground border-t pt-2.5">
              {shop?.address}, {shop?.city} · Phone: {shop?.phone}
            </p>
          </Card>

          {/* Destination */}
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-muted p-2 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Delivery Address</p>
                <p className="font-semibold text-sm">{address?.label ?? "Home"}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground border-t pt-2.5">
              {address?.line1}{address?.line2 ? `, ${address?.line2}` : ""}, {address?.city} {address?.pincode}
            </p>
          </Card>

          {/* Financial Breakdown */}
          <Card className="p-5">
            <div className="flex items-center gap-2 border-b pb-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <h3 className="font-display text-sm font-semibold">Payment & Financials</h3>
            </div>
            <div className="mt-3">
              <PriceBreakdown
                subtotal={order.subtotal}
                deliveryFee={order.deliveryFee}
                discount={order.discount}
                total={order.total}
              />
            </div>
            <div className="mt-3 border-t pt-3 space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Method / Status</span>
                <span className="font-semibold text-foreground uppercase">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform Commission (8%)</span>
                <span className="font-semibold text-primary">{formatInr(order.platformFee)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Vendor Net Payout</span>
                <span className="text-foreground">{formatInr(order.subtotal - order.platformFee)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
