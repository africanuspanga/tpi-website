"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Trash2, ExternalLink, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/admin/DataTable";
import { deletePage } from "@/actions/admin/pages";
import { deleteProject } from "@/actions/admin/projects";
import { deletePost } from "@/actions/admin/posts";
import { deleteResource } from "@/actions/admin/resources";
import { deletePartner } from "@/actions/admin/partners";
import { deleteTeamMember } from "@/actions/admin/team";

export type AdminEntity =
  | "pages"
  | "projects"
  | "posts"
  | "resources"
  | "partners"
  | "team";

type ColumnType = "text" | "status" | "date" | "boolean" | "featured" | "image";

export interface AdminColumn {
  key: string;
  header: string;
  type?: ColumnType;
}

type Row = Record<string, unknown> & { id: string };

const deleteActions: Record<
  AdminEntity,
  (id: string) => Promise<{ success: boolean; message?: string }>
> = {
  pages: deletePage,
  projects: deleteProject,
  posts: deletePost,
  resources: deleteResource,
  partners: deletePartner,
  team: deleteTeamMember,
};

function formatDate(value: unknown) {
  if (!value) return "—";
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderCell(row: Row, col: AdminColumn) {
  const value = row[col.key];
  switch (col.type) {
    case "status":
      return <StatusBadge status={String(value ?? "draft")} />;
    case "date":
      return <span className="text-muted-text">{formatDate(value)}</span>;
    case "boolean":
      return value ? (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Active
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
          Inactive
        </Badge>
      );
    case "featured":
      return value ? (
        <Star className="h-4 w-4 fill-gold text-gold" />
      ) : (
        <span className="text-muted-text">—</span>
      );
    case "image":
      return value ? (
        <div className="relative h-10 w-16 overflow-hidden rounded bg-soft-bg">
          <Image
            src={String(value)}
            alt=""
            fill
            sizes="64px"
            className="object-contain"
          />
        </div>
      ) : (
        <span className="text-muted-text">—</span>
      );
    default:
      return (
        <span className="font-medium text-body">
          {value === null || value === undefined || value === ""
            ? "—"
            : String(value).replace(/_/g, " ")}
        </span>
      );
  }
}

export function AdminDataView({
  rows,
  columns,
  basePath,
  entity,
  viewBase,
}: {
  rows: Row[];
  columns: AdminColumn[];
  basePath: string;
  entity: AdminEntity;
  /** Public-site slug base for a "View" link, e.g. "/projects". Requires a `slug` field. */
  viewBase?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(row: Row) {
    if (!window.confirm("Delete this item? This action cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteActions[entity](row.id);
      if (result.success) {
        toast.success("Deleted.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete.");
      }
    });
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="py-10 text-center text-muted-text"
              >
                No items yet. Use “New” to create your first one.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} className={isPending ? "opacity-60" : ""}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{renderCell(row, col)}</TableCell>
                ))}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`${basePath}/${row.id}`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {viewBase && row.slug ? (
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(
                              `${viewBase}/${String(row.slug)}`,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem
                        onClick={() => handleDelete(row)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
