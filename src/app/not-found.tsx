import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <Logo />
      <h1 className="font-display text-3xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">That route does not exist in the QuickMart frontend.</p>
      <Link className="text-primary underline" href="/">
        Back home
      </Link>
    </div>
  );
}
