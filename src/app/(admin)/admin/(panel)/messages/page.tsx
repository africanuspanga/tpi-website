import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/admin/DataTable";
import { deleteMessage, updateMessageStatus } from "@/actions/admin/messages";
import type { ContactMessage } from "@/types/supabase";

async function getMessages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ContactMessage[];
}

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Contact Messages</h1>
        <p className="text-muted-text">Enquiries submitted via the website.</p>
      </div>

      <DataTable
        data={messages}
        columns={[
          {
            key: "status",
            header: "Status",
            cell: (row) => <StatusBadge status={row.status} />,
          },
          {
            key: "name",
            header: "From",
            cell: (row) => (
              <div>
                <p className="font-medium">{row.full_name}</p>
                <p className="text-xs text-muted-text">{row.email}</p>
              </div>
            ),
          },
          {
            key: "subject",
            header: "Subject",
            cell: (row) => (
              <div>
                <p className="font-medium">{row.subject}</p>
                <p className="text-xs text-muted-text">{row.enquiry_type}</p>
              </div>
            ),
          },
          {
            key: "date",
            header: "Received",
            cell: (row) => (
              <span className="text-sm text-muted-text">
                {new Date(row.created_at).toLocaleDateString()}
              </span>
            ),
          },
        ]}
        onDelete={(row) => deleteMessage(row.id)}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-red-100 text-red-800",
    in_progress: "bg-amber-100 text-amber-800",
    resolved: "bg-green-100 text-green-800",
    spam: "bg-gray-100 text-gray-800",
  };
  return (
    <Badge variant="secondary" className={styles[status] || styles.new}>
      {status.replace("_", " ")}
    </Badge>
  );
}
