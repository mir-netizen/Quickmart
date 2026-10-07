"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { productService } from "@/services/product.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatInr } from "@/lib/format";
import type { ListingStatus } from "@/types";

export default function MerchantProductsPage() {
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const listings = store.listings.filter((l) => l.shopId === shopId);

  const filtered = listings.map((listing) => {
    const product = store.catalog.find((p) => p.id === listing.productId);
    const category = store.categories.find((c) => c.id === product?.categoryId);
    return { listing, product, category };
  }).filter(({ product, listing }) => {
    if (!product) return false;
    if (selectedCategory !== "all" && product.categoryId !== selectedCategory) return false;
    if (selectedStatus !== "all" && listing.status !== selectedStatus) return false;
    if (query) {
      const q = query.toLowerCase();
      return product.name.toLowerCase().includes(q) || product.brand.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Products"
        description="Manage your shop-specific product prices, stock levels, and active listings."
        crumbs={[{ label: "Merchant", href: "/merchant" }, { label: "Products" }]}
        actions={
          <Button asChild className="gap-2">
            <Link href="/merchant/products/new">
              <Plus className="h-4 w-4" /> Add Product to Shop
            </Link>
          </Button>
        }
      />

      <Card className="p-4">
        {/* Filters bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-44">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {store.categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-36">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No products found"
                description={
                  listings.length === 0
                    ? "You haven't added any products to your shop catalog yet."
                    : "No products matched your search filter."
                }
                action={{ label: "Add Product", href: "/merchant/products/new" }}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>MRP</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(({ listing, product, category }) => {
                  if (!product) return null;
                  const available = Math.max(0, listing.stock - listing.reserved);
                  const isLow = available <= listing.lowStockThreshold;

                  return (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={product.image}
                            alt=""
                            className="h-10 w-10 rounded-lg object-cover border"
                          />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand} · {product.unit}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {category?.name ?? "General"}
                      </TableCell>
                      <TableCell className="text-xs line-through text-muted-foreground">
                        {formatInr(product.mrp)}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {formatInr(listing.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${isLow ? "text-amber-600" : ""}`}>
                            {listing.stock}
                          </span>
                          <span className="text-[11px] text-muted-foreground">({available} avail)</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={listing.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/merchant/products/${product.id}`}>Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
