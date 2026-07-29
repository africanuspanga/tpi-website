"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import type { MessageStatus } from "@/types/supabase";

export async function updateMessageStatus(
  id: string,
  status: MessageStatus,
  notes?: string
) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status, ...(notes !== undefined ? { admin_notes: notes } : {}) })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}

export async function updateMessageNotes(id: string, notes: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ admin_notes: notes })
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}

export async function deleteMessage(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/messages");
  return { success: true };
}
