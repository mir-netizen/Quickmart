"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Plus, Search, Store } from "lucide-react";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ShopStatus } from "@/types";

export default function AdminShopsPage() {
  const store = useStoreSnapshot();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const pendingCount = store.shops.filter((s) => s.status === "pending").length;

  const shops = store.shops
    .filter((shop) => {
      if (selectedStatus === "all") return true;
      return shop.status === selectedStatus;
    })
    .filter((shop) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return shop.name.toLowerCase().includes(q) || shop.city.toLowerCase().includes(q);
    });

  const statusTabs = [
    { key: "all", label: "All Vendors" },
    { key: "active", label: "Active" },
    { key: "pending", label: `Pending Approvals (${pendingCount})` },
    { key: "suspended", label: "Suspended" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hyperlocal Shops"
        description="Comprehensive directory of neighbourhood vendors, approval workflows, and status controls."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Shops" }]}
        actions={
          pendingCount > 0 ? (
            <Button asChild className="gap-2 bg-amber-600 hover:bg-amber-700">
              <Link href="/admin/shops/pending">
                <Clock className="h-4 w-4" /> Review Pending ({pendingCount})
              </Link>
            </Button>
          ) : undefined
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <Button
                key={tab.key}
                variant={selectedStatus === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search store name or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          {shops.length === 0 ? (
            <div className="py-12">
              <EmptyState title="No shops found" description="No stores matched the chosen filter." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Store Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Radius</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.map((shop) => {
                  const owner = store.users.find((u) => u.id === shop.ownerId);
                  return (
                    <TableRow key={shop.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={shop.image} alt="" className="h-10 w-10 rounded-xl object-cover border" />
                          <div>
                            <p className="font-semibold text-sm">{shop.name}</p>
                            <p className="text-xs text-muted-foreground">{shop.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{owner?.name ?? "Merchant"}</p>
                        <p className="text-xs text-muted-foreground">{owner?.email}</p>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {shop.address}, {shop.city}
                      </TableCell>
                      <TableCell className="text-xs">
                        {shop.deliveryRadiusKm} km
                      </TableCell>
                      <TableCell className="text-sm">
                        ★ {shop.rating.toFixed(1)} ({shop.reviewCount})
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={shop.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/shops/${shop.id}`}>
                            {shop.status === "pending" ? "Review" : "Manage"}
                          </Link>
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
