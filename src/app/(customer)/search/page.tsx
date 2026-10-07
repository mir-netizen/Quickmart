"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/customer/product-card";
import { ShopCard } from "@/components/customer/shop-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useStoreSnapshot } from "@/hooks/use-async";
import { Suspense } from "react";

function SearchResults() {
  const q = (useSearchParams().get("q") ?? "").toLowerCase();
  const store = useStoreSnapshot();
  const shops = store.shops.filter((shop) => shop.status === "active" && shop.name.toLowerCase().includes(q));
  const products = store.listings
    .filter((listing) => store.shops.find((shop) => shop.id === listing.shopId)?.status === "active")
    .map((listing) => ({ listing, product: store.catalog.find((p) => p.id === listing.productId)! }))
    .filter((item) => `${item.product.name} ${item.product.brand}`.toLowerCase().includes(q))
    .filter((item, i, arr) => arr.findIndex((row) => row.listing.id === item.listing.id) === i)
    .slice(0, 24);

  if (!q) {
    return <EmptyState title="Search QuickMart" description="Try milk, bread, or a shop name." />;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-xl font-semibold">Shops</h2>
        {shops.length ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
          </div>
        ) : <p className="mt-2 text-sm text-muted-foreground">No shops matched.</p>}
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold">Products</h2>
        {products.length ? (
          <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
            {products.map(({ listing, product }) => <ProductCard key={listing.id} listing={listing} product={product} />)}
          </div>
        ) : <p className="mt-2 text-sm text-muted-foreground">No products matched.</p>}
      </section>
    </div>
  );
}

export default function CustomerSearchPage() {
  const q = "";
  return (
    <div className="page-wrap py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold">Search</h1>
      <Suspense>
        <SearchInner />
      </Suspense>
    </div>
  );
}

function SearchInner() {
  const q = useSearchParams().get("q") ?? "";
  return (
    <>
      <p className="mb-6 text-muted-foreground">{q ? `Results for “${q}”` : "Type a query in the header search."}</p>
      <SearchResults />
    </>
  );
}
