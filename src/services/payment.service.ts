import { mockApi } from "@/services/mock/api";

export const paymentService = {
  getPayments: mockApi.payments.list,
  getRefunds: mockApi.refunds.list,
  decideRefund: mockApi.refunds.decide,
};
