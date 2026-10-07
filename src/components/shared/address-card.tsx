import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Address } from "@/types";

export function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onDefault,
}: {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDefault?: () => void;
}) {
  return (
    <article className={`rounded-2xl border bg-card p-4 shadow-card ${selected ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{address.label}</p>
            {address.isDefault ? <Badge variant="success">Default</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {address.line1}
            {address.line2 ? `, ${address.line2}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            {address.city} {address.pincode}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {onSelect ? (
          <Button size="sm" variant={selected ? "secondary" : "outline"} onClick={onSelect}>
            Deliver here
          </Button>
        ) : null}
        {onDefault && !address.isDefault ? (
          <Button size="sm" variant="outline" onClick={onDefault}>
            Set default
          </Button>
        ) : null}
        {onEdit ? (
          <Button size="sm" variant="ghost" onClick={onEdit}>
            Edit
          </Button>
        ) : null}
        {onDelete ? (
          <Button size="sm" variant="ghost" onClick={onDelete}>
            Delete
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export function AddressFormFields() {
  return null;
}

export function ProfileNav() {
  const links = [
    { href: "/profile", label: "Profile" },
    { href: "/orders", label: "Orders" },
    { href: "/profile/addresses", label: "Addresses" },
    { href: "/profile/settings", label: "Settings" },
  ];
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm hover:bg-muted">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
