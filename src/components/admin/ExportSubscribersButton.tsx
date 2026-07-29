"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Row = {
  email: string;
  full_name: string | null;
  is_active: boolean;
  subscribed_at: string;
};

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function ExportSubscribersButton({ rows }: { rows: Row[] }) {
  function download() {
    const lines = [
      "Email,Name,Status,Subscribed At",
      ...rows.map((row) =>
        [
          csvCell(row.email),
          csvCell(row.full_name || ""),
          row.is_active ? "active" : "unsubscribed",
          csvCell(new Date(row.subscribed_at).toISOString()),
        ].join(",")
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `tpi-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={download} disabled={rows.length === 0}>
      <Download className="mr-2 h-4 w-4" />
      Export CSV
    </Button>
  );
}
