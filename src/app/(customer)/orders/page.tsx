"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime, formatInr } from "@/lib/format";

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const orders = useStoreSnapshot().orders.filter((order) => order.customerId === user?.id);

  if (!user) {
    return <div className="page-wrap py-10"><EmptyState title="Sign in to view orders" description="Your order history lives on this device via the mock store." action={{ label: "Login", href: "/login" }} /></div>;
  }
  if (!orders.length) {
    return <div className="page-wrap py-10"><EmptyState title="No orders yet" description="Your orders will appear here once you place an order." action={{ label: "Start shopping", href: "/" }} /></div>;
  }

  return (
    <div className="page-wrap py-8">
      <h1 className="font-display text-3xl font-semibold">Orders</h1>
      <ul className="mt-6 space-y-3">
        {orders.map((order) => {
          const shop = useStoreSnapshot().shops.find((item) => item.id === order.shopId);
          return (
            <li key={order.id}>
              <Link href={`/orders/${order.id}`} className="flex items-center justify-between rounded-2xl border bg-card p-4 shadow-card">
                <div>
                  <p className="font-medium">{order.id} · {shop?.name}</p>
                  <p className="text-sm text-muted-foreground">{formatDateTime(order.createdAt)} · {order.items.length} items</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <p className="mt-1 font-semibold">{formatInr(order.total)}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
