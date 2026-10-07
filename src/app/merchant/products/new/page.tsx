"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { productService } from "@/services/product.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatInr } from "@/lib/format";
import type { CatalogProduct } from "@/types";

export default function MerchantAddProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";

  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(20);
  const [submitting, setSubmitting] = useState(false);

  // Shop already listed product IDs
  const existingProductIds = new Set(
    store.listings.filter((l) => l.shopId === shopId).map((l) => l.productId)
  );

  // Available catalog products not yet listed in this shop
  const unlistedProducts = store.catalog
    .filter((p) => p.active)
    .filter((p) => !existingProductIds.has(p.id))
    .filter((p) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    });

  function handleSelect(product: CatalogProduct) {
    setSelectedProduct(product);
    setPrice(product.mrp); // default to MRP
    setStock(20);
  }

  async function handleAdd() {
    if (!selectedProduct) return;
    if (price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    if (stock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    setSubmitting(true);
    try {
      await productService.addProductToShop({
        shopId,
        productId: selectedProduct.id,
        price,
        stock,
      });
      toast.success(`${selectedProduct.name} added to your store`);
      setSelectedProduct(null);
      router.push("/merchant/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/merchant/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to store products
      </Link>

      <PageHeader
        title="Add Products to Store"
        description="Select verified products from the Global Catalog, customize your selling price and available stock."
        crumbs={[
          { label: "Merchant", href: "/merchant" },
          { label: "Products", href: "/merchant/products" },
          { label: "Add New" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search catalog by name or brand..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{unlistedProducts.length}</span> unlisted catalog items
        </p>
      </div>

      {unlistedProducts.length === 0 ? (
        <Card className="py-12">
          <EmptyState
            title="All catalog products added"
            description="Your store already lists every item available in the central catalog, or no items matched your query."
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {unlistedProducts.map((product) => {
            const category = store.categories.find((c) => c.id === product.categoryId);
            return (
              <Card key={product.id} className="flex flex-col overflow-hidden shadow-card">
                <div className="relative h-40 bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  <span className="absolute top-2 left-2 rounded-full bg-background/80 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">
                    {category?.name ?? "General"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.unit}</p>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">MRP</span>
                    <span className="font-semibold text-sm">{formatInr(product.mrp)}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <Button className="w-full gap-1" size="sm" onClick={() => handleSelect(product)}>
                      <Plus className="h-4 w-4" /> Add to Store
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pricing & Stock Configuration Modal */}
      <Dialog open={Boolean(selectedProduct)} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        {selectedProduct && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add {selectedProduct.name}</DialogTitle>
              <DialogDescription>
                Set your shop selling price and starting stock inventory.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-3">
              <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedProduct.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div>
                  <p className="font-medium text-sm">{selectedProduct.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedProduct.brand} · {selectedProduct.unit} · MRP {formatInr(selectedProduct.mrp)}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="price">Your Selling Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
                <p className="text-[11px] text-muted-foreground">
                  MRP is ₹{selectedProduct.mrp}. Offer a competitive discount to attract customers.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stock">Initial Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  min="1"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                  Cancel
                </Button>
                <Button disabled={submitting} onClick={handleAdd}>
                  {submitting ? "Adding..." : "Confirm & List in Store"}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
