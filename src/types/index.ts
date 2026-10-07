export type UserRole = "customer" | "merchant" | "admin";
export type AccountStatus = "active" | "suspended";
export type ShopStatus = "pending" | "active" | "rejected" | "suspended";
export type ListingStatus = "active" | "disabled" | "out_of_stock";
export type PaymentMethod = "upi" | "card" | "cod";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus =
  | "placed"
  | "accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "rejected";
export type RefundStatus = "requested" | "approved" | "rejected" | "processed";
export type AddressLabel = "Home" | "Office" | "Other";
export type InventoryReason =
  | "physical_stock_update"
  | "damage"
  | "expiry"
  | "correction"
  | "received_supply";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  shopId?: string;
  avatarInitials: string;
}

export interface Address {
  id: string;
  userId: string;
  label: AddressLabel;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
}

export interface ShopHours {
  open: string;
  close: string;
}

export interface ShopDocument {
  id: string;
  name: string;
  type: string;
  status: "submitted" | "verified" | "rejected";
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  distanceKm: number;
  etaMin: number;
  etaMax: number;
  rating: number;
  reviewCount: number;
  image: string;
  banner: string;
  status: ShopStatus;
  hours: ShopHours;
  deliveryRadiusKm: number;
  submittedAt: string;
  documents: ShopDocument[];
  isOpen: boolean;
}

export interface CatalogProduct {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  description: string;
  unit: string;
  mrp: number;
  image: string;
  active: boolean;
}

export interface ShopListing {
  id: string;
  shopId: string;
  productId: string;
  price: number;
  stock: number;
  reserved: number;
  status: ListingStatus;
  lowStockThreshold: number;
}

export interface CartItem {
  listingId: string;
  productId: string;
  shopId: string;
  quantity: number;
}

export interface Cart {
  shopId: string | null;
  items: CartItem[];
  couponCode: string | null;
}

export interface Coupon {
  code: string;
  label: string;
  amount: number;
  minSubtotal: number;
}

export interface OrderItem {
  listingId: string;
  productId: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  mrp: number;
}

export interface OrderEvent {
  status: OrderStatus | "payment_confirmed";
  at: string;
  note: string;
}

export interface Order {
  id: string;
  customerId: string;
  shopId: string;
  items: OrderItem[];
  addressId: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  platformFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  etaMinutes: number;
  events: OrderEvent[];
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  shopId: string;
  customerId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

export interface Refund {
  id: string;
  orderId: string;
  customerId: string;
  shopId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
}

export interface Review {
  id: string;
  shopId: string;
  productId?: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
}

export interface AppStore {
  users: User[];
  addresses: Address[];
  categories: Category[];
  shops: Shop[];
  catalog: CatalogProduct[];
  listings: ShopListing[];
  cart: Cart;
  selectedAddressId: string | null;
  coupons: Coupon[];
  orders: Order[];
  payments: PaymentRecord[];
  refunds: Refund[];
  reviews: Review[];
}
