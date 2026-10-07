"use client";

import { RotateCcw, Store, UserCheck, Bell, ShieldCheck } from "lucide-react";
import { useAuth, useResetDemo } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function MerchantSettingsPage() {
  const { user } = useAuth();
  const resetDemo = useResetDemo();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";
  const shop = store.shops.find((s) => s.id === shopId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Settings"
        description="Manage merchant operator account, notifications, and simulation controls."
        crumbs={[{ label: "Merchant", href: "/merchant" }, { label: "Settings" }]}
      />

      <div className="grid gap-6 max-w-3xl">
        {/* Merchant Operator Profile */}
        <Card className="p-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="rounded-xl bg-muted p-2.5 text-primary">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold">Operator Account</h2>
              <p className="text-xs text-muted-foreground">Authorized shopkeeper credentials for {shop?.name}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Merchant Name</Label>
              <Input value={user?.name ?? ""} disabled className="bg-muted opacity-80" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user?.email ?? ""} disabled className="bg-muted opacity-80" />
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={user?.phone ?? ""} disabled className="bg-muted opacity-80" />
            </div>
            <div className="space-y-1.5">
              <Label>Assigned Shop ID</Label>
              <Input value={shopId} disabled className="bg-muted opacity-80 font-mono" />
            </div>
          </div>
        </Card>

        {/* Operational Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="rounded-xl bg-muted p-2.5 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold">Notification Preferences</h2>
              <p className="text-xs text-muted-foreground">In-app and SMS order notification alerts</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
              <span>Play audible chime when a new customer order is placed</span>
            </label>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
              <span>Send WhatsApp alert when stock drops below threshold</span>
            </label>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-primary" />
              <span>Daily settlement summary report via email</span>
            </label>
          </div>
        </Card>

        {/* Simulation / Demo Reset */}
        <Card className="p-6 border-destructive/20">
          <h2 className="font-display text-base font-semibold text-destructive">Demo State Controls</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Reset simulated orders, stock adjustments, and shop listings back to initial seed data.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={resetDemo} className="gap-2 text-destructive hover:bg-destructive/10">
              <RotateCcw className="h-4 w-4" /> Reset Demo State
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
