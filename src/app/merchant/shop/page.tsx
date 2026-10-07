"use client";

import Link from "next/link";
import { Edit, Clock, MapPin, Phone, Star, ShieldCheck, Truck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MerchantShopProfilePage() {
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const shopId = user?.shopId ?? "shop-01";
  const shop = store.shops.find((s) => s.id === shopId);

  if (!shop) {
    return <div className="p-8">Shop profile not found.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={shop.name}
        description="Public storefront information displayed to customers in the hyperlocal app."
        crumbs={[{ label: "Merchant", href: "/merchant" }, { label: "Shop Profile" }]}
        actions={
          <Button asChild className="gap-2">
            <Link href="/merchant/shop/edit">
              <Edit className="h-4 w-4" /> Edit Shop Profile
            </Link>
          </Button>
        }
      />

      {/* Banner & Header */}
      <div className="relative h-56 overflow-hidden rounded-3xl border shadow-card md:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shop.banner} alt={shop.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shop.image} alt="" className="h-20 w-20 rounded-2xl border-2 border-white object-cover shadow-lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold md:text-3xl">{shop.name}</h1>
                <StatusBadge status={shop.status} />
              </div>
              <p className="mt-1 flex items-center gap-3 text-xs text-white/90">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {shop.rating.toFixed(1)} ({shop.reviewCount} customer reviews)
                </span>
                <span>·</span>
                <span>{shop.isOpen ? "🟢 Open now" : "🔴 Closed"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Details Card */}
        <Card className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Store Information</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{shop.description}</p>

          <div className="space-y-3 pt-3 border-t text-sm">
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Direct Phone</p>
                <p className="text-muted-foreground">{shop.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Store Location</p>
                <p className="text-muted-foreground">{shop.address}, {shop.city} - {shop.pincode}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Operational & Delivery Settings */}
        <Card className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Operational Parameters</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Daily Operating Hours</p>
                <p className="text-muted-foreground">{shop.hours.open} AM – {shop.hours.close} PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Hyperlocal Delivery Radius</p>
                <p className="text-muted-foreground">{shop.deliveryRadiusKm} km around shop location</p>
                <p className="text-xs text-muted-foreground mt-0.5">Average delivery ETA: {shop.etaMin}–{shop.etaMax} minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Verified Merchant Documents</p>
                <p className="text-muted-foreground">
                  {shop.documents.map((d) => `${d.name} (${d.status})`).join(", ")}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
