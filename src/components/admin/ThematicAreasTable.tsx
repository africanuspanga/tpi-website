"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/DataTable";
import { deleteThematicArea } from "@/actions/admin/thematic";

interface ThematicAreaRow {
  id: string;
  name: string;
  slug: string;
  number_label: string | null;
  accent_color: string | null;
  sort_order: number;
  is_active: boolean;
}

export function ThematicAreasTable({ rows }: { rows: ThematicAreaRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onDelete(row: ThematicAreaRow) {
    if (
      !window.confirm(
        `Delete "${row.name}" and all its focus items? This action cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteThematicArea(row.id);
      if (result.success) {
        toast.success("Thematic area deleted.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete.");
      }
    });
  }

  return (
    <div className={isPending ? "opacity-60" : ""}>
      <DataTable<ThematicAreaRow>
        data={rows}
        editHref={(row) => `/admin/thematic-areas/${row.id}`}
        viewHref={(row) => `/what-we-do/${row.slug}`}
        onDelete={onDelete}
        columns={[
          { key: "name", header: "Name", cell: (row) => row.name },
          { key: "slug", header: "Slug", cell: (row) => row.slug },
          {
            key: "accent_color",
            header: "Accent",
            cell: (row) =>
              row.accent_color ? (
                <span className="flex items-center gap-2">
                  {row.accent_color.startsWith("#") && (
                    <span
                      className="h-4 w-4 rounded-full border"
                      style={{ backgroundColor: row.accent_color }}
                    />
                  )}
                  <span className="text-sm text-muted-text">{row.accent_color}</span>
                </span>
              ) : (
                <span className="text-muted-text">—</span>
              ),
          },
          { key: "sort_order", header: "Order", cell: (row) => row.sort_order },
          {
            key: "is_active",
            header: "Active",
            cell: (row) =>
              row.is_active ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  Inactive
                </Badge>
              ),
          },
        ]}
      />
    </div>
  );
}
