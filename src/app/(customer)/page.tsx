"use client";

import Link from "next/link";
import { CategoryCard } from "@/components/customer/category-card";
import { ProductCard } from "@/components/customer/product-card";
import { ShopCard } from "@/components/customer/shop-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStoreSnapshot } from "@/hooks/use-async";
import { useAuth } from "@/hooks/use-auth";

export default function CustomerHomePage() {
  const store = useStoreSnapshot();
  const { user } = useAuth();
  const address = store.addresses.find((item) => item.id === store.selectedAddressId);
  const shops = store.shops.filter((shop) => shop.status === "active");
  const popularIds = ["prod-001", "prod-005", "prod-008", "prod-011", "prod-017", "prod-021", "prod-033", "prod-040"];

  if (!store.shops.length) {
    return (
      <div className="page-wrap grid gap-4 py-8 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <section className="border-b bg-[hsl(var(--brand-muted))]">
        <div className="page-wrap grid gap-8 py-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Groceries from shops around you</p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              {user ? `Good evening, ${user.name.split(" ")[0]}` : "Everything you need, in minutes."}
            </h1>
            <p className="mt-3 max-w-md text-muted-foreground">
              {address
                ? `Delivering to ${address.label} · ${address.line1}, ${address.city}`
                : "Choose a delivery address after you sign in."}
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/shops" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                Browse shops
              </Link>
              <Link href="/categories" className="rounded-full border px-5 py-2.5 text-sm font-medium">
                Shop by category
              </Link>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
            alt="Fresh produce"
            className="hidden h-72 w-full rounded-3xl object-cover shadow-card md:block"
          />
        </div>
      </section>

      <div className="page-wrap space-y-10 py-10">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold">Categories</h2>
            <Link href="/categories" className="text-sm text-primary">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {store.categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold">Nearby shops</h2>
            <Link href="/shops" className="text-sm text-primary">
              See all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shops.slice(0, 6).map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl font-semibold">Popular at Fresh Mart</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {popularIds.map((id) => {
              const product = store.catalog.find((item) => item.id === id);
              const listing = store.listings.find((item) => item.shopId === "shop-01" && item.productId === id);
              if (!product || !listing) return null;
              return <ProductCard key={id} product={product} listing={listing} />;
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
