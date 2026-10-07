import { mockApi } from "@/services/mock/api";

export const shopService = {
  getShops: mockApi.shops.list,
  getShopById: mockApi.shops.getById,
  updateShop: mockApi.shops.update,
  approveShop: mockApi.shops.approve,
  rejectShop: mockApi.shops.reject,
};
