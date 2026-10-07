"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PortalGuard({
  allow,
  children,
}: {
  allow: UserRole[];
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      if (pathname.startsWith("/admin")) router.replace("/admin/login");
      else if (pathname.startsWith("/merchant")) router.replace("/merchant/login");
      else router.replace("/login");
    }
  }, [user, pathname, router]);

  if (!user) {
    return <div className="p-10 text-sm text-muted-foreground">Checking your session...</div>;
  }

  if (!allow.includes(user.role)) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is frontend-protected by mock auth only. Real authorization must happen on the backend.
        </p>
        <Button className="mt-6" asChild>
          <Link href={user.role === "admin" ? "/admin" : user.role === "merchant" ? "/merchant" : "/"}>
            Go to your portal
          </Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
