"use client";

import { useState } from "react";
import { RotateCcw, ShieldCheck, Sliders, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth, useResetDemo } from "@/hooks/use-auth";
import { PageHeader } from "@/components/ops/ops-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const resetDemo = useResetDemo();

  const [platformFee, setPlatformFee] = useState(8);
  const [deliveryFee, setDeliveryFee] = useState(20);
  const [threshold, setThreshold] = useState(5);
  const [saving, setSaving] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaving(false);
    toast.success("Platform operational parameters updated");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform Configuration"
        description="Global commission margins, delivery baseline fees, inventory safety thresholds, and demo environment control."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
      />

      <div className="grid gap-6 max-w-3xl">
        {/* Administrator Identity */}
        <Card className="p-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="rounded-xl bg-muted p-2.5 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold">Active Super Administrator</h2>
              <p className="text-xs text-muted-foreground">Highest privilege operations credential</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Admin Name</Label>
              <Input value={user?.name ?? "Katty Kay"} disabled className="bg-muted opacity-80" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user?.email ?? "admin@quickmart.demo"} disabled className="bg-muted opacity-80" />
            </div>
          </div>
        </Card>

        {/* Global Hyperlocal Parameters */}
        <Card className="p-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="rounded-xl bg-muted p-2.5 text-primary">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold">Global Commission & Delivery Rules</h2>
              <p className="text-xs text-muted-foreground">Default rules applied to order processing & vendor payouts</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="platformFee">Platform Commission (%)</Label>
                <Input
                  id="platformFee"
                  type="number"
                  min="0"
                  max="50"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deliveryFee">Flat Delivery Fee (₹)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  min="0"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="threshold">Low Stock Warning Threshold</Label>
                <Input
                  id="threshold"
                  type="number"
                  min="1"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Configuration"}
              </Button>
            </div>
          </form>
        </Card>

        {/* System Simulation & Reset */}
        <Card className="p-6 border-destructive/20">
          <h2 className="font-display text-base font-semibold text-destructive">Platform Demo State Reset</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Clear all local state changes, restore seed shops (including pending approval states), demo orders, and original inventory numbers across all 3 portals.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={resetDemo} className="gap-2 text-destructive hover:bg-destructive/10">
              <RotateCcw className="h-4 w-4" /> Reset Complete Platform Demo Store
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
