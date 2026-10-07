import { mockApi } from "@/services/mock/api";

export const merchantService = {
  getDashboard: mockApi.merchant.dashboard,
  getEarnings: mockApi.merchant.earnings,
};
