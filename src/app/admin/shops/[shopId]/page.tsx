"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Clock, FileCheck, MapPin, Phone, ShieldCheck, UserCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useStoreSnapshot } from "@/hooks/use-async";
import { adminService } from "@/services/admin.service";
import { PageHeader } from "@/components/ops/ops-shell";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";

export default function AdminShopDetailPage({ params }: { params: Promise<{ shopId: string }> }) {
  const resolvedParams = use(params);
  const store = useStoreSnapshot();
  const shop = store.shops.find((s) => s.id === resolvedParams.shopId);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!shop) {
    return (
      <div className="py-12">
        <ErrorState message="Shop application not found." />
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/admin/shops">Back to shops</Link>
          </Button>
        </div>
      </div>
    );
  }

  const owner = store.users.find((u) => u.id === shop.ownerId);

  async function handleApprove() {
    setActionLoading(true);
    try {
      await adminService.approveShop(shop!.id);
      toast.success(`${shop!.name} has been approved and activated for customer orders!`);
      setApproveOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to approve shop");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    setActionLoading(true);
    try {
      await adminService.rejectShop(shop!.id);
      toast.error(`${shop!.name} application was rejected.`);
      setRejectOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reject shop");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/shops" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to shops list
      </Link>

      <PageHeader
        title={shop.name}
        description={`Onboarding Application ID: ${shop.id}`}
        crumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Shops", href: "/admin/shops" },
          { label: shop.name },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge status={shop.status} />

            {shop.status === "pending" && (
              <div className="flex gap-2">
                <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={() => setRejectOpen(true)}>
                  Reject Application
                </Button>
                <Button onClick={() => setApproveOpen(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle className="h-4 w-4" /> Approve & Activate Store
                </Button>
              </div>
            )}
          </div>
        }
      />

      {/* Banner */}
      <div className="relative h-48 overflow-hidden rounded-2xl border shadow-card md:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shop.banner} alt={shop.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shop.image} alt="" className="h-16 w-16 rounded-xl border-2 border-white object-cover shadow-md" />
          <div>
            <h2 className="font-display text-2xl font-bold">{shop.name}</h2>
            <p className="text-xs text-white/80">{shop.address}, {shop.city}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Store Details & Owner Info */}
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="font-display text-base font-semibold border-b pb-2">Store Profile Details</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{shop.description}</p>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Contact Phone</span>
                <span className="font-medium text-foreground">{shop.phone}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Operating Schedule</span>
                <span className="font-medium text-foreground">{shop.hours.open} – {shop.hours.close}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Authorized Delivery Radius</span>
                <span className="font-medium text-foreground">{shop.deliveryRadiusKm} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Application Submitted</span>
                <span className="font-medium text-foreground">{formatDateTime(shop.submittedAt)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="rounded-xl bg-muted p-2 text-primary">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">Merchant Owner Details</h3>
                <p className="text-xs text-muted-foreground">Registered merchant identity</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Full Name</span>
                <span className="font-medium text-foreground">{owner?.name ?? "Merchant"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Registered Email</span>
                <span className="font-medium text-foreground">{owner?.email}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Phone Number</span>
                <span className="font-medium text-foreground">{owner?.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Merchant User ID</span>
                <span className="font-mono text-xs text-foreground">{owner?.id}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Legal Verification Documents */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="rounded-xl bg-muted p-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">Submitted Legal Documents</h3>
                <p className="text-xs text-muted-foreground">Verified compliance certificates</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {shop.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between rounded-xl border p-3.5">
                  <div className="flex items-center gap-3">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">Document Type: {doc.type}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    doc.status === "verified"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-muted/50 p-4 text-xs leading-relaxed text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">Approval Protocol:</p>
              Approving this merchant automatically enables their catalogue listings in the customer search index, activates their live order receiving portal, and marks all submitted compliance credentials as verified.
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title={`Approve ${shop.name}?`}
        description="This will change the store status to Active, enable customer ordering, and verify submitted documents."
        confirmLabel="Approve Shop"
        loading={actionLoading}
        onConfirm={handleApprove}
      />

      <ConfirmationDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title={`Reject ${shop.name} Application?`}
        description="This will reject the merchant's onboarding application and prevent their store from going live."
        confirmLabel="Reject Application"
        destructive
        loading={actionLoading}
        onConfirm={handleReject}
      />
    </div>
  );
}
