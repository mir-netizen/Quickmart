import Link from "next/link";
import type { Category } from "@/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="group overflow-hidden rounded-2xl border bg-card shadow-card"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={category.image} alt="" className="h-24 w-full object-cover transition group-hover:scale-[1.03]" />
      <p className="px-3 py-3 text-sm font-medium">{category.name}</p>
    </Link>
  );
}
