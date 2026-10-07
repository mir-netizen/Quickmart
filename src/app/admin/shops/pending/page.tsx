"use client";

import Link from "next/link";
import { ArrowLeft, Clock, FileCheck, Store } from "lucide-react";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";

export default function AdminPendingShopsPage() {
  const store = useStoreSnapshot();
  const pendingShops = store.shops.filter((s) => s.status === "pending");

  return (
    <div className="space-y-6">
      <Link href="/admin/shops" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to all shops
      </Link>

      <PageHeader
        title="Pending Shop Approvals"
        description="Review incoming merchant applications, legal compliance documents, and operational boundaries before authorizing store activation."
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Shops", href: "/admin/shops" },
          { label: "Pending Approvals" },
        ]}
      />

      <Card className="p-4">
        {pendingShops.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No pending approvals"
              description="All shop applications have been reviewed and processed."
              action={{ label: "View All Shops", href: "/admin/shops" }}
            />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop</TableHead>
                <TableHead>Merchant Owner</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>KYC Documents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingShops.map((shop) => {
                const owner = store.users.find((u) => u.id === shop.ownerId);
                return (
                  <TableRow key={shop.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={shop.image} alt="" className="h-11 w-11 rounded-xl object-cover border" />
                        <div>
                          <p className="font-semibold text-sm">{shop.name}</p>
                          <p className="text-xs text-muted-foreground">{shop.address}, {shop.city}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{owner?.name ?? "Merchant"}</p>
                      <p className="text-xs text-muted-foreground">{owner?.email} · {owner?.phone}</p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDateTime(shop.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <FileCheck className="h-4 w-4 text-primary" />
                        <span>{shop.documents.length} Submitted Documents</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={shop.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" asChild>
                        <Link href={`/admin/shops/${shop.id}`}>Review & Approve</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
