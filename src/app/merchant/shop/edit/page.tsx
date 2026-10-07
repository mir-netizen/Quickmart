"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { shopService } from "@/services/shop.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const shopSchema = z.object({
  name: z.string().min(2, "Store name is required"),
  description: z.string().min(10, "Please provide a detailed description"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit pincode"),
  openHour: z.string().min(1, "Open time required"),
  closeHour: z.string().min(1, "Close time required"),
  deliveryRadiusKm: z.number().min(1, "Radius must be at least 1km").max(25),
  isOpen: z.boolean().default(true),
});

type ShopFormData = z.infer<typeof shopSchema>;

export default function MerchantShopEditPage() {
  const router = useRouter();
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";
  const shop = store.shops.find((s) => s.id === shopId);

  const form = useForm<ShopFormData>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      name: shop?.name ?? "",
      description: shop?.description ?? "",
      phone: shop?.phone ?? "",
      address: shop?.address ?? "",
      city: shop?.city ?? "Bangalore",
      pincode: shop?.pincode ?? "560034",
      openHour: shop?.hours.open ?? "07:00",
      closeHour: shop?.hours.close ?? "22:00",
      deliveryRadiusKm: shop?.deliveryRadiusKm ?? 4,
      isOpen: shop?.isOpen ?? true,
    },
  });

  if (!shop) {
    return <div className="p-8">Shop not found.</div>;
  }

  async function onSubmit(data: ShopFormData) {
    try {
      await shopService.updateShop(shop!.id, {
        name: data.name,
        description: data.description,
        phone: data.phone,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        deliveryRadiusKm: data.deliveryRadiusKm,
        isOpen: data.isOpen,
        hours: {
          open: data.openHour,
          close: data.closeHour,
        },
      });
      toast.success("Shop profile updated successfully");
      router.push("/merchant/shop");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update shop");
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/merchant/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to shop profile
      </Link>

      <PageHeader
        title="Edit Store Profile"
        description="Update your store contact information, operating schedule, and delivery boundary."
        crumbs={[
          { label: "Merchant", href: "/merchant" },
          { label: "Shop Profile", href: "/merchant/shop" },
          { label: "Edit" },
        ]}
      />

      <Card className="p-6 max-w-3xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold border-b pb-2">Store Basics</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Store Display Name</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Contact Phone</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Store Description</Label>
              <Textarea id="description" rows={3} {...form.register("description")} />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold border-b pb-2">Store Location</h3>

            <div className="space-y-1.5">
              <Label htmlFor="address">Physical Street Address</Label>
              <Input id="address" {...form.register("address")} />
              {form.formState.errors.address && (
                <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("city")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" {...form.register("pincode")} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-base font-semibold border-b pb-2">Operations & Delivery</h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="openHour">Opening Time</Label>
                <Input id="openHour" placeholder="07:00" {...form.register("openHour")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="closeHour">Closing Time</Label>
                <Input id="closeHour" placeholder="22:00" {...form.register("closeHour")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deliveryRadiusKm">Delivery Radius (km)</Label>
                <Input
                  id="deliveryRadiusKm"
                  type="number"
                  min="1"
                  max="25"
                  {...form.register("deliveryRadiusKm", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isOpen"
                className="h-4 w-4 rounded border-gray-300 text-primary"
                {...form.register("isOpen")}
              />
              <Label htmlFor="isOpen" className="text-sm font-normal cursor-pointer">
                Store is currently accepting online orders (Open for delivery)
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" asChild>
              <Link href="/merchant/shop">Cancel</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {form.formState.isSubmitting ? "Saving..." : "Save Store Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
