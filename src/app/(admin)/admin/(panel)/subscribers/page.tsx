import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ExportSubscribersButton } from "@/components/admin/ExportSubscribersButton";

type SubscriberRow = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
};

async function getSubscribers(): Promise<SubscriberRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, full_name, is_active, subscribed_at, unsubscribed_at")
    .order("subscribed_at", { ascending: false });
  if (error) throw error;
  return (data || []) as SubscriberRow[];
}

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();
  const activeCount = subscribers.filter((s) => s.is_active).length;

  return (
    <div>
      <AdminPageHeader
        title="Newsletter Subscribers"
        description={`${activeCount} active of ${subscribers.length} total subscribers.`}
      />

      <div className="mb-4 flex justify-end">
        <ExportSubscribersButton rows={subscribers} />
      </div>

      <Card>
        <CardContent className="p-0">
          {subscribers.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-text">
              No subscribers yet. Sign-ups from the website footer will appear
              here.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-text">
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((row) => (
                    <tr key={row.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium text-navy">
                        {row.email}
                      </td>
                      <td className="px-4 py-3 text-body/80">
                        {row.full_name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={
                            row.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {row.is_active ? "Active" : "Unsubscribed"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-text">
                        {new Date(row.subscribed_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
