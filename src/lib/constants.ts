export const PLATFORM_FEE_RATE = 0.1;
export const DEFAULT_DELIVERY_FEE = 20;
export const LOW_STOCK_THRESHOLD = 5;
export const STORE_VERSION = 3;
export const STORE_KEY = "quickmart-store-v3";
export const AUTH_KEY = "quickmart-auth-v1";
/** Seeded “today” so dashboard KPIs stay consistent in the frontend prototype. */
export const DEMO_TODAY = "2026-09-28";

export const DEMO_PASSWORDS = {
  customer: "demo123",
  merchant: "demo123",
  admin: "demo123",
} as const;

export const ORDER_FLOW = [
  "placed",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
] as const;
