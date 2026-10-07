"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { useStoreSnapshot } from "@/hooks/use-async";
import { productService } from "@/services/product.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const editSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  brand: z.string().min(2, "Brand is required"),
  categoryId: z.string().min(1, "Select a category"),
  unit: z.string().min(1, "Unit measurement required"),
  mrp: z.number().min(1, "MRP must be at least ₹1"),
  description: z.string().min(5, "Description is required"),
  image: z.string().url("Must be a valid image URL"),
  active: z.boolean(),
});

type EditFormData = z.infer<typeof editSchema>;

export default function AdminEditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const store = useStoreSnapshot();

  const product = store.catalog.find((p) => p.id === resolvedParams.productId);

  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: product?.name ?? "",
      brand: product?.brand ?? "",
      categoryId: product?.categoryId ?? "",
      unit: product?.unit ?? "",
      mrp: product?.mrp ?? 100,
      description: product?.description ?? "",
      image: product?.image ?? "",
      active: product?.active ?? true,
    },
  });

  if (!product) {
    return (
      <div className="py-12">
        <ErrorState message="Product not found in global catalog." />
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/admin/products">Back to products</Link>
          </Button>
        </div>
      </div>
    );
  }

  async function onSubmit(data: EditFormData) {
    try {
      await productService.updateCatalogProduct(product!.id, {
        name: data.name,
        brand: data.brand,
        categoryId: data.categoryId,
        unit: data.unit,
        mrp: data.mrp,
        description: data.description,
        image: data.image,
        active: data.active,
      });
      toast.success(`${data.name} updated in Global Catalog`);
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </Link>

      <PageHeader
        title={`Edit ${product.name}`}
        description={`Catalog ID: ${product.id}`}
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: product.name },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Product Title</Label>
                <Input id="name" {...form.register("name")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" {...form.register("brand")} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select
                  value={form.watch("categoryId")}
                  onValueChange={(val) => form.setValue("categoryId", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {store.categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" {...form.register("unit")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mrp">Maximum Retail Price (₹)</Label>
                <Input
                  id="mrp"
                  type="number"
                  min="1"
                  {...form.register("mrp", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" {...form.register("image")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...form.register("description")} />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="active"
                className="h-4 w-4 rounded text-primary"
                {...form.register("active")}
              />
              <Label htmlFor="active" className="text-sm font-normal cursor-pointer">
                Product is active and discoverable by merchant stores
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="gap-2">
                <Save className="h-4 w-4" />
                {form.formState.isSubmitting ? "Saving..." : "Save Catalog Changes"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Live Preview Card */}
        <Card className="p-5 h-fit">
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">Image Preview</p>
          <div className="mt-3 overflow-hidden rounded-xl border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.watch("image") || product.image}
              alt=""
              className="h-48 w-full object-cover"
            />
          </div>
          <p className="mt-3 font-semibold text-sm">{form.watch("name") || product.name}</p>
          <p className="text-xs text-muted-foreground">{form.watch("brand") || product.brand} · {form.watch("unit") || product.unit}</p>
          <p className="mt-2 font-display text-lg font-bold text-foreground">₹{form.watch("mrp")}</p>
        </Card>
      </div>
    </div>
  );
}
