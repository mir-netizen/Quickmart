"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { getAuthSession, mockStore } from "@/services/mock/store";
import { useStoreSnapshot } from "@/hooks/use-async";
import type { UserRole } from "@/types";

export function useAuth() {
  const snapshot = useStoreSnapshot();
  const session = typeof window === "undefined" ? null : getAuthSession();
  const user = session ? snapshot.users.find((item) => item.id === session.userId) ?? null : null;
  const router = useRouter();

  async function login(email: string, password: string) {
    const next = await authService.login(email, password);
    toast.success(`Welcome back, ${next.name.split(" ")[0]}`);
    redirectForRole(next.role);
  }

  async function demo(role: UserRole) {
    const next = await authService.demoLogin(role);
    toast.success(`Signed in as ${next.name}`);
    redirectForRole(next.role);
  }

  async function register(input: { name: string; email: string; phone: string; password: string }) {
    const next = await authService.register(input);
    toast.success("Account created");
    router.push("/");
    return next;
  }

  async function logout() {
    await authService.logout();
    toast.message("Signed out");
    router.push("/login");
  }

  function redirectForRole(role: UserRole) {
    if (role === "admin") router.push("/admin");
    else if (role === "merchant") router.push("/merchant");
    else router.push("/");
  }

  return { user, session, login, demo, register, logout, redirectForRole };
}

export function useResetDemo() {
  return () => {
    mockStore.reset();
    toast.success("Demo data reset");
  };
}
