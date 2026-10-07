import type {
  Address,
  AppStore,
  CatalogProduct,
  Category,
  Coupon,
  Order,
  PaymentRecord,
  Refund,
  Review,
  Shop,
  ShopListing,
  User,
} from "@/types";

const img = {
  veg: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
  dairy: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
  snacks: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=800&q=80",
  drinks: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80",
  care: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
  home: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
  staples: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  frozen: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80",
  eggs: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=800&q=80",
  fruit: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80",
  milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",
  bread: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
  shop: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80",
  shop2: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80",
  shop3: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1200&q=80",
};

export const categories: Category[] = [
  { id: "cat-fruits", name: "Fruits & Vegetables", slug: "fruits-vegetables", description: "Fresh produce delivered same day", icon: "Apple", image: img.fruit },
  { id: "cat-dairy", name: "Dairy", slug: "dairy", description: "Milk, curd, butter and cheese", icon: "Milk", image: img.dairy },
  { id: "cat-bakery", name: "Bakery", slug: "bakery", description: "Breads, buns and bakery treats", icon: "Croissant", image: img.bakery },
  { id: "cat-snacks", name: "Snacks", slug: "snacks", description: "Chips, namkeen and biscuits", icon: "Cookie", image: img.snacks },
  { id: "cat-beverages", name: "Beverages", slug: "beverages", description: "Juices, soft drinks and water", icon: "CupSoda", image: img.drinks },
  { id: "cat-care", name: "Personal Care", slug: "personal-care", description: "Hygiene and everyday care", icon: "Sparkles", image: img.care },
  { id: "cat-household", name: "Household", slug: "household", description: "Cleaning and home essentials", icon: "Home", image: img.home },
  { id: "cat-staples", name: "Staples", slug: "staples", description: "Rice, dal, oil and spices", icon: "Wheat", image: img.staples },
  { id: "cat-eggs", name: "Eggs & Frozen", slug: "eggs-frozen", description: "Eggs, frozen veggies and more", icon: "Snowflake", image: img.eggs },
];

export const users: User[] = [
  { id: "user-customer-1", name: "Rahul Sharma", email: "rahul@demo.com", phone: "9876500001", role: "customer", status: "active", createdAt: "2025-11-12T09:00:00.000Z", avatarInitials: "RS" },
  { id: "user-customer-2", name: "Ananya Iyer", email: "ananya@demo.com", phone: "9876500002", role: "customer", status: "active", createdAt: "2026-01-04T11:20:00.000Z", avatarInitials: "AI" },
  { id: "user-customer-3", name: "Vikram Patel", email: "vikram@demo.com", phone: "9876500003", role: "customer", status: "suspended", createdAt: "2025-08-22T08:10:00.000Z", avatarInitials: "VP" },
  { id: "user-merchant-1", name: "Priya Nair", email: "merchant@freshmart.demo", phone: "9887700101", role: "merchant", status: "active", createdAt: "2025-06-01T10:00:00.000Z", shopId: "shop-01", avatarInitials: "PN" },
  { id: "user-merchant-2", name: "Arjun Mehta", email: "arjun@dailyneeds.demo", phone: "9887700102", role: "merchant", status: "active", createdAt: "2025-07-14T10:00:00.000Z", shopId: "shop-02", avatarInitials: "AM" },
  { id: "user-merchant-3", name: "Sana Khan", email: "sana@greenbasket.demo", phone: "9887700103", role: "merchant", status: "active", createdAt: "2025-09-02T10:00:00.000Z", shopId: "shop-03", avatarInitials: "SK" },
  { id: "user-merchant-4", name: "Dev Reddy", email: "dev@spicehub.demo", phone: "9887700104", role: "merchant", status: "active", createdAt: "2025-10-11T10:00:00.000Z", shopId: "shop-04", avatarInitials: "DR" },
  { id: "user-merchant-5", name: "Meera Joshi", email: "meera@organicroots.demo", phone: "9887700105", role: "merchant", status: "active", createdAt: "2025-10-20T10:00:00.000Z", shopId: "shop-05", avatarInitials: "MJ" },
  { id: "user-merchant-6", name: "Karan Shah", email: "karan@citysuper.demo", phone: "9887700106", role: "merchant", status: "active", createdAt: "2025-11-01T10:00:00.000Z", shopId: "shop-06", avatarInitials: "KS" },
  { id: "user-merchant-7", name: "Lakshmi Rao", email: "lakshmi@kirana.demo", phone: "9887700107", role: "merchant", status: "active", createdAt: "2025-11-18T10:00:00.000Z", shopId: "shop-07", avatarInitials: "LR" },
  { id: "user-merchant-8", name: "Imran Ali", email: "imran@bakerslane.demo", phone: "9887700108", role: "merchant", status: "active", createdAt: "2025-12-02T10:00:00.000Z", shopId: "shop-08", avatarInitials: "IA" },
  { id: "user-merchant-9", name: "Neha Gupta", email: "neha@sunrisegrocers.demo", phone: "9887700109", role: "merchant", status: "active", createdAt: "2026-03-01T10:00:00.000Z", shopId: "shop-09", avatarInitials: "NG" },
  { id: "user-merchant-10", name: "Rohit Das", email: "rohit@metrofresh.demo", phone: "9887700110", role: "merchant", status: "active", createdAt: "2026-03-12T10:00:00.000Z", shopId: "shop-10", avatarInitials: "RD" },
  { id: "user-merchant-11", name: "Tara Singh", email: "tara@valleygrocer.demo", phone: "9887700111", role: "merchant", status: "active", createdAt: "2026-03-24T10:00:00.000Z", shopId: "shop-11", avatarInitials: "TS" },
  { id: "user-admin-1", name: "Katty Kay", email: "admin@quickmart.demo", phone: "9800000001", role: "admin", status: "active", createdAt: "2025-01-01T08:00:00.000Z", avatarInitials: "AK" },
];

export const addresses: Address[] = [
  { id: "addr-1", userId: "user-customer-1", label: "Home", line1: "123 Example Street, Koramangala", city: "Bangalore", pincode: "560034", isDefault: true },
  { id: "addr-2", userId: "user-customer-1", label: "Office", line1: "8th Floor, Indiqube, Outer Ring Road", city: "Bangalore", pincode: "560103", isDefault: false },
  { id: "addr-3", userId: "user-customer-2", label: "Home", line1: "44 Lavelle Road", city: "Bangalore", pincode: "560001", isDefault: true },
];

function shop(
  partial: Omit<Shop, "reviewCount" | "hours" | "deliveryRadiusKm" | "documents" | "isOpen" | "city" | "pincode"> &
    Partial<Pick<Shop, "reviewCount" | "hours" | "deliveryRadiusKm" | "documents" | "isOpen" | "city" | "pincode">>,
): Shop {
  return {
    city: "Bangalore",
    pincode: "560034",
    reviewCount: 210,
    hours: { open: "07:00", close: "22:00" },
    deliveryRadiusKm: 4,
    documents: [
      { id: `${partial.id}-gst`, name: "GST Certificate", type: "GST", status: "submitted" },
      { id: `${partial.id}-fssai`, name: "FSSAI License", type: "FSSAI", status: "submitted" },
    ],
    isOpen: partial.status === "active",
    ...partial,
  };
}

export const shops: Shop[] = [
  shop({ id: "shop-01", name: "Fresh Mart", slug: "fresh-mart", ownerId: "user-merchant-1", description: "Everyday groceries, dairy and fresh produce from your neighbourhood store.", phone: "08040001001", address: "12 5th Block, Koramangala", distanceKm: 1.2, etaMin: 20, etaMax: 30, rating: 4.6, image: img.shop, banner: img.shop, status: "active", submittedAt: "2025-06-01T10:00:00.000Z", reviewCount: 842 }),
  shop({ id: "shop-02", name: "Daily Needs", slug: "daily-needs", ownerId: "user-merchant-2", description: "Kirana essentials, snacks and household staples.", phone: "08040001002", address: "88 Intermediate Ring Road", distanceKm: 2.1, etaMin: 25, etaMax: 35, rating: 4.4, image: img.shop2, banner: img.shop2, status: "active", submittedAt: "2025-07-14T10:00:00.000Z", reviewCount: 511 }),
  shop({ id: "shop-03", name: "Green Basket", slug: "green-basket", ownerId: "user-merchant-3", description: "Fruits, vegetables and organic picks.", phone: "08040001003", address: "3rd Cross, Indiranagar", distanceKm: 3.4, etaMin: 30, etaMax: 40, rating: 4.7, image: img.veg, banner: img.veg, status: "active", submittedAt: "2025-09-02T10:00:00.000Z", reviewCount: 390 }),
  shop({ id: "shop-04", name: "Spice Hub", slug: "spice-hub", ownerId: "user-merchant-4", description: "Masalas, oils, grains and pantry staples.", phone: "08040001004", address: "Jayanagar 4th Block", distanceKm: 4.0, etaMin: 30, etaMax: 45, rating: 4.3, image: img.staples, banner: img.staples, status: "active", submittedAt: "2025-10-11T10:00:00.000Z" }),
  shop({ id: "shop-05", name: "Organic Roots", slug: "organic-roots", ownerId: "user-merchant-5", description: "Certified organic groceries and wellness items.", phone: "08040001005", address: "HSR Layout Sector 4", distanceKm: 2.8, etaMin: 25, etaMax: 35, rating: 4.8, image: img.fruit, banner: img.fruit, status: "active", submittedAt: "2025-10-20T10:00:00.000Z", reviewCount: 276 }),
  shop({ id: "shop-06", name: "City Superstore", slug: "city-superstore", ownerId: "user-merchant-6", description: "A larger neighbourhood supermarket with wide assortment.", phone: "08040001006", address: "BTM 2nd Stage", distanceKm: 3.1, etaMin: 28, etaMax: 40, rating: 4.2, image: img.shop3, banner: img.shop3, status: "active", submittedAt: "2025-11-01T10:00:00.000Z", reviewCount: 1204 }),
  shop({ id: "shop-07", name: "Neighbourhood Kirana", slug: "neighbourhood-kirana", ownerId: "user-merchant-7", description: "Trusted local kirana with fast delivery.", phone: "08040001007", address: "Ejipura Main Road", distanceKm: 0.8, etaMin: 15, etaMax: 25, rating: 4.5, image: img.shop2, banner: img.shop2, status: "active", submittedAt: "2025-11-18T10:00:00.000Z", reviewCount: 188 }),
  shop({ id: "shop-08", name: "Baker's Lane", slug: "bakers-lane", ownerId: "user-merchant-8", description: "Fresh bread, cakes and bakery groceries.", phone: "08040001008", address: "Residency Road", distanceKm: 4.6, etaMin: 35, etaMax: 50, rating: 4.6, image: img.bakery, banner: img.bakery, status: "active", submittedAt: "2025-12-02T10:00:00.000Z", reviewCount: 333 }),
  shop({ id: "shop-09", name: "Sunrise Grocers", slug: "sunrise-grocers", ownerId: "user-merchant-9", description: "New neighbourhood grocery applying to join QuickMart.", phone: "08040001009", address: "Whitefield Main", distanceKm: 8.2, etaMin: 40, etaMax: 55, rating: 0, image: img.shop, banner: img.shop, status: "pending", submittedAt: "2026-03-20T09:30:00.000Z", reviewCount: 0, isOpen: false }),
  shop({ id: "shop-10", name: "Metro Fresh", slug: "metro-fresh", ownerId: "user-merchant-10", description: "Fresh produce store awaiting operations review.", phone: "08040001010", address: "Marathahalli Bridge", distanceKm: 7.1, etaMin: 40, etaMax: 55, rating: 0, image: img.veg, banner: img.veg, status: "pending", submittedAt: "2026-03-22T14:10:00.000Z", reviewCount: 0, isOpen: false }),
  shop({ id: "shop-11", name: "Valley Grocer", slug: "valley-grocer", ownerId: "user-merchant-11", description: "Family-run grocery applying to serve Whitefield apartments.", phone: "08040001011", address: "Hope Farm Junction", distanceKm: 9.4, etaMin: 45, etaMax: 60, rating: 0, image: img.shop3, banner: img.shop3, status: "pending", submittedAt: "2026-03-24T11:00:00.000Z", reviewCount: 0, isOpen: false }),
];

const catalogDefs: Array<Omit<CatalogProduct, "active">> = [
  { id: "prod-001", name: "Amul Taaza Milk", brand: "Amul", categoryId: "cat-dairy", description: "Toned milk, pasteurised and homogenised. Keep refrigerated.", unit: "1 L", mrp: 70, image: img.milk },
  { id: "prod-002", name: "Amul Butter", brand: "Amul", categoryId: "cat-dairy", description: "Salted table butter.", unit: "100 g", mrp: 58, image: img.dairy },
  { id: "prod-003", name: "Nandini Curd", brand: "Nandini", categoryId: "cat-dairy", description: "Fresh set curd.", unit: "400 g", mrp: 32, image: img.dairy },
  { id: "prod-004", name: "Britannia Cheese Slices", brand: "Britannia", categoryId: "cat-dairy", description: "Processed cheese slices.", unit: "200 g", mrp: 145, image: img.dairy },
  { id: "prod-005", name: "Whole Wheat Bread", brand: "Harvest Gold", categoryId: "cat-bakery", description: "Soft whole wheat sandwich bread.", unit: "400 g", mrp: 45, image: img.bread },
  { id: "prod-006", name: "Burger Buns", brand: "English Oven", categoryId: "cat-bakery", description: "Pack of 4 burger buns.", unit: "4 pcs", mrp: 50, image: img.bakery },
  { id: "prod-007", name: "Croissant", brand: "Baker's Lane", categoryId: "cat-bakery", description: "Butter croissant, bake fresh.", unit: "2 pcs", mrp: 80, image: img.bakery },
  { id: "prod-008", name: "Brown Eggs", brand: "Country Eggs", categoryId: "cat-eggs", description: "Farm fresh brown eggs.", unit: "6 pcs", mrp: 78, image: img.eggs },
  { id: "prod-009", name: "White Eggs", brand: "NutriEgg", categoryId: "cat-eggs", description: "Standard white eggs.", unit: "12 pcs", mrp: 96, image: img.eggs },
  { id: "prod-010", name: "Frozen Green Peas", brand: "Safal", categoryId: "cat-eggs", description: "IQF green peas.", unit: "500 g", mrp: 85, image: img.frozen },
  { id: "prod-011", name: "Banana Robusta", brand: "Fresh", categoryId: "cat-fruits", description: "Ripe robusta bananas.", unit: "6 pcs", mrp: 50, image: img.fruit },
  { id: "prod-012", name: "Apple Shimla", brand: "Fresh", categoryId: "cat-fruits", description: "Crisp Shimla apples.", unit: "1 kg", mrp: 180, image: img.fruit },
  { id: "prod-013", name: "Tomato", brand: "Fresh", categoryId: "cat-fruits", description: "Local tomatoes.", unit: "1 kg", mrp: 40, image: img.veg },
  { id: "prod-014", name: "Onion", brand: "Fresh", categoryId: "cat-fruits", description: "Nashik onions.", unit: "1 kg", mrp: 42, image: img.veg },
  { id: "prod-015", name: "Potato", brand: "Fresh", categoryId: "cat-fruits", description: "Table potatoes.", unit: "1 kg", mrp: 36, image: img.veg },
  { id: "prod-016", name: "Spinach", brand: "Fresh", categoryId: "cat-fruits", description: "Cleaned palak bunch.", unit: "1 bunch", mrp: 25, image: img.veg },
  { id: "prod-017", name: "Lays Classic Salted", brand: "Lays", categoryId: "cat-snacks", description: "Potato chips.", unit: "52 g", mrp: 20, image: img.snacks },
  { id: "prod-018", name: "Kurkure Masala Munch", brand: "Kurkure", categoryId: "cat-snacks", description: "Crunchy corn snack.", unit: "90 g", mrp: 20, image: img.snacks },
  { id: "prod-019", name: "Parle-G Gold", brand: "Parle", categoryId: "cat-snacks", description: "Glucose biscuits.", unit: "1 kg", mrp: 110, image: img.snacks },
  { id: "prod-020", name: "Dark Fantasy Choco Fills", brand: "Sunfeast", categoryId: "cat-snacks", description: "Chocolate filled cookies.", unit: "300 g", mrp: 145, image: img.snacks },
  { id: "prod-021", name: "Coca-Cola", brand: "Coca-Cola", categoryId: "cat-beverages", description: "Chilled soft drink.", unit: "750 ml", mrp: 40, image: img.drinks },
  { id: "prod-022", name: "Real Mixed Fruit Juice", brand: "Real", categoryId: "cat-beverages", description: "Mixed fruit nectar.", unit: "1 L", mrp: 120, image: img.drinks },
  { id: "prod-023", name: "Bisleri Packaged Water", brand: "Bisleri", categoryId: "cat-beverages", description: "Packaged drinking water.", unit: "1 L", mrp: 20, image: img.drinks },
  { id: "prod-024", name: "Tata Tea Gold", brand: "Tata Tea", categoryId: "cat-beverages", description: "Premium leaf tea.", unit: "500 g", mrp: 310, image: img.drinks },
  { id: "prod-025", name: "Nescafe Classic", brand: "Nescafe", categoryId: "cat-beverages", description: "Instant coffee.", unit: "50 g", mrp: 190, image: img.drinks },
  { id: "prod-026", name: "Colgate Strong Teeth", brand: "Colgate", categoryId: "cat-care", description: "Toothpaste.", unit: "200 g", mrp: 118, image: img.care },
  { id: "prod-027", name: "Dove Soap", brand: "Dove", categoryId: "cat-care", description: "Moisturising bathing bar.", unit: "125 g", mrp: 72, image: img.care },
  { id: "prod-028", name: "Himalaya Face Wash", brand: "Himalaya", categoryId: "cat-care", description: "Neem purifying face wash.", unit: "150 ml", mrp: 165, image: img.care },
  { id: "prod-029", name: "Surf Excel Easy Wash", brand: "Surf Excel", categoryId: "cat-household", description: "Detergent powder.", unit: "1 kg", mrp: 145, image: img.home },
  { id: "prod-030", name: "Vim Dishwash Bar", brand: "Vim", categoryId: "cat-household", description: "Dishwashing bar.", unit: "300 g", mrp: 28, image: img.home },
  { id: "prod-031", name: "Harpic Power Plus", brand: "Harpic", categoryId: "cat-household", description: "Toilet cleaner.", unit: "500 ml", mrp: 99, image: img.home },
  { id: "prod-032", name: "Tata Salt", brand: "Tata", categoryId: "cat-staples", description: "Iodised salt.", unit: "1 kg", mrp: 28, image: img.staples },
  { id: "prod-033", name: "Aashirvaad Atta", brand: "Aashirvaad", categoryId: "cat-staples", description: "Whole wheat flour.", unit: "5 kg", mrp: 275, image: img.staples },
  { id: "prod-034", name: "India Gate Basmati", brand: "India Gate", categoryId: "cat-staples", description: "Aged basmati rice.", unit: "5 kg", mrp: 620, image: img.staples },
  { id: "prod-035", name: "Toor Dal", brand: "Organic Tattva", categoryId: "cat-staples", description: "Split pigeon peas.", unit: "1 kg", mrp: 180, image: img.staples },
  { id: "prod-036", name: "Fortune Sunflower Oil", brand: "Fortune", categoryId: "cat-staples", description: "Refined sunflower oil.", unit: "1 L", mrp: 145, image: img.staples },
  { id: "prod-037", name: "Maggi 2-Minute Noodles", brand: "Maggi", categoryId: "cat-snacks", description: "Masala instant noodles.", unit: "70 g", mrp: 14, image: img.snacks },
  { id: "prod-038", name: "Kissan Mixed Fruit Jam", brand: "Kissan", categoryId: "cat-bakery", description: "Mixed fruit jam.", unit: "500 g", mrp: 155, image: img.bakery },
  { id: "prod-039", name: "Amul Cheese Cube", brand: "Amul", categoryId: "cat-dairy", description: "Processed cheese cubes.", unit: "200 g", mrp: 135, image: img.dairy },
  { id: "prod-040", name: "Mother Dairy Paneer", brand: "Mother Dairy", categoryId: "cat-dairy", description: "Fresh malai paneer.", unit: "200 g", mrp: 95, image: img.dairy },
  { id: "prod-041", name: "Orange", brand: "Fresh", categoryId: "cat-fruits", description: "Nagpur oranges.", unit: "1 kg", mrp: 90, image: img.fruit },
  { id: "prod-042", name: "Cucumber", brand: "Fresh", categoryId: "cat-fruits", description: "Salad cucumbers.", unit: "500 g", mrp: 28, image: img.veg },
  { id: "prod-043", name: "Capsicum", brand: "Fresh", categoryId: "cat-fruits", description: "Green capsicum.", unit: "500 g", mrp: 48, image: img.veg },
  { id: "prod-044", name: "Thums Up", brand: "Thums Up", categoryId: "cat-beverages", description: "Strong cola.", unit: "750 ml", mrp: 40, image: img.drinks },
  { id: "prod-045", name: "Sprite", brand: "Sprite", categoryId: "cat-beverages", description: "Lemon lime soda.", unit: "750 ml", mrp: 40, image: img.drinks },
  { id: "prod-046", name: "Dettol Handwash", brand: "Dettol", categoryId: "cat-care", description: "Skincare handwash refill.", unit: "750 ml", mrp: 99, image: img.care },
  { id: "prod-047", name: "Lizol Floor Cleaner", brand: "Lizol", categoryId: "cat-household", description: "Citrus floor cleaner.", unit: "975 ml", mrp: 199, image: img.home },
  { id: "prod-048", name: "Good Day Cashew", brand: "Britannia", categoryId: "cat-snacks", description: "Cashew cookies.", unit: "200 g", mrp: 45, image: img.snacks },
  { id: "prod-049", name: "Frozen Sweet Corn", brand: "Safal", categoryId: "cat-eggs", description: "Sweet corn kernels.", unit: "500 g", mrp: 90, image: img.frozen },
  { id: "prod-050", name: "Multigrain Bread", brand: "English Oven", categoryId: "cat-bakery", description: "High fibre loaf.", unit: "400 g", mrp: 55, image: img.bread },
  { id: "prod-051", name: "Alphonso Mango (frozen pulp)", brand: "Safal", categoryId: "cat-eggs", description: "Alphonso mango pulp.", unit: "1 kg", mrp: 220, image: img.frozen },
  { id: "prod-052", name: "Coriander", brand: "Fresh", categoryId: "cat-fruits", description: "Fresh coriander bunch.", unit: "1 bunch", mrp: 15, image: img.veg },
  { id: "prod-053", name: "Green Chilli", brand: "Fresh", categoryId: "cat-fruits", description: "Hot green chillies.", unit: "100 g", mrp: 18, image: img.veg },
  { id: "prod-054", name: "Ginger", brand: "Fresh", categoryId: "cat-fruits", description: "Fresh ginger.", unit: "200 g", mrp: 30, image: img.veg },
  { id: "prod-055", name: "Garlic", brand: "Fresh", categoryId: "cat-fruits", description: "Fresh garlic.", unit: "200 g", mrp: 32, image: img.veg },
  { id: "prod-056", name: "Amul Gold Milk", brand: "Amul", categoryId: "cat-dairy", description: "Full cream milk.", unit: "1 L", mrp: 78, image: img.milk },
  { id: "prod-057", name: "Yogurt Smoothie", brand: "Epigamia", categoryId: "cat-dairy", description: "Mango yogurt smoothie.", unit: "200 ml", mrp: 50, image: img.dairy },
  { id: "prod-058", name: "Sourdough Loaf", brand: "Baker's Lane", categoryId: "cat-bakery", description: "Artisan sourdough.", unit: "500 g", mrp: 160, image: img.bread },
  { id: "prod-059", name: "Papad", brand: "Lijjat", categoryId: "cat-snacks", description: "Urad papad.", unit: "200 g", mrp: 72, image: img.snacks },
  { id: "prod-060", name: "Red Label Tea", brand: "Brooke Bond", categoryId: "cat-beverages", description: "Strong leaf tea.", unit: "500 g", mrp: 240, image: img.drinks },
  { id: "prod-061", name: "Pears Soap", brand: "Pears", categoryId: "cat-care", description: "Transparent glycerin soap.", unit: "125 g", mrp: 68, image: img.care },
  { id: "prod-062", name: "Colin Glass Cleaner", brand: "Colin", categoryId: "cat-household", description: "Glass and household cleaner.", unit: "500 ml", mrp: 99, image: img.home },
  { id: "prod-063", name: "Moong Dal", brand: "Tata Sampann", categoryId: "cat-staples", description: "Split green gram.", unit: "1 kg", mrp: 165, image: img.staples },
  { id: "prod-064", name: "Chana Dal", brand: "Tata Sampann", categoryId: "cat-staples", description: "Split chickpeas.", unit: "1 kg", mrp: 140, image: img.staples },
  { id: "prod-065", name: "Sugar", brand: "Madhur", categoryId: "cat-staples", description: "Refined sugar.", unit: "1 kg", mrp: 48, image: img.staples },
  { id: "prod-066", name: "Besan", brand: "Fortune", categoryId: "cat-staples", description: "Gram flour.", unit: "1 kg", mrp: 110, image: img.staples },
  { id: "prod-067", name: "Peanut Butter", brand: "Pintola", categoryId: "cat-bakery", description: "Crunchy peanut butter.", unit: "350 g", mrp: 249, image: img.bakery },
  { id: "prod-068", name: "Oats", brand: "Quaker", categoryId: "cat-staples", description: "Rolled oats.", unit: "1 kg", mrp: 210, image: img.staples },
  { id: "prod-069", name: "Cornflakes", brand: "Kellogg's", categoryId: "cat-snacks", description: "Breakfast cereal.", unit: "475 g", mrp: 199, image: img.snacks },
  { id: "prod-070", name: "Ice Cream Vanilla", brand: "Amul", categoryId: "cat-eggs", description: "Vanilla tub.", unit: "1 L", mrp: 220, image: img.frozen },
];

export const catalog: CatalogProduct[] = catalogDefs.map((p) => ({ ...p, active: true }));

const shopAssortment: Record<string, string[]> = {
  "shop-01": catalog.slice(0, 40).map((p) => p.id),
  "shop-02": catalog.filter((_, i) => i % 2 === 0).map((p) => p.id),
  "shop-03": catalog.filter((p) => ["cat-fruits", "cat-dairy", "cat-eggs"].includes(p.categoryId)).map((p) => p.id),
  "shop-04": catalog.filter((p) => ["cat-staples", "cat-snacks", "cat-household"].includes(p.categoryId)).map((p) => p.id),
  "shop-05": catalog.filter((p) => ["cat-fruits", "cat-dairy", "cat-staples", "cat-care"].includes(p.categoryId)).map((p) => p.id),
  "shop-06": catalog.map((p) => p.id),
  "shop-07": catalog.slice(0, 28).map((p) => p.id),
  "shop-08": catalog.filter((p) => ["cat-bakery", "cat-dairy", "cat-beverages", "cat-snacks"].includes(p.categoryId)).map((p) => p.id),
  "shop-09": catalog.slice(0, 12).map((p) => p.id),
  "shop-10": catalog.filter((p) => p.categoryId === "cat-fruits").map((p) => p.id),
  "shop-11": catalog.slice(0, 10).map((p) => p.id),
};

function listingFor(shopId: string, productId: string, index: number): ShopListing {
  const product = catalog.find((p) => p.id === productId)!;
  const discount = index % 5 === 0 ? 0 : 3 + (index % 8);
  const price = Math.max(8, product.mrp - discount);
  let stock = 8 + ((index * 3) % 24);
  if (["prod-005", "prod-008"].includes(productId) && shopId === "shop-01") stock = productId === "prod-005" ? 3 : 2;
  const reserved = stock > 6 ? 2 : 0;
  return {
    id: `listing-${shopId}-${productId}`,
    shopId,
    productId,
    price,
    stock,
    reserved,
    status: stock === 0 ? "out_of_stock" : "active",
    lowStockThreshold: 5,
  };
}

export const listings: ShopListing[] = Object.entries(shopAssortment).flatMap(([shopId, productIds]) =>
  productIds.map((productId, index) => listingFor(shopId, productId, index)),
);

export const coupons: Coupon[] = [
  { code: "FIRST10", label: "₹10 off on first order", amount: 10, minSubtotal: 100 },
  { code: "SAVE50", label: "₹50 off above ₹499", amount: 50, minSubtotal: 499 },
];

const now = "2026-09-28T10:00:00.000Z";

function orderItemsFrom(ids: Array<[string, number]>, shopId: string): Order["items"] {
  return ids.map(([productId, quantity]) => {
    const product = catalog.find((p) => p.id === productId)!;
    const listing = listings.find((l) => l.shopId === shopId && l.productId === productId)!;
    return {
      listingId: listing.id,
      productId,
      name: product.name,
      unit: product.unit,
      quantity,
      price: listing.price,
      mrp: product.mrp,
    };
  });
}

export const orders: Order[] = [
  {
    id: "ORD-1001",
    customerId: "user-customer-1",
    shopId: "shop-01",
    items: orderItemsFrom([["prod-001", 2], ["prod-005", 1], ["prod-008", 1]], "shop-01"),
    addressId: "addr-1",
    subtotal: 240,
    deliveryFee: 20,
    discount: 10,
    platformFee: 24,
    total: 250,
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "delivered",
    createdAt: "2026-09-26T09:30:00.000Z",
    etaMinutes: 28,
    events: [
      { status: "placed", at: "2026-09-26T09:30:00.000Z", note: "Order placed" },
      { status: "payment_confirmed", at: "2026-09-26T09:32:00.000Z", note: "Payment confirmed" },
      { status: "accepted", at: "2026-09-26T09:35:00.000Z", note: "Shop accepted" },
      { status: "preparing", at: "2026-09-26T09:40:00.000Z", note: "Preparing" },
      { status: "ready", at: "2026-09-26T10:00:00.000Z", note: "Ready for pickup" },
      { status: "out_for_delivery", at: "2026-09-26T10:05:00.000Z", note: "Out for delivery" },
      { status: "delivered", at: "2026-09-26T10:25:00.000Z", note: "Delivered" },
    ],
  },
  {
    id: "ORD-1002",
    customerId: "user-customer-2",
    shopId: "shop-01",
    items: orderItemsFrom([["prod-001", 1], ["prod-003", 2]], "shop-01"),
    addressId: "addr-3",
    subtotal: 126,
    deliveryFee: 20,
    discount: 0,
    platformFee: 13,
    total: 146,
    paymentMethod: "cod",
    paymentStatus: "pending",
    status: "placed",
    createdAt: now,
    etaMinutes: 25,
    events: [{ status: "placed", at: now, note: "Order placed" }],
  },
  {
    id: "ORD-1003",
    customerId: "user-customer-1",
    shopId: "shop-02",
    items: orderItemsFrom([["prod-017", 3], ["prod-021", 2]], "shop-02"),
    addressId: "addr-1",
    subtotal: 140,
    deliveryFee: 20,
    discount: 0,
    platformFee: 14,
    total: 160,
    paymentMethod: "card",
    paymentStatus: "paid",
    status: "preparing",
    createdAt: "2026-09-28T08:40:00.000Z",
    etaMinutes: 32,
    events: [
      { status: "placed", at: "2026-09-28T08:40:00.000Z", note: "Order placed" },
      { status: "accepted", at: "2026-09-28T08:42:00.000Z", note: "Shop accepted" },
      { status: "preparing", at: "2026-09-28T08:50:00.000Z", note: "Preparing" },
    ],
  },
  {
    id: "ORD-1004",
    customerId: "user-customer-2",
    shopId: "shop-03",
    items: orderItemsFrom([["prod-011", 1], ["prod-013", 2]], "shop-03"),
    addressId: "addr-3",
    subtotal: 125,
    deliveryFee: 20,
    discount: 0,
    platformFee: 13,
    total: 145,
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "out_for_delivery",
    createdAt: "2026-09-28T09:10:00.000Z",
    etaMinutes: 18,
    events: [
      { status: "placed", at: "2026-09-28T09:10:00.000Z", note: "Order placed" },
      { status: "accepted", at: "2026-09-28T09:12:00.000Z", note: "Shop accepted" },
      { status: "preparing", at: "2026-09-28T09:15:00.000Z", note: "Preparing" },
      { status: "ready", at: "2026-09-28T09:28:00.000Z", note: "Ready" },
      { status: "out_for_delivery", at: "2026-09-28T09:32:00.000Z", note: "Out for delivery" },
    ],
  },
  {
    id: "ORD-1005",
    customerId: "user-customer-1",
    shopId: "shop-01",
    items: orderItemsFrom([["prod-033", 1], ["prod-032", 1]], "shop-01"),
    addressId: "addr-2",
    subtotal: 295,
    deliveryFee: 20,
    discount: 0,
    platformFee: 30,
    total: 315,
    paymentMethod: "upi",
    paymentStatus: "paid",
    status: "accepted",
    createdAt: "2026-09-28T09:50:00.000Z",
    etaMinutes: 30,
    events: [
      { status: "placed", at: "2026-09-28T09:50:00.000Z", note: "Order placed" },
      { status: "accepted", at: "2026-09-28T09:52:00.000Z", note: "Shop accepted" },
    ],
  },
];

export const payments: PaymentRecord[] = orders.map((order) => ({
  id: `pay-${order.id}`,
  orderId: order.id,
  shopId: order.shopId,
  customerId: order.customerId,
  amount: order.total,
  method: order.paymentMethod,
  status: order.paymentStatus,
  createdAt: order.createdAt,
}));

export const refunds: Refund[] = [
  {
    id: "ref-01",
    orderId: "ORD-1001",
    customerId: "user-customer-1",
    shopId: "shop-01",
    amount: 40,
    reason: "Missing bread item reported after delivery",
    status: "requested",
    createdAt: "2026-09-26T12:10:00.000Z",
  },
];

export const reviews: Review[] = [
  { id: "rev-01", shopId: "shop-01", productId: "prod-001", customerId: "user-customer-1", rating: 5, comment: "Always fresh and on time.", createdAt: "2026-09-26T11:00:00.000Z" },
  { id: "rev-02", shopId: "shop-02", customerId: "user-customer-2", rating: 4, comment: "Good assortment.", createdAt: "2026-09-20T11:00:00.000Z" },
];

export function createSeedStore(): AppStore {
  return {
    users: structuredClone(users),
    addresses: structuredClone(addresses),
    categories: structuredClone(categories),
    shops: structuredClone(shops),
    catalog: structuredClone(catalog),
    listings: structuredClone(listings),
    cart: { shopId: null, items: [], couponCode: null },
    selectedAddressId: "addr-1",
    coupons: structuredClone(coupons),
    orders: structuredClone(orders),
    payments: structuredClone(payments),
    refunds: structuredClone(refunds),
    reviews: structuredClone(reviews),
  };
}

export const demoAccounts = {
  customer: { email: "rahul@demo.com", password: "demo123", label: "Customer Demo" },
  merchant: { email: "merchant@freshmart.demo", password: "demo123", label: "Merchant Demo (Fresh Mart)" },
  admin: { email: "admin@quickmart.demo", password: "demo123", label: "Admin Demo" },
};
