"use client";

import { useState } from "react";
import { AlertTriangle, Boxes, CheckCircle2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { inventoryService } from "@/services/inventory.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InventoryReason, ShopListing, CatalogProduct } from "@/types";

export default function MerchantInventoryPage() {
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";

  const [search, setSearch] = useState("");
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);
  const [selectedListing, setSelectedListing] = useState<{ listing: ShopListing; product: CatalogProduct } | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [reason, setReason] = useState<InventoryReason>("physical_stock_update");
  const [updating, setUpdating] = useState(false);

  const listings = store.listings.filter((l) => l.shopId === shopId);

  const inventoryRows = listings.map((listing) => {
    const product = store.catalog.find((p) => p.id === listing.productId)!;
    const available = Math.max(0, listing.stock - listing.reserved);
    const isLow = available <= listing.lowStockThreshold;
    return { listing, product, available, isLow };
  }).filter(({ product, isLow }) => {
    if (!product) return false;
    if (filterLowStockOnly && !isLow) return false;
    if (search) {
      const q = search.toLowerCase();
      return product.name.toLowerCase().includes(q) || product.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const lowStockCount = listings.filter((l) => l.stock - l.reserved <= l.lowStockThreshold).length;

  function openUpdateModal(listing: ShopListing, product: CatalogProduct) {
    setSelectedListing({ listing, product });
    setNewQuantity(listing.stock);
    setReason("physical_stock_update");
  }

  async function handleUpdateStock() {
    if (!selectedListing) return;
    if (newQuantity < 0) {
      toast.error("Stock quantity cannot be negative");
      return;
    }

    setUpdating(true);
    try {
      await inventoryService.updateInventory(selectedListing.listing.id, newQuantity, reason);
      toast.success(`Inventory for ${selectedListing.product.name} updated to ${newQuantity}`);
      setSelectedListing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update inventory");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory & Stock Management"
        description="Monitor physical stock counts, fulfill reserved orders, and record stock adjustment audits."
        crumbs={[{ label: "Merchant", href: "/merchant" }, { label: "Inventory" }]}
      />

      {/* Low Stock Warning Banner if any */}
      {lowStockCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-200 p-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Low Stock Alert</p>
              <p className="text-xs text-amber-800">
                You have <strong>{lowStockCount} product(s)</strong> at or below your safety threshold. Re-order supplies to prevent order cancellations.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 bg-white hover:bg-amber-100"
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
          >
            {filterLowStockOnly ? "Show All Items" : "Filter Low Stock"}
          </Button>
        </div>
      )}

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={filterLowStockOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            >
              Low Stock Only ({lowStockCount})
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {inventoryRows.length === 0 ? (
            <div className="py-12">
              <EmptyState
                title="No inventory rows found"
                description={
                  filterLowStockOnly
                    ? "Great news! None of your items are currently low on stock."
                    : "No products matched your search filter."
                }
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Current Physical Stock</TableHead>
                  <TableHead>Reserved in Orders</TableHead>
                  <TableHead>Net Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryRows.map(({ listing, product, available, isLow }) => (
                  <TableRow key={listing.id} className={isLow ? "bg-amber-50/40" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={product.image} alt="" className="h-10 w-10 rounded-lg object-cover border" />
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.brand} · {product.unit}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {listing.stock} units
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {listing.reserved} units
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold text-sm ${isLow ? "text-amber-700" : "text-emerald-700"}`}>
                        {available} units
                      </span>
                      {isLow && (
                        <span className="block text-[10px] text-amber-600 font-medium uppercase tracking-wide">
                          Low Stock
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={listing.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openUpdateModal(listing, product)}
                      >
                        Update Stock
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      {/* Stock Adjustment Modal */}
      <Dialog open={Boolean(selectedListing)} onOpenChange={(open) => !open && setSelectedListing(null)}>
        {selectedListing && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Update Inventory</DialogTitle>
              <DialogDescription>
                Adjust physical stock count and record the reason for this inventory change.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="rounded-xl border bg-muted/40 p-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedListing.product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <div>
                  <p className="font-medium text-sm">{selectedListing.product.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Current Physical Stock: <strong className="text-foreground">{selectedListing.listing.stock} units</strong>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Reserved in open orders: {selectedListing.listing.reserved} units
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newQty">New Physical Stock Quantity</Label>
                <Input
                  id="newQty"
                  type="number"
                  min="0"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Reason for Adjustment</Label>
                <Select value={reason} onValueChange={(val) => setReason(val as InventoryReason)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical_stock_update">Physical stock count update</SelectItem>
                    <SelectItem value="received_supply">Received fresh shipment / supply</SelectItem>
                    <SelectItem value="damage">Damaged stock deduction</SelectItem>
                    <SelectItem value="expiry">Expired goods disposal</SelectItem>
                    <SelectItem value="correction">Count discrepancy correction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button variant="outline" onClick={() => setSelectedListing(null)}>
                  Cancel
                </Button>
                <Button disabled={updating} onClick={handleUpdateStock}>
                  {updating ? "Updating..." : "Update Stock"}
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
