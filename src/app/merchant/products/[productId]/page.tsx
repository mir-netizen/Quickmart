"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { productService } from "@/services/product.service";
import { inventoryService } from "@/services/inventory.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { discountPercent, formatInr } from "@/lib/format";
import type { ListingStatus } from "@/types";

export default function MerchantProductEditPage({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";

  const product = store.catalog.find((p) => p.id === resolvedParams.productId);
  const listing = store.listings.find((l) => l.productId === resolvedParams.productId && l.shopId === shopId);

  const [price, setPrice] = useState(listing?.price ?? 0);
  const [stock, setStock] = useState(listing?.stock ?? 0);
  const [status, setStatus] = useState<ListingStatus>(listing?.status ?? "active");
  const [saving, setSaving] = useState(false);

  if (!product || !listing) {
    return (
      <div className="py-12">
        <ErrorState message="Product listing not found in your store catalog." />
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/merchant/products">Back to products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const category = store.categories.find((c) => c.id === product.categoryId);
  const off = discountPercent(product.mrp, price);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    setSaving(true);
    try {
      await productService.updateListing(listing!.id, {
        price,
        status,
      });
      if (stock !== listing!.stock) {
        await inventoryService.updateInventory(listing!.id, stock, "correction");
      }
      toast.success("Listing updated successfully");
      router.push("/merchant/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update listing");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/merchant/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to store products
      </Link>

      <PageHeader
        title={`Edit ${product.name}`}
        description="Update shop-specific price, physical stock, and availability status."
        crumbs={[
          { label: "Merchant", href: "/merchant" },
          { label: "Products", href: "/merchant/products" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
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
                  MRP: {formatInr(product.mrp)} {off > 0 ? `· (${off}% customer discount)` : ""}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stock">Total Physical Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
                <p className="text-[11px] text-muted-foreground">
                  Reserved in open orders: {listing.reserved} unit(s)
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Listing Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as ListingStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Visible to customers)</SelectItem>
                  <SelectItem value="disabled">Disabled (Hidden from shop)</SelectItem>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href="/merchant/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Listing"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Global Catalog Reference Card */}
        <Card className="p-6">
          <h3 className="font-display text-base font-semibold">Catalog Reference</h3>
          <p className="text-xs text-muted-foreground">Global product details managed by platform admins</p>

          <div className="mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.image} alt={product.name} className="h-44 w-full rounded-xl object-cover border" />
          </div>

          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Brand</span>
              <span className="font-medium text-foreground">{product.brand}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium text-foreground">{category?.name ?? "General"}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Unit Measurement</span>
              <span className="font-medium text-foreground">{product.unit}</span>
            </div>
            <div className="flex justify-between border-b pb-1.5">
              <span className="text-muted-foreground">Central Catalog ID</span>
              <span className="font-mono text-foreground">{product.id}</span>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </Card>
      </div>
    </div>
  );
}
