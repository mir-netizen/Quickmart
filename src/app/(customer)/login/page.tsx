"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DemoButtons } from "@/components/shared/demo-buttons";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function CustomerLoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { email: "rahul@demo.com", password: "demo123" } });

  return (
    <div className="page-wrap grid min-h-[80vh] items-center py-12 md:grid-cols-2 md:gap-16">
      <div>
        <Logo />
        <h1 className="mt-8 font-display text-4xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-muted-foreground">Sign in to order from neighbourhood shops in minutes.</p>
      </div>
      <div className="rounded-3xl border bg-card p-6 shadow-card">
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email ? <p className="text-xs text-destructive">{form.formState.errors.email.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...form.register("password")} />
            {form.formState.errors.password ? <p className="text-xs text-destructive">{form.formState.errors.password.message}</p> : null}
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New here? <Link className="text-primary" href="/register">Create an account</Link>
        </p>
        <div className="mt-6 border-t pt-5">
          <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">Demo access</p>
          <DemoButtons />
        </div>
      </div>
    </div>
  );
}
