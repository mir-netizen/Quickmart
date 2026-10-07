"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { discountPercent, formatInr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { isCartConflict, useCart } from "@/hooks/use-cart";
import { useStoreSnapshot } from "@/hooks/use-async";
import Link from "next/link";

export default function CustomerProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const shopId = useSearchParams().get("shop") ?? undefined;
  const store = useStoreSnapshot();
  const cart = useCart();
  const product = store.catalog.find((item) => item.id === productId);
  const listing = store.listings.find((item) => item.productId === productId && (shopId ? item.shopId === shopId : true) && store.shops.find((s) => s.id === item.shopId)?.status === "active");
  const shop = listing ? store.shops.find((item) => item.id === listing.shopId) : undefined;
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [conflict, setConflict] = useState<{ current?: string; next?: string } | null>(null);

  if (!product || !listing || !shop) {
    return <div className="page-wrap py-10"><ErrorState message="We couldn't load this product." /></div>;
  }

  const activeListing = listing;
  const off = discountPercent(product.mrp, activeListing.price);

  async function add() {
    setBusy(true);
    try {
      await cart.add(activeListing.id, qty);
    } catch (error) {
      if (isCartConflict(error)) setConflict({ current: error.currentShop, next: error.nextShop });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-wrap grid gap-8 py-8 md:grid-cols-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image} alt={product.name} className="aspect-square w-full rounded-3xl object-cover shadow-card" />
      <div>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <h1 className="mt-1 font-display text-4xl font-semibold">{product.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{product.unit} · from <Link className="text-primary" href={`/shops/${shop.id}`}>{shop.name}</Link></p>
        <div className="mt-4">
          <p className="text-3xl font-semibold">{formatInr(listing.price)}</p>
          {off > 0 ? (
            <p className="text-sm text-muted-foreground">
              MRP <span className="line-through">{formatInr(product.mrp)}</span> · <span className="text-emerald-700">{off}% OFF</span>
            </p>
          ) : null}
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>
        <p className="mt-4 text-sm">{listing.stock - listing.reserved > 0 ? "✓ Available" : "Currently unavailable"}</p>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center rounded-full border">
            <button className="px-3 py-2" type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">-</button>
            <span className="w-8 text-center">{qty}</span>
            <button className="px-3 py-2" type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
          </div>
          <Button size="lg" disabled={busy} onClick={() => void add()}>{busy ? "Adding..." : "Add to cart"}</Button>
        </div>
      </div>
      <ConfirmationDialog
        open={Boolean(conflict)}
        onOpenChange={() => setConflict(null)}
        title="Start a new cart?"
        description={`Your cart contains items from ${conflict?.current}. Start a new cart with ${conflict?.next}?`}
        confirmLabel="Clear cart & continue"
        onConfirm={async () => {
          await cart.replaceAndAdd(listing.id, qty);
          setConflict(null);
        }}
      />
    </div>
  );
}
