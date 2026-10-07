import { mockApi } from "@/services/mock/api";

export const cartService = {
  getCart: mockApi.cart.get,
  addToCart: mockApi.cart.add,
  replaceCartAndAdd: mockApi.cart.replaceAndAdd,
  setQuantity: mockApi.cart.setQty,
  applyCoupon: mockApi.cart.applyCoupon,
  clearCart: mockApi.cart.clear,
};
