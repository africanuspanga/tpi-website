"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2, Eye, MoreHorizontal } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];
  editHref?: (row: T) => string;
  viewHref?: (row: T) => string;
  onDelete?: (row: T) => void;
  statusKey?: keyof T;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  editHref,
  viewHref,
  onDelete,
}: DataTableProps<T>) {
  const router = useRouter();

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center text-muted-text py-8"
              >
                No items found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row.id}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.cell(row)}</TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {viewHref && (
                        <DropdownMenuItem
                          onClick={() => router.push(viewHref(row))}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                      )}
                      {editHref && (
                        <DropdownMenuItem
                          onClick={() => router.push(editHref(row))}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={() => onDelete(row)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
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

export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    published: "bg-green-100 text-green-800 hover:bg-green-100",
    draft: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    archived: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    completed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    planned: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    new: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  return (
    <Badge
      variant="secondary"
      className={variants[status] || "bg-gray-100 text-gray-800"}
    >
      {status}
    </Badge>
  );
}
