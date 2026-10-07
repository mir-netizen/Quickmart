"use client";

import Link from "next/link";
import { User, ShoppingBag, MapPin, Settings, LogOut, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { ProfileNav } from "@/components/shared/address-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate, formatInr } from "@/lib/format";

export default function CustomerProfilePage() {
  const { user, logout } = useAuth();
  const store = useStoreSnapshot();

  if (!user) {
    return (
      <div className="page-wrap py-12">
        <EmptyState
          title="Sign in to view your profile"
          description="Access your orders, saved addresses, and preferences."
          action={{ label: "Sign In", href: "/login" }}
        />
      </div>
    );
  }

  const userOrders = store.orders.filter((order) => order.customerId === user.id);
  const addresses = store.addresses.filter((addr) => addr.userId === user.id);
  const defaultAddress = addresses.find((addr) => addr.isDefault) ?? addresses[0];

  return (
    <div className="page-wrap py-8">
      <h1 className="font-display text-3xl font-semibold">My Account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your personal details, addresses, and order history.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="rounded-2xl border bg-card p-4 shadow-card">
            <ProfileNav />
          </div>
        </aside>

        <div className="space-y-6">
          {/* User Profile Card */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground">
                  {user.avatarInitials}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-semibold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email} · {user.phone}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-muted px-2.5 py-0.5 text-xs font-medium text-primary">
                      <ShieldCheck className="h-3.5 w-3.5" /> Customer Account
                    </span>
                    <span className="text-xs text-muted-foreground">Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => void logout()} className="gap-2 text-destructive hover:bg-destructive/10">
                <LogOut className="h-4 w-4" /> Log out
              </Button>
            </div>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Orders</p>
                  <p className="mt-1 font-display text-3xl font-semibold">{userOrders.length}</p>
                </div>
                <div className="rounded-xl bg-brand-muted p-3 text-primary">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/orders" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View order history <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Saved Addresses</p>
                  <p className="mt-1 font-display text-3xl font-semibold">{addresses.length}</p>
                </div>
                <div className="rounded-xl bg-brand-muted p-3 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/profile/addresses" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  Manage addresses <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          </div>

          {/* Recent Orders Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Recent Orders</h3>
                <p className="text-xs text-muted-foreground">Track or reorder past purchases</p>
              </div>
              {userOrders.length > 0 && (
                <Link href="/orders" className="text-xs font-medium text-primary hover:underline">
                  See all
                </Link>
              )}
            </div>

            {userOrders.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">You haven't placed any orders yet.</p>
            ) : (
              <div className="mt-4 divide-y">
                {userOrders.slice(0, 3).map((order) => {
                  const shop = store.shops.find((s) => s.id === order.shopId);
                  return (
                    <div key={order.id} className="flex items-center justify-between py-3">
                      <div>
                        <Link href={`/orders/${order.id}`} className="font-medium hover:text-primary">
                          {order.id} · {shop?.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} items · {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">{formatInr(order.total)}</span>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Default Address Preview */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Default Address</h3>
              <Link href="/profile/addresses" className="text-xs font-medium text-primary hover:underline">
                Change
              </Link>
            </div>
            {defaultAddress ? (
              <div className="mt-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{defaultAddress.label}</p>
                <p>{defaultAddress.line1}{defaultAddress.line2 ? `, ${defaultAddress.line2}` : ""}</p>
                <p>{defaultAddress.city} - {defaultAddress.pincode}</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No address saved yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
