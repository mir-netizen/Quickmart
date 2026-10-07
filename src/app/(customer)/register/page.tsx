"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

export default function CustomerRegisterPage() {
  const { register: signup } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", phone: "", password: "" } });

  return (
    <div className="page-wrap max-w-lg py-12">
      <Logo />
      <h1 className="mt-8 font-display text-3xl font-semibold">Create your account</h1>
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          setError(null);
          try {
            await signup(values);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to register");
          }
        })}
      >
        {(["name", "email", "phone", "password"] as const).map((field) => (
          <div key={field} className="space-y-1.5">
            <Label htmlFor={field} className="capitalize">{field}</Label>
            <Input id={field} type={field === "password" ? "password" : "text"} {...form.register(field)} />
            {form.formState.errors[field] ? <p className="text-xs text-destructive">{form.formState.errors[field]?.message}</p> : null}
          </div>
        ))}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button className="w-full" disabled={form.formState.isSubmitting}>Create account</Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account? <Link className="text-primary" href="/login">Sign in</Link>
      </p>
    </div>
  );
}
