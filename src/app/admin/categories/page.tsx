"use client";

import { useState } from "react";
import { Plus, Layers, Tag } from "lucide-react";
import { toast } from "sonner";
import { useStoreSnapshot } from "@/hooks/use-async";
import { categoryService } from "@/services/category.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminCategoriesPage() {
  const store = useStoreSnapshot();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setBusy(true);
    try {
      await categoryService.createCategory({ name: name.trim(), description: description.trim() });
      toast.success(`Category "${name}" created successfully`);
      setName("");
      setDescription("");
      setModalOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Categories"
        description="Departmental taxonomies used for catalog organization, customer browsing, and shop inventory classifications."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Categories" }]}
        actions={
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        }
      />

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug Identifier</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Catalog Products</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {store.categories.map((category) => {
              const productCount = store.catalog.filter((p) => p.categoryId === category.id).length;

              return (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={category.image} alt="" className="h-10 w-10 rounded-xl object-cover border" />
                      <p className="font-semibold text-sm">{category.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-sm truncate">
                    {category.description}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm">
                    {productCount} items
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new product taxonomy department.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="catName">Category Name</Label>
              <Input
                id="catName"
                placeholder="e.g. Organic Dairy & Vegan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catDesc">Description</Label>
              <Input
                id="catDesc"
                placeholder="Brief summary of products in this category"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={busy}>
                {busy ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
