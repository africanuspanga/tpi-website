import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminPageHeader({
  title,
  description,
  newHref,
  newLabel = "New",
}: {
  title: string;
  description?: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">{title}</h1>
        {description && <p className="text-muted-text">{description}</p>}
      </div>
      {newHref && (
        <Button asChild className="bg-navy hover:bg-navy/90">
          <Link href={newHref}>
            <Plus className="mr-2 h-4 w-4" />
            {newLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}

export function AdminFormShell({
  title,
  backHref,
  children,
}: {
  title: string;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <Link href={backHref} className="text-sm text-muted-text hover:text-navy">
          ← Back
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-navy">{title}</h1>
      </div>
      <div className="rounded-lg border bg-white p-6">{children}</div>
    </div>
  );
}
