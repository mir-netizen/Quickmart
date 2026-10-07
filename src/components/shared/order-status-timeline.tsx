import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import type { OrderEvent, OrderStatus } from "@/types";

const steps: Array<{ key: OrderStatus; label: string }> = [
  { key: "placed", label: "Order placed" },
  { key: "accepted", label: "Shop accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready for pickup" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

export function OrderStatusTimeline({ status, events }: { status: OrderStatus; events: OrderEvent[] }) {
  const currentIndex = steps.findIndex((step) => step.key === status);
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => {
        const event = events.find((item) => item.status === step.key);
        const done = currentIndex >= index && status !== "cancelled" && status !== "rejected";
        const current = currentIndex === index;
        return (
          <li key={step.key} className="flex gap-3">
            <span
              className={cn(
                "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-xs",
                done ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
                current && "ring-4 ring-primary/15",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            <div>
              <p className={cn("text-sm font-medium", done ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
              {event ? <p className="text-xs text-muted-foreground">{formatDateTime(event.at)}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
