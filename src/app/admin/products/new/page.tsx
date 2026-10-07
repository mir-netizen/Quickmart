"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { useStoreSnapshot } from "@/hooks/use-async";
import { productService } from "@/services/product.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  brand: z.string().min(2, "Brand is required"),
  categoryId: z.string().min(1, "Select a category"),
  unit: z.string().min(1, "Unit measurement required (e.g., 1 L, 500 g)"),
  mrp: z.number().min(1, "MRP must be at least ₹1"),
  description: z.string().min(5, "Description is required"),
  image: z.string().url("Must be a valid image URL"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminNewProductPage() {
  const router = useRouter();
  const store = useStoreSnapshot();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      categoryId: store.categories[0]?.id ?? "cat-dairy",
      unit: "1 kg",
      mrp: 100,
      description: "",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    },
  });

  async function onSubmit(data: ProductFormData) {
    try {
      await productService.createCatalogProduct({
        name: data.name,
        brand: data.brand,
        categoryId: data.categoryId,
        unit: data.unit,
        mrp: data.mrp,
        description: data.description,
        image: data.image,
      });
      toast.success(`${data.name} added to Global Catalog`);
      router.push("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to catalog
      </Link>

      <PageHeader
        title="Add Global Catalog Product"
        description="Publish a verified item into the central platform catalog so neighbourhood shops can stock it."
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "New Product" },
        ]}
      />

      <Card className="p-6 max-w-2xl">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Product Title</Label>
              <Input id="name" placeholder="e.g. Amul Taaza Fresh Milk" {...form.register("name")} />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" placeholder="e.g. Amul" {...form.register("brand")} />
              {form.formState.errors.brand && (
                <p className="text-xs text-destructive">{form.formState.errors.brand.message}</p>
              )}
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
              <Input id="unit" placeholder="e.g. 1 L or 500 g" {...form.register("unit")} />
              {form.formState.errors.unit && (
                <p className="text-xs text-destructive">{form.formState.errors.unit.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mrp">Maximum Retail Price (₹)</Label>
              <Input
                id="mrp"
                type="number"
                min="1"
                {...form.register("mrp", { valueAsNumber: true })}
              />
              {form.formState.errors.mrp && (
                <p className="text-xs text-destructive">{form.formState.errors.mrp.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="image">Product Image URL</Label>
            <Input id="image" {...form.register("image")} />
            {form.formState.errors.image && (
              <p className="text-xs text-destructive">{form.formState.errors.image.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Product Description</Label>
            <Textarea id="description" rows={3} placeholder="Ingredients, nutritional info, origin..." {...form.register("description")} />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting} className="gap-2">
              <Plus className="h-4 w-4" />
              {form.formState.isSubmitting ? "Adding..." : "Publish to Catalog"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
