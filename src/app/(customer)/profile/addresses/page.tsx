"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useStoreSnapshot } from "@/hooks/use-async";
import { userService } from "@/services/user.service";
import { ProfileNav, AddressCard } from "@/components/shared/address-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Address, AddressLabel } from "@/types";

const addressSchema = z.object({
  label: z.enum(["Home", "Office", "Other"]),
  line1: z.string().min(5, "Address must be at least 5 characters"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit pincode"),
  isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function CustomerAddressesPage() {
  const { user } = useAuth();
  const store = useStoreSnapshot();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: "Home",
      line1: "",
      line2: "",
      city: "Bangalore",
      pincode: "560001",
      isDefault: false,
    },
  });

  if (!user) {
    return (
      <div className="page-wrap py-12">
        <EmptyState
          title="Sign in to view your addresses"
          description="Manage your saved delivery locations."
          action={{ label: "Sign In", href: "/login" }}
        />
      </div>
    );
  }

  const addresses = store.addresses.filter((addr) => addr.userId === user.id);

  function openAddModal() {
    setEditingAddress(null);
    form.reset({
      label: "Home",
      line1: "",
      line2: "",
      city: "Bangalore",
      pincode: "560001",
      isDefault: addresses.length === 0,
    });
    setModalOpen(true);
  }

  function openEditModal(addr: Address) {
    setEditingAddress(addr);
    form.reset({
      label: addr.label,
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setModalOpen(true);
  }

  async function onSubmit(data: AddressFormData) {
    try {
      await userService.saveAddress({
        ...(editingAddress ? { id: editingAddress.id } : {}),
        userId: user!.id,
        label: data.label,
        line1: data.line1,
        line2: data.line2 || undefined,
        city: data.city,
        pincode: data.pincode,
        isDefault: data.isDefault,
      });
      toast.success(editingAddress ? "Address updated" : "Address added");
      setModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save address");
    }
  }

  async function handleDelete(id: string) {
    try {
      await userService.deleteAddress(id);
      toast.success("Address deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete address");
    }
  }

  async function handleSetDefault(addr: Address) {
    try {
      await userService.saveAddress({ ...addr, isDefault: true });
      userService.setSelectedAddressId(addr.id);
      toast.success(`Default address set to ${addr.label}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to set default address");
    }
  }

  return (
    <div className="page-wrap py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Delivery Addresses</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your home, work, and other delivery locations.</p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="rounded-2xl border bg-card p-4 shadow-card">
            <ProfileNav />
          </div>
        </aside>

        <div>
          {addresses.length === 0 ? (
            <EmptyState
              title="No addresses saved yet"
              description="Add your first delivery address to speed up checkout."
              action={{ label: "Add Address", href: "#", onClick: openAddModal }}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  selected={store.selectedAddressId === addr.id}
                  onSelect={() => {
                    userService.setSelectedAddressId(addr.id);
                    toast.success(`Delivering to ${addr.label}`);
                  }}
                  onEdit={() => openEditModal(addr)}
                  onDelete={() => handleDelete(addr.id)}
                  onDefault={() => handleSetDefault(addr)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
            <DialogDescription>Enter delivery location details below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div>
              <Label>Address Label</Label>
              <RadioGroup
                className="mt-2 flex gap-4"
                value={form.watch("label")}
                onValueChange={(val) => form.setValue("label", val as AddressLabel)}
              >
                {(["Home", "Office", "Other"] as const).map((lbl) => (
                  <label key={lbl} className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                    <RadioGroupItem value={lbl} /> {lbl}
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-1">
              <Label htmlFor="line1">Flat, House no., Building, Street</Label>
              <Input id="line1" placeholder="e.g. Flat 402, Sunshine Apts, 5th Cross" {...form.register("line1")} />
              {form.formState.errors.line1 && (
                <p className="text-xs text-destructive">{form.formState.errors.line1.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="line2">Area, Landmark (Optional)</Label>
              <Input id="line2" placeholder="e.g. Near City Park" {...form.register("line2")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("city")} />
                {form.formState.errors.city && (
                  <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" placeholder="6 digits" {...form.register("pincode")} />
                {form.formState.errors.pincode && (
                  <p className="text-xs text-destructive">{form.formState.errors.pincode.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isDefault"
                className="h-4 w-4 rounded border-gray-300 text-primary"
                {...form.register("isDefault")}
              />
              <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
                Make this my default delivery address
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Address"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
