"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, ShieldCheck, ShoppingBag, Store, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useStoreSnapshot } from "@/hooks/use-async";
import { adminService } from "@/services/admin.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatDateTime, formatInr } from "@/lib/format";
import type { AccountStatus } from "@/types";

export default function AdminUserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params);
  const store = useStoreSnapshot();
  const [updating, setUpdating] = useState(false);

  const user = store.users.find((u) => u.id === resolvedParams.userId);
  if (!user) {
    return (
      <div className="py-12">
        <ErrorState message="User account not found." />
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/admin/users">Back to users</Link>
          </Button>
        </div>
      </div>
    );
  }

  const addresses = store.addresses.filter((a) => a.userId === user.id);
  const orders = store.orders.filter((o) => o.customerId === user.id);
  const shop = user.shopId ? store.shops.find((s) => s.id === user.shopId) : null;

  async function handleToggleStatus() {
    setUpdating(true);
    const next: AccountStatus = user!.status === "active" ? "suspended" : "active";
    try {
      await adminService.updateUser(user!.id, { status: next });
      toast.success(`User account is now ${next}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update account");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to users list
      </Link>

      <PageHeader
        title={user.name}
        description={`Account ID: ${user.id} · Registered ${formatDate(user.createdAt)}`}
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Users", href: "/admin/users" },
          { label: user.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={user.status} />
            <Button
              variant={user.status === "active" ? "destructive" : "default"}
              size="sm"
              disabled={updating}
              onClick={handleToggleStatus}
            >
              {user.status === "active" ? "Suspend Account" : "Reactivate Account"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Info */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-bold text-primary">
              {user.avatarInitials}
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground">{user.phone}</p>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Assigned Role</span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Account Status</span>
              <span className="capitalize font-semibold">{user.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member Since</span>
              <span className="text-foreground">{formatDate(user.createdAt)}</span>
            </div>
          </div>

          {shop && (
            <div className="mt-4 rounded-xl border bg-muted/30 p-3.5 flex items-center gap-3">
              <Store className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Assigned Shopkeeper Store:</p>
                <Link href={`/admin/shops/${shop.id}`} className="font-semibold text-sm hover:underline">
                  {shop.name} ({shop.id})
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* Saved Addresses (if any) */}
        <Card className="p-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-display text-base font-semibold">Saved Locations ({addresses.length})</h3>
          </div>

          {addresses.length === 0 ? (
            <p className="py-6 text-xs text-muted-foreground">No delivery addresses on file.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="rounded-xl border p-3 text-xs space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">{addr.label}</span>
                    {addr.isDefault && <span className="text-emerald-700 font-medium">Default</span>}
                  </div>
                  <p className="text-muted-foreground">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                  <p className="text-muted-foreground">{addr.city} {addr.pincode}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Orders Placed */}
      <Card className="p-6">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h3 className="font-display text-base font-semibold">Order History ({orders.length})</h3>
          </div>
        </div>

        {orders.length === 0 ? (
          <p className="py-6 text-xs text-muted-foreground">This user has not placed any orders yet.</p>
        ) : (
          <div className="mt-4 divide-y">
            {orders.map((order) => {
              const orderShop = store.shops.find((s) => s.id === order.shopId);
              return (
                <div key={order.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-semibold hover:underline">
                      {order.id}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {orderShop?.name} · {order.items.length} items · {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sm">{formatInr(order.total)}</span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
