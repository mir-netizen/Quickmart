import { mockApi } from "@/services/mock/api";

export const orderService = {
  getOrders: mockApi.orders.list,
  getOrderById: mockApi.orders.getById,
  createOrder: mockApi.orders.create,
  advanceOrder: mockApi.orders.advance,
  rejectOrder: mockApi.orders.reject,
};
