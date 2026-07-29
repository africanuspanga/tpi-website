import { createClient } from "@/lib/supabase/server";
import { MessagesManager } from "@/components/admin/MessagesManager";
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

      <MessagesManager messages={messages} />
    </div>
  );
}
