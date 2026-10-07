"use client";

import { useParams, useSearchParams } from "next/navigation";
import { Clock, MapPin, Star } from "lucide-react";
import { ProductCard } from "@/components/customer/product-card";
import { ErrorState } from "@/components/shared/error-state";
import { useStoreSnapshot } from "@/hooks/use-async";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function CustomerShopDetailPage() {
  const { shopId } = useParams<{ shopId: string }>();
  const search = useSearchParams();
  const categoryId = search.get("category");
  const store = useStoreSnapshot();
  const shop = store.shops.find((item) => item.id === shopId);

  if (!shop) return <div className="page-wrap py-10"><ErrorState message="We couldn't find that shop." /></div>;

  const listings = store.listings.filter((item) => item.shopId === shop.id && item.status !== "disabled");
  const products = listings
    .map((listing) => ({ listing, product: store.catalog.find((item) => item.id === listing.productId)! }))
    .filter((item) => (categoryId ? item.product.categoryId === categoryId : true));
  const cats = store.categories.filter((category) => products.some((item) => item.product.categoryId === category.id) || !categoryId);

  return (
    <div>
      <div className="relative h-48 md:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shop.banner} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
        <div className="page-wrap absolute inset-x-0 bottom-0 pb-5 text-white">
          <h1 className="font-display text-3xl font-semibold">{shop.name}</h1>
          <p className="mt-1 flex flex-wrap gap-4 text-sm text-white/90">
            <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-current" /> {shop.rating.toFixed(1)} ({shop.reviewCount})</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {shop.etaMin}–{shop.etaMax} min</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {shop.distanceKm.toFixed(1)} km</span>
            <span>{shop.isOpen ? "Open now" : "Closed"} · {shop.hours.open}–{shop.hours.close}</span>
          </p>
        </div>
      </div>
      <div className="page-wrap py-6">
        <div className="flex gap-2 overflow-x-auto pb-4">
          <Link href={`/shops/${shop.id}`} className={cn("rounded-full border px-3 py-1.5 text-sm", !categoryId && "bg-primary text-primary-foreground")}>All</Link>
          {store.categories.map((category) => (
            <Link
              key={category.id}
              href={`/shops/${shop.id}?category=${category.id}`}
              className={cn("whitespace-nowrap rounded-full border px-3 py-1.5 text-sm", categoryId === category.id && "bg-primary text-primary-foreground")}
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map(({ listing, product }) => (
            <ProductCard key={listing.id} listing={listing} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
