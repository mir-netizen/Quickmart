"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

export function DemoButtons({ roles = ["customer", "merchant", "admin"] as UserRole[] }) {
  const { demo } = useAuth();
  const [pending, setPending] = useState<UserRole | null>(null);

  return (
    <div className="grid gap-2">
      {roles.map((role) => (
        <Button
          key={role}
          variant="outline"
          disabled={pending !== null}
          onClick={async () => {
            setPending(role);
            try {
              await demo(role);
            } finally {
              setPending(null);
            }
          }}
        >
          {pending === role ? "Signing in..." : `Continue as ${role} demo`}
        </Button>
      ))}
    </div>
  );
}
