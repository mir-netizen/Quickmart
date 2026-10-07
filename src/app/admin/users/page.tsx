"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, UserCheck, ShieldAlert, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useStoreSnapshot } from "@/hooks/use-async";
import { adminService } from "@/services/admin.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import type { UserRole, AccountStatus } from "@/types";

export default function AdminUsersPage() {
  const store = useStoreSnapshot();
  const [filterRole, setFilterRole] = useState<string>("all");
  const [query, setQuery] = useState("");

  const users = store.users
    .filter((u) => {
      if (filterRole === "all") return true;
      if (filterRole === "suspended") return u.status === "suspended";
      return u.role === filterRole;
    })
    .filter((u) => {
      if (!query) return true;
      const q = query.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
    });

  const filterTabs = [
    { key: "all", label: "All Users" },
    { key: "customer", label: "Customers" },
    { key: "merchant", label: "Shopkeepers" },
    { key: "admin", label: "Admins" },
    { key: "suspended", label: "Suspended" },
  ];

  async function handleToggleStatus(userId: string, current: AccountStatus) {
    const nextStatus: AccountStatus = current === "active" ? "suspended" : "active";
    try {
      await adminService.updateUser(userId, { status: nextStatus });
      toast.success(`Account status changed to ${nextStatus}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change status");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Accounts Management"
        description="Oversee customer profiles, merchant operators, platform administrators, and account suspension policies."
        crumbs={[{ label: "Admin", href: "/admin" }, { label: "Users" }]}
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <Button
                key={tab.key}
                variant={filterRole === tab.key ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterRole(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search by name, email, phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6">
          {users.length === 0 ? (
            <div className="py-12">
              <EmptyState title="No users found" description="No accounts matched your filter criteria." />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-medium text-xs text-primary">
                          {u.avatarInitials}
                        </div>
                        <div>
                          <Link href={`/admin/users/${u.id}`} className="font-semibold text-sm hover:underline">
                            {u.name}
                          </Link>
                          <p className="font-mono text-[11px] text-muted-foreground">{u.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{u.email}</p>
                      <p className="text-xs text-muted-foreground">{u.phone}</p>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize text-xs font-medium px-2 py-0.5 rounded-full bg-muted">
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={u.status} />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/users/${u.id}`}>Details</Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={u.status === "active" ? "text-destructive" : "text-emerald-700"}
                          onClick={() => handleToggleStatus(u.id, u.status)}
                        >
                          {u.status === "active" ? "Suspend" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </div>
  );
}
