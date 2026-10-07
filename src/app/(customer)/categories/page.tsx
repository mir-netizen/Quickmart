"use client";

import { CategoryCard } from "@/components/customer/category-card";
import { useStoreSnapshot } from "@/hooks/use-async";

export default function CustomerCategoriesPage() {
  const categories = useStoreSnapshot().categories;
  return (
    <div className="page-wrap py-8">
      <h1 className="font-display text-3xl font-semibold">Categories</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
