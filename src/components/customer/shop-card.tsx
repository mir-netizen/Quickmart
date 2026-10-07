import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Shop } from "@/types";

export function ShopCard({ shop }: { shop: Shop }) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={shop.banner} alt="" className="h-36 w-full object-cover" />
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold">{shop.name}</h3>
          <Badge variant="success" className="gap-1">
            <Star className="h-3 w-3 fill-current" /> {shop.rating.toFixed(1)}
          </Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{shop.description}</p>
        <p className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {shop.distanceKm.toFixed(1)} km
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {shop.etaMin}–{shop.etaMax} min
          </span>
          <span>{shop.isOpen ? "Open now" : "Closed"}</span>
        </p>
        <Link href={`/shops/${shop.id}`} className="inline-flex text-sm font-medium text-primary">
          View shop
        </Link>
      </div>
    </article>
  );
}
