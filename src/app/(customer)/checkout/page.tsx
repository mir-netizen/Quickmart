"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useStoreSnapshot } from "@/hooks/use-async";
import { orderService } from "@/services/order.service";
import { userService } from "@/services/user.service";
import { PriceBreakdown } from "@/components/shared/price-breakdown";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PaymentMethod } from "@/types";

const schema = z.object({
  addressId: z.string().min(1, "Choose an address"),
  paymentMethod: z.enum(["upi", "card", "cod"]),
  coupon: z.string().optional(),
});

export default function CustomerCheckoutPage() {
  const { user } = useAuth();
  const cart = useCart();
  const store = useStoreSnapshot();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addresses = store.addresses.filter((item) => item.userId === user?.id);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      addressId: store.selectedAddressId ?? addresses[0]?.id ?? "",
      paymentMethod: "upi" as PaymentMethod,
      coupon: "",
    },
  });

  if (!user) {
    return <div className="page-wrap py-10"><EmptyState title="Sign in to checkout" description="Login is mocked for this frontend prototype." action={{ label: "Login", href: "/login" }} /></div>;
  }
  if (!cart.lines.length) {
    return <div className="page-wrap py-10"><EmptyState title="Nothing to checkout" description="Add items before placing an order." action={{ label: "Go to cart", href: "/cart" }} /></div>;
  }

  return (
    <div className="page-wrap grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          setBusy(true);
          setError(null);
          try {
            if (values.coupon) {
              try { await cart.applyCoupon(values.coupon); } catch { /* optional */ }
            }
            userService.setSelectedAddressId(values.addressId);
            const order = await orderService.createOrder({
              customerId: user.id,
              addressId: values.addressId,
              paymentMethod: values.paymentMethod,
            });
            router.push(`/orders/${order.id}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not place order");
          } finally {
            setBusy(false);
          }
        })}
      >
        <h1 className="font-display text-3xl font-semibold">Checkout</h1>
        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="font-medium">Delivery address</h2>
          <RadioGroup
            className="mt-3 space-y-2"
            value={form.watch("addressId")}
            onValueChange={(value) => form.setValue("addressId", value)}
          >
            {addresses.map((address) => (
              <label key={address.id} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3">
                <RadioGroupItem value={address.id} />
                <span>
                  <span className="font-medium">{address.label}</span>
                  <span className="block text-sm text-muted-foreground">{address.line1}, {address.city} {address.pincode}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="font-medium">Order summary</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {cart.lines.map((line) => (
              <li key={line.listingId} className="flex justify-between">
                <span>{line.product.name} × {line.quantity}</span>
                <span>₹{line.lineTotal}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <Label htmlFor="coupon">Coupon</Label>
          <div className="mt-2 flex gap-2">
            <Input id="coupon" placeholder="FIRST10" {...form.register("coupon")} />
            <Button type="button" variant="outline" onClick={() => void cart.applyCoupon(form.getValues("coupon") || "FIRST10")}>Apply</Button>
          </div>
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="font-medium">Payment method</h2>
          <RadioGroup className="mt-3 space-y-2" value={form.watch("paymentMethod")} onValueChange={(v) => form.setValue("paymentMethod", v as PaymentMethod)}>
            {[
              ["upi", "UPI"],
              ["card", "Credit / Debit card"],
              ["cod", "Cash on delivery"],
            ].map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 rounded-xl border p-3">
                <RadioGroupItem value={value} /> {label}
              </label>
            ))}
          </RadioGroup>
          <p className="mt-2 text-xs text-muted-foreground">Payments are UI-only. No gateway is called.</p>
        </section>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button className="w-full" size="lg" disabled={busy}>{busy ? "Processing..." : "Place order"}</Button>
      </form>
      <aside className="h-fit rounded-2xl border bg-card p-5 shadow-card">
        <PriceBreakdown subtotal={cart.subtotal} deliveryFee={cart.deliveryFee} discount={cart.discount} total={cart.total} />
      </aside>
    </div>
  );
}
