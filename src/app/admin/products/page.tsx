"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Tag, ExternalLink } from "lucide-react";
import { toast } from "sonner";
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

export default function AdminProductsPage() {
  const store = useStoreSnapshot();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const catalog = store.catalog
    .filter((p) => {
      if (selectedCategory !== "all" && p.categoryId !== selectedCategory) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    });

  async function handleToggleActive(productId: string, current: boolean) {
    try {
      await productService.updateCatalogProduct(productId, { active: !current });
      toast.success(`Product ${!current ? "activated" : "disabled"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Global Product Catalog"
        description="Master catalog repository from which individual neighbourhood merchants select and stock inventory."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Products" }]}
        actions={
          <Button asChild className="gap-2">
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4" /> Add Catalog Product
            </Link>
          </Button>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search catalog products..."
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="w-52">
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
        </div>

        <div className="mt-6">
          {catalog.length === 0 ? (
            <div className="py-12">
              <EmptyState title="No catalog products found" description="Try a different category or search term." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Catalog Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Maximum Retail Price (MRP)</TableHead>
                  <TableHead>Store Adoption</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalog.map((product) => {
                  const category = store.categories.find((c) => c.id === product.categoryId);
                  const storeCount = store.listings.filter((l) => l.productId === product.id).length;

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.image} alt="" className="h-11 w-11 rounded-xl object-cover border" />
                          <div>
                            <p className="font-semibold text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.brand} · {product.unit}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {category?.name ?? "General"}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {formatInr(product.mrp)}
                      </TableCell>
                      <TableCell className="text-xs">
                        <span className="font-medium text-foreground">{storeCount}</span> active shops
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.active ? "bg-emerald-100 text-emerald-800" : "bg-muted text-muted-foreground"
                        }`}>
                          {product.active ? "Active" : "Disabled"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/products/${product.id}`}>Edit</Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(product.id, product.active)}
                          >
                            {product.active ? "Disable" : "Enable"}
                          </Button>
                        </div>
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
