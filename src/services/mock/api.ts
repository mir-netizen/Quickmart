import { DEFAULT_DELIVERY_FEE, LOW_STOCK_THRESHOLD, ORDER_FLOW, PLATFORM_FEE_RATE } from "@/lib/constants";
import { demoAccounts } from "@/data/mock/seed";
import { getAuthSession, mockStore, setAuthSession } from "@/services/mock/store";
import { mockLatency } from "@/services/mock/latency";
import { uid } from "@/lib/utils";
import type {
  Address,
  AddressLabel,
  CatalogProduct,
  InventoryReason,
  ListingStatus,
  Order,
  OrderStatus,
  PaymentMethod,
  Shop,
  ShopStatus,
  User,
  UserRole,
} from "@/types";

function requireUser(userId: string) {
  const user = mockStore.get().users.find((item) => item.id === userId);
  if (!user) throw new Error("User not found");
  return user;
}

export const mockApi = {
  auth: {
    async login(email: string, password: string) {
      await mockLatency(null, 500);
      const match = Object.values(demoAccounts).find((account) => account.email === email);
      if (!match || match.password !== password) {
        throw new Error("Invalid email or password");
      }
      const user = mockStore.get().users.find((item) => item.email.toLowerCase() === email.toLowerCase());
      if (!user) throw new Error("User not found");
      if (user.status === "suspended") throw new Error("This account is suspended");
      setAuthSession({ userId: user.id, role: user.role });
      return user;
    },
    async demoLogin(role: UserRole) {
      const account = demoAccounts[role];
      return this.login(account.email, account.password);
    },
    async register(input: { name: string; email: string; phone: string; password: string }) {
      await mockLatency(null, 600);
      if (input.password.length < 6) throw new Error("Password must be at least 6 characters");
      const exists = mockStore.get().users.some((user) => user.email.toLowerCase() === input.email.toLowerCase());
      if (exists) throw new Error("An account with this email already exists");
      const user: User = {
        id: uid("user"),
        name: input.name,
        email: input.email,
        phone: input.phone,
        role: "customer",
        status: "active",
        createdAt: new Date().toISOString(),
        avatarInitials: input.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      };
      const address: Address = {
        id: uid("addr"),
        userId: user.id,
        label: "Home",
        line1: "Add your street address",
        city: "Bangalore",
        pincode: "560001",
        isDefault: true,
      };
      mockStore.update((store) => {
        store.users.push(user);
        store.addresses.push(address);
      });
      setAuthSession({ userId: user.id, role: "customer" });
      return user;
    },
    async logout() {
      await mockLatency(null, 200);
      setAuthSession(null);
    },
    getCurrentUser() {
      const session = getAuthSession();
      if (!session) return null;
      return mockStore.get().users.find((user) => user.id === session.userId) ?? null;
    },
  },

  shops: {
    async list(options?: { status?: ShopStatus; includePending?: boolean }) {
      const shops = mockStore.get().shops.filter((shop) => {
        if (options?.status) return shop.status === options.status;
        if (!options?.includePending) return shop.status === "active";
        return true;
      });
      return mockLatency(shops);
    },
    async getById(id: string) {
      const shop = mockStore.get().shops.find((item) => item.id === id);
      if (!shop) throw new Error("Shop not found");
      return mockLatency(shop);
    },
    async update(id: string, patch: Partial<Shop>) {
      mockStore.update((store) => {
        const shop = store.shops.find((item) => item.id === id);
        if (!shop) throw new Error("Shop not found");
        Object.assign(shop, patch);
      });
      return mockLatency(mockStore.get().shops.find((item) => item.id === id)!);
    },
    async approve(id: string) {
      mockStore.update((store) => {
        const shop = store.shops.find((item) => item.id === id);
        if (!shop) throw new Error("Shop not found");
        shop.status = "active";
        shop.isOpen = true;
        shop.documents = shop.documents.map((doc) => ({ ...doc, status: "verified" }));
      });
      return mockLatency(true, 550);
    },
    async reject(id: string, _reason?: string) {
      mockStore.update((store) => {
        const shop = store.shops.find((item) => item.id === id);
        if (!shop) throw new Error("Shop not found");
        shop.status = "rejected";
        shop.isOpen = false;
      });
      return mockLatency(true, 550);
    },
  },

  categories: {
    async list() {
      return mockLatency(mockStore.get().categories);
    },
    async getById(id: string) {
      const category = mockStore.get().categories.find((item) => item.id === id || item.slug === id);
      if (!category) throw new Error("Category not found");
      return mockLatency(category);
    },
    async create(input: { name: string; description: string }) {
      const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const category = {
        id: uid("cat"),
        name: input.name,
        slug,
        description: input.description,
        icon: "Tag",
        image: mockStore.get().categories[0]?.image ?? "",
      };
      mockStore.update((store) => {
        store.categories.push(category);
      });
      return mockLatency(category, 400);
    },
  },

  products: {
    async catalog(filters?: { query?: string; categoryId?: string }) {
      let items = mockStore.get().catalog;
      if (filters?.categoryId) items = items.filter((item) => item.categoryId === filters.categoryId);
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        items = items.filter((item) => `${item.name} ${item.brand}`.toLowerCase().includes(q));
      }
      return mockLatency(items);
    },
    async getCatalogById(id: string) {
      const product = mockStore.get().catalog.find((item) => item.id === id);
      if (!product) throw new Error("Product not found");
      return mockLatency(product);
    },
    async createCatalog(input: Omit<CatalogProduct, "id" | "active">) {
      const product: CatalogProduct = { ...input, id: uid("prod"), active: true };
      mockStore.update((store) => {
        store.catalog.push(product);
      });
      return mockLatency(product, 500);
    },
    async updateCatalog(id: string, patch: Partial<CatalogProduct>) {
      mockStore.update((store) => {
        const product = store.catalog.find((item) => item.id === id);
        if (!product) throw new Error("Product not found");
        Object.assign(product, patch);
      });
      return mockLatency(mockStore.get().catalog.find((item) => item.id === id)!, 400);
    },
    async shopListings(shopId: string, filters?: { categoryId?: string; query?: string; status?: ListingStatus }) {
      const store = mockStore.get();
      let listings = store.listings.filter((item) => item.shopId === shopId);
      if (filters?.status) listings = listings.filter((item) => item.status === filters.status);
      const hydrated = listings.map((listing) => {
        const product = store.catalog.find((item) => item.id === listing.productId)!;
        return { listing, product };
      }).filter(Boolean);
      let result = hydrated;
      if (filters?.categoryId) result = result.filter((item) => item.product.categoryId === filters.categoryId);
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        result = result.filter((item) => `${item.product.name} ${item.product.brand}`.toLowerCase().includes(q));
      }
      return mockLatency(result);
    },
    async getListing(listingId: string) {
      const store = mockStore.get();
      const listing = store.listings.find((item) => item.id === listingId);
      if (!listing) throw new Error("Listing not found");
      const product = store.catalog.find((item) => item.id === listing.productId);
      const shop = store.shops.find((item) => item.id === listing.shopId);
      if (!product || !shop) throw new Error("Listing is incomplete");
      return mockLatency({ listing, product, shop });
    },
    async getByProductId(productId: string, shopId?: string) {
      const store = mockStore.get();
      const product = store.catalog.find((item) => item.id === productId);
      if (!product) throw new Error("Product not found");
      const listing = store.listings.find((item) => item.productId === productId && (shopId ? item.shopId === shopId : item.status === "active" && store.shops.find((s) => s.id === item.shopId)?.status === "active"));
      if (!listing) throw new Error("This product is not listed in an active shop");
      const shop = store.shops.find((item) => item.id === listing.shopId)!;
      return mockLatency({ listing, product, shop });
    },
    async addToShop(input: { shopId: string; productId: string; price: number; stock: number }) {
      const existing = mockStore.get().listings.find((item) => item.shopId === input.shopId && item.productId === input.productId);
      if (existing) throw new Error("This product is already in your shop");
      const listing = {
        id: `listing-${input.shopId}-${input.productId}`,
        shopId: input.shopId,
        productId: input.productId,
        price: input.price,
        stock: input.stock,
        reserved: 0,
        status: "active" as const,
        lowStockThreshold: LOW_STOCK_THRESHOLD,
      };
      mockStore.update((store) => {
        store.listings.push(listing);
      });
      return mockLatency(listing, 500);
    },
    async updateListing(listingId: string, patch: { price?: number; status?: ListingStatus }) {
      mockStore.update((store) => {
        const listing = store.listings.find((item) => item.id === listingId);
        if (!listing) throw new Error("Listing not found");
        Object.assign(listing, patch);
      });
      return mockLatency(true);
    },
    async popular() {
      const store = mockStore.get();
      const featuredIds = ["prod-001", "prod-005", "prod-008", "prod-011", "prod-017", "prod-021", "prod-033", "prod-040"];
      const items = featuredIds
        .map((productId) => {
          const listing = store.listings.find((item) => item.productId === productId && item.shopId === "shop-01");
          const product = store.catalog.find((item) => item.id === productId);
          if (!listing || !product) return null;
          return { listing, product, shopId: "shop-01" };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
      return mockLatency(items);
    },
  },

  inventory: {
    async list(shopId: string) {
      const store = mockStore.get();
      const rows = store.listings
        .filter((item) => item.shopId === shopId)
        .map((listing) => ({
          listing,
          product: store.catalog.find((item) => item.id === listing.productId)!,
          available: Math.max(0, listing.stock - listing.reserved),
          isLow: listing.stock - listing.reserved <= listing.lowStockThreshold,
        }));
      return mockLatency(rows);
    },
    async update(listingId: string, quantity: number, _reason: InventoryReason) {
      mockStore.update((store) => {
        const listing = store.listings.find((item) => item.id === listingId);
        if (!listing) throw new Error("Listing not found");
        listing.stock = quantity;
        listing.status = quantity - listing.reserved <= 0 ? "out_of_stock" : "active";
      });
      return mockLatency(true, 500);
    },
  },

  cart: {
    get() {
      return mockStore.get().cart;
    },
    async add(input: { listingId: string; quantity?: number }) {
      const store = mockStore.get();
      const listing = store.listings.find((item) => item.id === input.listingId);
      if (!listing) throw new Error("Listing not found");
      const available = listing.stock - listing.reserved;
      if (available <= 0) throw new Error("This item is out of stock");
      const cart = store.cart;
      if (cart.shopId && cart.shopId !== listing.shopId && cart.items.length > 0) {
        const shop = store.shops.find((item) => item.id === cart.shopId);
        const nextShop = store.shops.find((item) => item.id === listing.shopId);
        const error = new Error("CART_SHOP_CONFLICT") as Error & { currentShop?: string; nextShop?: string };
        error.currentShop = shop?.name;
        error.nextShop = nextShop?.name;
        throw error;
      }
      mockStore.update((draft) => {
        draft.cart.shopId = listing.shopId;
        const existing = draft.cart.items.find((item) => item.listingId === listing.id);
        const qty = input.quantity ?? 1;
        if (existing) existing.quantity += qty;
        else {
          draft.cart.items.push({
            listingId: listing.id,
            productId: listing.productId,
            shopId: listing.shopId,
            quantity: qty,
          });
        }
      });
      return mockLatency(mockStore.get().cart, 350);
    },
    async replaceAndAdd(input: { listingId: string; quantity?: number }) {
      mockStore.update((draft) => {
        draft.cart = { shopId: null, items: [], couponCode: null };
      });
      return this.add(input);
    },
    async setQty(listingId: string, quantity: number) {
      mockStore.update((draft) => {
        if (quantity <= 0) {
          draft.cart.items = draft.cart.items.filter((item) => item.listingId !== listingId);
        } else {
          const item = draft.cart.items.find((row) => row.listingId === listingId);
          if (item) item.quantity = quantity;
        }
        if (draft.cart.items.length === 0) {
          draft.cart.shopId = null;
          draft.cart.couponCode = null;
        }
      });
      return mockLatency(mockStore.get().cart, 200);
    },
    async applyCoupon(code: string) {
      const coupon = mockStore.get().coupons.find((item) => item.code.toUpperCase() === code.toUpperCase());
      if (!coupon) throw new Error("Coupon not found");
      mockStore.update((draft) => {
        draft.cart.couponCode = coupon.code;
      });
      return mockLatency(coupon, 300);
    },
    async clear() {
      mockStore.update((draft) => {
        draft.cart = { shopId: null, items: [], couponCode: null };
      });
      return mockLatency(true, 200);
    },
  },

  orders: {
    async list(filters?: { customerId?: string; shopId?: string; status?: OrderStatus }) {
      let orders = mockStore.get().orders;
      if (filters?.customerId) orders = orders.filter((item) => item.customerId === filters.customerId);
      if (filters?.shopId) orders = orders.filter((item) => item.shopId === filters.shopId);
      if (filters?.status) orders = orders.filter((item) => item.status === filters.status);
      return mockLatency([...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    },
    async getById(id: string) {
      const order = mockStore.get().orders.find((item) => item.id === id);
      if (!order) throw new Error("Order not found");
      return mockLatency(order);
    },
    async create(input: { customerId: string; addressId: string; paymentMethod: PaymentMethod }) {
      const store = mockStore.get();
      const cart = store.cart;
      if (!cart.shopId || cart.items.length === 0) throw new Error("Your cart is empty");
      const shop = store.shops.find((item) => item.id === cart.shopId)!;
      const items = cart.items.map((item) => {
        const listing = store.listings.find((row) => row.id === item.listingId)!;
        const product = store.catalog.find((row) => row.id === item.productId)!;
        return {
          listingId: listing.id,
          productId: product.id,
          name: product.name,
          unit: product.unit,
          quantity: item.quantity,
          price: listing.price,
          mrp: product.mrp,
        };
      });
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const coupon = store.coupons.find((item) => item.code === cart.couponCode);
      const discount = coupon && subtotal >= coupon.minSubtotal ? coupon.amount : 0;
      const deliveryFee = DEFAULT_DELIVERY_FEE;
      const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
      const total = subtotal + deliveryFee - discount;
      const id = `ORD-${1000 + store.orders.length + 1}`;
      const createdAt = new Date().toISOString();
      const order: Order = {
        id,
        customerId: input.customerId,
        shopId: cart.shopId,
        items,
        addressId: input.addressId,
        subtotal,
        deliveryFee,
        discount,
        platformFee,
        total,
        paymentMethod: input.paymentMethod,
        paymentStatus: input.paymentMethod === "cod" ? "pending" : "paid",
        status: "placed",
        createdAt,
        etaMinutes: shop.etaMax,
        events: [
          { status: "placed", at: createdAt, note: "Order placed" },
          ...(input.paymentMethod === "cod"
            ? []
            : [{ status: "payment_confirmed" as const, at: createdAt, note: "Payment confirmed" }]),
        ],
      };
      mockStore.update((draft) => {
        draft.orders.unshift(order);
        draft.payments.push({
          id: `pay-${order.id}`,
          orderId: order.id,
          shopId: order.shopId,
          customerId: order.customerId,
          amount: order.total,
          method: order.paymentMethod,
          status: order.paymentStatus,
          createdAt,
        });
        for (const item of cart.items) {
          const listing = draft.listings.find((row) => row.id === item.listingId);
          if (listing) listing.reserved += item.quantity;
        }
        draft.cart = { shopId: null, items: [], couponCode: null };
      });
      return mockLatency(order, 900);
    },
    async advance(id: string, next?: OrderStatus) {
      const current = mockStore.get().orders.find((item) => item.id === id);
      if (!current) throw new Error("Order not found");
      const flow: OrderStatus[] = [...ORDER_FLOW];
      const computed = next ?? flow[flow.indexOf(current.status as (typeof ORDER_FLOW)[number]) + 1];
      if (!computed) throw new Error("Order cannot be advanced");
      mockStore.update((draft) => {
        const order = draft.orders.find((item) => item.id === id);
        if (!order) return;
        order.status = computed;
        order.events.push({
          status: computed,
          at: new Date().toISOString(),
          note: computed.replaceAll("_", " "),
        });
        if (computed === "cancelled" || computed === "rejected") {
          for (const item of order.items) {
            const listing = draft.listings.find((row) => row.id === item.listingId);
            if (listing) listing.reserved = Math.max(0, listing.reserved - item.quantity);
          }
        }
        if (computed === "delivered") {
          for (const item of order.items) {
            const listing = draft.listings.find((row) => row.id === item.listingId);
            if (listing) {
              listing.reserved = Math.max(0, listing.reserved - item.quantity);
              listing.stock = Math.max(0, listing.stock - item.quantity);
            }
          }
          const payment = draft.payments.find((item) => item.orderId === id);
          if (payment && payment.method === "cod") payment.status = "paid";
          order.paymentStatus = "paid";
        }
      });
      return mockLatency(mockStore.get().orders.find((item) => item.id === id)!, 450);
    },
    async reject(id: string) {
      return this.advance(id, "rejected");
    },
  },

  users: {
    async list(role?: UserRole | "suspended") {
      let users = mockStore.get().users;
      if (role === "suspended") users = users.filter((item) => item.status === "suspended");
      else if (role) users = users.filter((item) => item.role === role);
      return mockLatency(users);
    },
    async getById(id: string) {
      return mockLatency(requireUser(id));
    },
    async update(id: string, patch: Partial<User>) {
      mockStore.update((store) => {
        const user = store.users.find((item) => item.id === id);
        if (!user) throw new Error("User not found");
        Object.assign(user, patch);
      });
      return mockLatency(requireUser(id));
    },
  },

  addresses: {
    async list(userId: string) {
      return mockLatency(mockStore.get().addresses.filter((item) => item.userId === userId));
    },
    async save(input: Omit<Address, "id"> & { id?: string }) {
      let id = input.id;
      mockStore.update((store) => {
        if (input.isDefault) {
          store.addresses
            .filter((item) => item.userId === input.userId)
            .forEach((item) => {
              item.isDefault = false;
            });
        }
        if (input.id) {
          const existing = store.addresses.find((item) => item.id === input.id);
          if (existing) Object.assign(existing, input);
          id = input.id;
        } else {
          id = uid("addr");
          store.addresses.push({
            id,
            userId: input.userId,
            label: input.label as AddressLabel,
            line1: input.line1,
            line2: input.line2,
            city: input.city,
            pincode: input.pincode,
            isDefault: input.isDefault,
          });
        }
      });
      return mockLatency(mockStore.get().addresses.find((item) => item.id === id)!, 400);
    },
    async remove(id: string) {
      mockStore.update((store) => {
        store.addresses = store.addresses.filter((item) => item.id !== id);
      });
      return mockLatency(true);
    },
    getSelected() {
      return mockStore.get().selectedAddressId;
    },
    setSelected(id: string) {
      mockStore.update((store) => {
        store.selectedAddressId = id;
      });
    },
  },

  payments: {
    async list() {
      return mockLatency([...mockStore.get().payments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    },
  },

  refunds: {
    async list() {
      return mockLatency(mockStore.get().refunds);
    },
    async decide(id: string, status: "approved" | "rejected") {
      mockStore.update((store) => {
        const refund = store.refunds.find((item) => item.id === id);
        if (!refund) throw new Error("Refund not found");
        refund.status = status === "approved" ? "processed" : "rejected";
        if (status === "approved") {
          const payment = store.payments.find((item) => item.orderId === refund.orderId);
          if (payment) payment.status = "refunded";
        }
      });
      return mockLatency(true, 500);
    },
  },

  analytics: {
    async summary() {
      const store = mockStore.get();
      const today = "2026-09-28";
      const todaysOrders = store.orders.filter((order) => order.createdAt.startsWith(today));
      const shopPerf = store.shops
        .filter((shop) => shop.status === "active")
        .map((shop) => {
          const shopOrders = store.orders.filter((order) => order.shopId === shop.id);
          return {
            shopId: shop.id,
            name: shop.name,
            orders: shopOrders.length,
            revenue: shopOrders.reduce((sum, order) => sum + order.total, 0),
            rating: shop.rating,
          };
        })
        .sort((a, b) => b.revenue - a.revenue);
      const productMap = new Map<string, { name: string; units: number; revenue: number }>();
      for (const order of store.orders) {
        for (const item of order.items) {
          const current = productMap.get(item.productId) ?? { name: item.name, units: 0, revenue: 0 };
          current.units += item.quantity;
          current.revenue += item.price * item.quantity;
          productMap.set(item.productId, current);
        }
      }
      const lowStock = store.listings
        .filter((listing) => listing.stock - listing.reserved <= listing.lowStockThreshold)
        .slice(0, 8)
        .map((listing) => ({
          listingId: listing.id,
          shopName: store.shops.find((shop) => shop.id === listing.shopId)?.name ?? "",
          productName: store.catalog.find((product) => product.id === listing.productId)?.name ?? "",
          available: listing.stock - listing.reserved,
        }));
      return mockLatency({
        customers: store.users.filter((user) => user.role === "customer").length,
        activeShops: store.shops.filter((shop) => shop.status === "active").length,
        pendingShops: store.shops.filter((shop) => shop.status === "pending").length,
        todaysOrders: todaysOrders.length + 145,
        todaysRevenue: todaysOrders.reduce((sum, order) => sum + order.total, 0) + 81824,
        revenueByDay: [
          { day: "Tue", revenue: 64210, orders: 98 },
          { day: "Wed", revenue: 70140, orders: 112 },
          { day: "Thu", revenue: 66800, orders: 104 },
          { day: "Fri", revenue: 81220, orders: 131 },
          { day: "Sat", revenue: 94010, orders: 156 },
          { day: "Sun", revenue: 88940, orders: 149 },
          { day: "Mon", revenue: 82430, orders: 148 },
        ],
        topShops: shopPerf,
        productPerformance: [...productMap.entries()]
          .map(([productId, value]) => ({ productId, ...value }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 8),
        lowStock,
        pendingApprovals: store.shops.filter((shop) => shop.status === "pending"),
      });
    },
  },

  merchant: {
    async dashboard(shopId: string) {
      const store = mockStore.get();
      const orders = store.orders.filter((order) => order.shopId === shopId);
      const today = orders.filter((order) => order.createdAt.startsWith("2026-09-28"));
      const inventory = store.listings.filter((item) => item.shopId === shopId);
      return mockLatency({
        todaysOrders: today.length + 21,
        todaysRevenue: today.reduce((sum, order) => sum + order.total, 0) + 17840,
        pendingOrders: orders.filter((order) => order.status === "placed").length,
        lowStock: inventory.filter((item) => item.stock - item.reserved <= item.lowStockThreshold).length,
        recent: orders.slice(0, 6),
        sales: [
          { day: "Tue", revenue: 12400 },
          { day: "Wed", revenue: 15120 },
          { day: "Thu", revenue: 13880 },
          { day: "Fri", revenue: 17210 },
          { day: "Sat", revenue: 21040 },
          { day: "Sun", revenue: 19600 },
          { day: "Mon", revenue: today.reduce((sum, order) => sum + order.total, 0) + 17600 },
        ],
      });
    },
    async earnings(shopId: string) {
      const store = mockStore.get();
      const orders = store.orders.filter(
        (order) => order.shopId === shopId && order.status !== "cancelled" && order.status !== "rejected",
      );
      const rows = orders.map((order) => ({
        orderId: order.id,
        gross: order.subtotal,
        fee: order.platformFee,
        refund: store.refunds.find((item) => item.orderId === order.id && item.status === "processed")?.amount ?? 0,
        net: order.subtotal - order.platformFee,
        createdAt: order.createdAt,
      }));
      const totalSales = rows.reduce((sum, row) => sum + row.gross, 0);
      const fees = rows.reduce((sum, row) => sum + row.fee, 0);
      const refundsTotal = rows.reduce((sum, row) => sum + row.refund, 0);
      return mockLatency({
        totalSales,
        fees,
        refunds: refundsTotal,
        net: totalSales - fees - refundsTotal,
        rows,
        chart: [
          { day: "Tue", net: 9800 },
          { day: "Wed", net: 11200 },
          { day: "Thu", net: 10440 },
          { day: "Fri", net: 14110 },
          { day: "Sat", net: 16880 },
          { day: "Sun", net: 15420 },
          { day: "Mon", net: Math.max(totalSales - fees, 12200) },
        ],
      });
    },
  },
};
