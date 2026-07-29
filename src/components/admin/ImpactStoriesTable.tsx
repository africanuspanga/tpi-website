"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Trash2, MoreHorizontal, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { deleteImpactStory } from "@/actions/admin/impact";

export interface ImpactStoryRow {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  status: string;
  is_featured: boolean;
  published_at: string | null;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ImpactStoriesTable({ rows }: { rows: ImpactStoryRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!window.confirm("Delete this story? This action cannot be undone.")) return;
    startTransition(async () => {
      const result = await deleteImpactStory(id);
      if (result.success) {
        toast.success("Deleted.");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete.");
      }
    });
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-navy">Impact Stories</h2>
          <p className="text-sm text-muted-text">
            Stories shown on the Impact page.
          </p>
        </div>
        <Button asChild className="bg-navy hover:bg-navy/90">
          <Link href="/admin/impact/new">
            <Plus className="mr-2 h-4 w-4" />
            New story
          </Link>
        </Button>
      </div>
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-text">
                  No stories yet. Use “New story” to create your first one.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className={isPending ? "opacity-60" : ""}>
                  <TableCell>
                    <span className="font-medium text-body">{row.title}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-text">{row.location || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell>
                    {row.is_featured ? (
                      <Star className="h-4 w-4 fill-gold text-gold" />
                    ) : (
                      <span className="text-muted-text">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-text">{formatDate(row.published_at)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/admin/impact/${row.id}`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(row.id)}
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
    </section>
  );
}
