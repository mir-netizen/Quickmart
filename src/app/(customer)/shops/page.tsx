"use client";

import { ShopCard } from "@/components/customer/shop-card";
import { EmptyState } from "@/components/shared/empty-state";
import { useStoreSnapshot } from "@/hooks/use-async";

export default function CustomerShopsPage() {
  const shops = useStoreSnapshot().shops.filter((shop) => shop.status === "active");
  return (
    <div className="page-wrap py-8">
      <h1 className="font-display text-3xl font-semibold">Nearby shops</h1>
      <p className="mt-1 text-muted-foreground">Active neighbourhood partners delivering to Bangalore.</p>
      {shops.length === 0 ? (
        <EmptyState className="mt-8" title="No shops nearby" description="Approved shops will appear here." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
