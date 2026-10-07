"use client";

import { toast } from "sonner";
import { cartService } from "@/services/cart.service";
import { useStoreSnapshot } from "@/hooks/use-async";
import { DEFAULT_DELIVERY_FEE } from "@/lib/constants";

export function useCart() {
  const store = useStoreSnapshot();
  const cart = store.cart;
  const shop = store.shops.find((item) => item.id === cart.shopId) ?? null;
  const lines = cart.items.map((item) => {
    const listing = store.listings.find((row) => row.id === item.listingId)!;
    const product = store.catalog.find((row) => row.id === item.productId)!;
    return { ...item, listing, product, lineTotal: listing.price * item.quantity };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const coupon = store.coupons.find((item) => item.code === cart.couponCode) ?? null;
  const discount = coupon && subtotal >= coupon.minSubtotal ? coupon.amount : 0;
  const deliveryFee = lines.length ? DEFAULT_DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee - discount;
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);

  return {
    cart,
    shop,
    lines,
    subtotal,
    discount,
    deliveryFee,
    total,
    count,
    coupon,
    async add(listingId: string, quantity = 1) {
      const next = await cartService.addToCart({ listingId, quantity });
      toast.success("Added to cart");
      return next;
    },
    async replaceAndAdd(listingId: string, quantity = 1) {
      const next = await cartService.replaceCartAndAdd({ listingId, quantity });
      toast.success("Started a new cart");
      return next;
    },
    async setQty(listingId: string, quantity: number) {
      await cartService.setQuantity(listingId, quantity);
    },
    async applyCoupon(code: string) {
      await cartService.applyCoupon(code);
      toast.success("Coupon applied");
    },
    async clear() {
      await cartService.clearCart();
    },
  };
}

export type CartConflict = Error & { currentShop?: string; nextShop?: string };

export function isCartConflict(error: unknown): error is CartConflict {
  return error instanceof Error && error.message === "CART_SHOP_CONFLICT";
}
