import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-soft-bg px-4 text-center">
      <h1 className="text-6xl font-bold text-navy">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-navy">Page not found</h2>
      <p className="mt-2 max-w-md text-muted-text">
        We could not find the page you were looking for. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-8 bg-navy hover:bg-navy/90">
        <Link href="/">Return home</Link>
      </Button>
    </div>
  );
}
