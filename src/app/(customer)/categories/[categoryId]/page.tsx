"use client";

import { useParams } from "next/navigation";
import { ProductCard } from "@/components/customer/product-card";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { useStoreSnapshot } from "@/hooks/use-async";

export default function CustomerCategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const store = useStoreSnapshot();
  const category = store.categories.find((item) => item.id === categoryId || item.slug === categoryId);
  if (!category) return <div className="page-wrap py-10"><ErrorState message="We couldn't find that category." /></div>;

  const items = store.listings
    .filter((listing) => store.shops.find((shop) => shop.id === listing.shopId)?.status === "active")
    .map((listing) => ({ listing, product: store.catalog.find((p) => p.id === listing.productId)! }))
    .filter((item) => item.product.categoryId === category.id)
    .filter((item, index, arr) => arr.findIndex((row) => row.product.id === item.product.id) === index);

  return (
    <div className="page-wrap py-8">
      <h1 className="font-display text-3xl font-semibold">{category.name}</h1>
      <p className="mt-1 text-muted-foreground">{category.description}</p>
      {items.length === 0 ? (
        <EmptyState className="mt-8" title="Nothing here yet" description="Products in this category will appear as shops list them." action={{ label: "Browse shops", href: "/shops" }} />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map(({ listing, product }) => (
            <ProductCard key={listing.id} listing={listing} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
