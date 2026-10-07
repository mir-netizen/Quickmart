import { Badge } from "@/components/ui/badge";
import type { OrderStatus, ShopStatus, PaymentStatus, ListingStatus, AccountStatus, RefundStatus } from "@/types";

const orderMap: Record<OrderStatus, { label: string; variant: "default" | "success" | "warning" | "danger" | "secondary" }> = {
  placed: { label: "Pending", variant: "warning" },
  accepted: { label: "Accepted", variant: "default" },
  preparing: { label: "Preparing", variant: "default" },
  ready: { label: "Ready", variant: "success" },
  out_for_delivery: { label: "Out for delivery", variant: "default" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "danger" },
  rejected: { label: "Rejected", variant: "danger" },
};

export function StatusBadge({
  status,
}: {
  status: OrderStatus | ShopStatus | PaymentStatus | ListingStatus | AccountStatus | RefundStatus | string;
}) {
  if (status in orderMap) {
    const item = orderMap[status as OrderStatus];
    return <Badge variant={item.variant}>{item.label}</Badge>;
  }
  const labels: Record<string, { label: string; variant: "success" | "warning" | "danger" | "default" | "secondary" }> = {
    active: { label: "Active", variant: "success" },
    pending: { label: "Pending", variant: "warning" },
    rejected: { label: "Rejected", variant: "danger" },
    suspended: { label: "Suspended", variant: "danger" },
    paid: { label: "Paid", variant: "success" },
    failed: { label: "Failed", variant: "danger" },
    refunded: { label: "Refunded", variant: "secondary" },
    disabled: { label: "Disabled", variant: "secondary" },
    out_of_stock: { label: "Out of stock", variant: "danger" },
    requested: { label: "Requested", variant: "warning" },
    approved: { label: "Approved", variant: "success" },
    processed: { label: "Processed", variant: "success" },
  };
  const item = labels[status] ?? { label: status.replaceAll("_", " "), variant: "secondary" as const };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
