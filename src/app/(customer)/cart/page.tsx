"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { formatInr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { PriceBreakdown } from "@/components/shared/price-breakdown";

export default function CustomerCartPage() {
  const cart = useCart();

  if (!cart.lines.length) {
    return (
      <div className="page-wrap py-10">
        <EmptyState title="Your cart is empty" description="Add items from a nearby shop to get started." action={{ label: "Start shopping", href: "/shops" }} />
      </div>
    );
  }

  return (
    <div className="page-wrap grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
      <section>
        <h1 className="font-display text-3xl font-semibold">Cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">Shop: {cart.shop?.name}</p>
        <ul className="mt-6 space-y-4">
          {cart.lines.map((line) => (
            <li key={line.listingId} className="flex gap-4 rounded-2xl border bg-card p-4 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={line.product.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-medium">{line.product.name}</p>
                <p className="text-xs text-muted-foreground">{line.product.unit}</p>
                <p className="mt-1 font-semibold">{formatInr(line.lineTotal)}</p>
              </div>
              <div className="flex items-center rounded-full border">
                <button className="px-3 py-1" type="button" onClick={() => void cart.setQty(line.listingId, line.quantity - 1)}>-</button>
                <span className="w-6 text-center text-sm">{line.quantity}</span>
                <button className="px-3 py-1" type="button" onClick={() => void cart.setQty(line.listingId, line.quantity + 1)}>+</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <aside className="h-fit rounded-2xl border bg-card p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold">Bill details</h2>
        <div className="mt-4">
          <PriceBreakdown subtotal={cart.subtotal} deliveryFee={cart.deliveryFee} discount={cart.discount} total={cart.total} />
        </div>
        <Button className="mt-6 w-full" asChild>
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
      </aside>
    </div>
  );
}
