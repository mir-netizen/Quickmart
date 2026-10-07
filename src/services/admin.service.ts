import { mockApi } from "@/services/mock/api";

export const adminService = {
  getAnalytics: mockApi.analytics.summary,
  getUsers: mockApi.users.list,
  getUserById: mockApi.users.getById,
  updateUser: mockApi.users.update,
  approveShop: mockApi.shops.approve,
  rejectShop: mockApi.shops.reject,
};
