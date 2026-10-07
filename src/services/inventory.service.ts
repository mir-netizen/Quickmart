import { mockApi } from "@/services/mock/api";

export const inventoryService = {
  getInventory: mockApi.inventory.list,
  updateInventory: mockApi.inventory.update,
};
