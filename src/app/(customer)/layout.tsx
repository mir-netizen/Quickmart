import { CustomerFooter, CustomerHeader } from "@/components/customer/header";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <CustomerHeader />
      <main className="flex-1">{children}</main>
      <CustomerFooter />
    </div>
  );
}
