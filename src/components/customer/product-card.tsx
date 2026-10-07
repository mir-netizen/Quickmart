"use client";

import Link from "next/link";
import { formatInr, discountPercent } from "@/lib/format";
import { Button } from "@/components/ui/button";
import type { CatalogProduct, ShopListing } from "@/types";
import { useState } from "react";
import { isCartConflict, useCart } from "@/hooks/use-cart";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";

export function ProductCard({ product, listing }: { product: CatalogProduct; listing: ShopListing }) {
  const cart = useCart();
  const off = discountPercent(product.mrp, listing.price);
  const [conflict, setConflict] = useState<{ current?: string; next?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function add() {
    setBusy(true);
    try {
      await cart.add(listing.id);
    } catch (error) {
      if (isCartConflict(error)) setConflict({ current: error.currentShop, next: error.nextShop });
      else throw error;
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card">
      <Link href={`/products/${product.id}?shop=${listing.shopId}`} className="block aspect-square overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </Link>
      <div className="flex flex-1 flex-col p-3">
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <Link href={`/products/${product.id}?shop=${listing.shopId}`} className="line-clamp-2 font-medium leading-snug">
          {product.name}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">{product.unit}</p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="font-semibold">{formatInr(listing.price)}</p>
            {off > 0 ? (
              <p className="text-xs text-muted-foreground">
                <span className="line-through">{formatInr(product.mrp)}</span>{" "}
                <span className="text-emerald-700">{off}% OFF</span>
              </p>
            ) : null}
          </div>
          <Button size="sm" disabled={busy || listing.status === "out_of_stock"} onClick={() => void add()}>
            {listing.status === "out_of_stock" ? "Sold out" : busy ? "..." : "+ Add"}
          </Button>
        </div>
      </div>
      <ConfirmationDialog
        open={Boolean(conflict)}
        onOpenChange={() => setConflict(null)}
        title="Start a new cart?"
        description={`Your cart contains items from ${conflict?.current}. Start a new cart with ${conflict?.next}?`}
        confirmLabel="Clear cart & continue"
        loading={busy}
        onConfirm={async () => {
          setBusy(true);
          await cart.replaceAndAdd(listing.id);
          setBusy(false);
          setConflict(null);
        }}
      />
    </article>
  );
}
