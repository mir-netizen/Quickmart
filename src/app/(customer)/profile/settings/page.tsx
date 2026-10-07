"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { useAuth, useResetDemo } from "@/hooks/use-auth";
import { userService } from "@/services/user.service";
import { ProfileNav } from "@/components/shared/address-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^\d{10}$/, "Must be a 10-digit phone number"),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function CustomerSettingsPage() {
  const { user } = useAuth();
  const resetDemo = useResetDemo();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
    },
  });

  if (!user) {
    return (
      <div className="page-wrap py-12">
        <EmptyState
          title="Sign in to view settings"
          description="Manage your account preferences."
          action={{ label: "Sign In", href: "/login" }}
        />
      </div>
    );
  }

  async function onSubmit(data: SettingsFormData) {
    try {
      await userService.updateProfile(user!.id, {
        name: data.name,
        phone: data.phone,
        avatarInitials: data.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  }

  return (
    <div className="page-wrap py-8">
      <h1 className="font-display text-3xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your personal information and application preferences.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="rounded-2xl border bg-card p-4 shadow-card">
            <ProfileNav />
          </div>
        </aside>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold">Personal Information</h2>
            <p className="text-xs text-muted-foreground">Update your display name and contact phone number.</p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4 max-w-md">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={user.email} disabled className="bg-muted opacity-80 cursor-not-allowed" />
                <p className="text-[11px] text-muted-foreground">Email address cannot be changed in demo mode.</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6 border-destructive/20">
            <h2 className="font-display text-lg font-semibold text-destructive">Demo Environment Controls</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Reset the local mock state back to initial seeded values (restores 10 shops, catalog products, orders, and addresses).
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={resetDemo} className="gap-2 text-destructive hover:bg-destructive/10">
                <RotateCcw className="h-4 w-4" /> Reset Demo Store State
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
