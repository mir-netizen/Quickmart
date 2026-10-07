import { formatInr } from "@/lib/format";
import { Separator } from "@/components/ui/separator";

export function PriceBreakdown({
  subtotal,
  deliveryFee,
  discount,
  total,
}: {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Subtotal</dt>
        <dd>{formatInr(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted-foreground">Delivery</dt>
        <dd>{formatInr(deliveryFee)}</dd>
      </div>
      <div className="flex justify-between text-emerald-700">
        <dt>Discount</dt>
        <dd>-{formatInr(discount)}</dd>
      </div>
      <Separator />
      <div className="flex justify-between text-base font-semibold">
        <dt>Total</dt>
        <dd>{formatInr(total)}</dd>
      </div>
    </dl>
  );
}
