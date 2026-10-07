import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateTime, formatInr } from "@/lib/format";
import type { Order } from "@/types";

export function OrderCard({
  order,
  shopName,
  href,
}: {
  order: Order;
  shopName?: string;
  href: string;
}) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-2xl border bg-card p-4 shadow-card">
      <div>
        <p className="font-medium">
          {order.id}
          {shopName ? ` · ${shopName}` : ""}
        </p>
        <p className="text-sm text-muted-foreground">
          {formatDateTime(order.createdAt)} · {order.items.length} items
        </p>
      </div>
      <div className="text-right">
        <StatusBadge status={order.status} />
        <p className="mt-1 font-semibold">{formatInr(order.total)}</p>
      </div>
    </Link>
  );
}
