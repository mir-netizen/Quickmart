"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { DemoButtons } from "@/components/shared/demo-buttons";
import { useAuth } from "@/hooks/use-auth";

const schema = z.object({
  email: z.string().email("Enter a valid admin email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@quickmart.demo",
      password: "demo123",
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Admin Operations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Platform command center for shop approvals, catalogue, and analytics.</p>
        </div>

        <Card className="p-6 shadow-card">
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              setError(null);
              try {
                await login(values.email, values.password);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to sign in");
              }
            })}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email">Administrator Email</Label>
              <Input id="email" type="email" placeholder="admin@quickmart.demo" {...form.register("email")} />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Security Password</Label>
              <Input id="password" type="password" {...form.register("password")} />
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Authenticating..." : "Sign In to Admin Portal"}
            </Button>
          </form>

          <div className="mt-6 border-t pt-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Developer Demo Access</p>
            <DemoButtons roles={["admin"]} />
          </div>
        </Card>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            ← Customer App
          </Link>
          <Link href="/merchant/login" className="hover:text-foreground">
            Merchant Portal →
          </Link>
        </div>
      </div>
    </div>
  );
}
