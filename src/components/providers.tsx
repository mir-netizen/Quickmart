"use client";

import { Toaster } from "sonner";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
