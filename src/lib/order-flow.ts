import type { OrderStatus } from "@/types";

export function merchantNextAction(status: OrderStatus): { next: OrderStatus; label: string } | null {
  if (status === "placed") return { next: "accepted", label: "Accept order" };
  if (status === "accepted") return { next: "preparing", label: "Start preparing" };
  if (status === "preparing") return { next: "ready", label: "Mark ready" };
  return null;
}

export function customerNextStatus(status: OrderStatus): OrderStatus | null {
  const flow: OrderStatus[] = ["placed", "accepted", "preparing", "ready", "out_for_delivery", "delivered"];
  const index = flow.indexOf(status);
  if (index < 0 || index === flow.length - 1) return null;
  return flow[index + 1];
}
