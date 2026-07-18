"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import type { PartnerFormValues } from "@/lib/validation/admin";
import type { Partner } from "@/types/supabase";

async function audit(action: string, entityId: string | null, oldData?: unknown, newData?: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    action,
    entity_type: "partners",
    entity_id: entityId,
    old_data: oldData || null,
    new_data: newData || null,
  });
}

function toDb(values: PartnerFormValues) {
  return {
    name: values.name,
    logo_url: values.logo_url || null,
    website_url: values.website_url || null,
    partner_type: values.partner_type || null,
    description: values.description || null,
    sort_order: values.sort_order ?? 0,
    is_active: values.is_active,
  };
}

export async function getPartners() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partners")
    .select("id, name, logo_url, partner_type, sort_order, is_active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getPartner(id: string): Promise<Partner | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("partners").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Partner;
}

export async function createPartner(values: PartnerFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("partners").insert(toDb(values)).select("id").single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("create", data.id, undefined, values);
  revalidatePath("/admin/partners");
  revalidatePath("/");
  return { success: true, id: data.id };
}

export async function updatePartner(id: string, values: PartnerFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("partners").select("*").eq("id", id).single();

  const { error } = await supabase.from("partners").update(toDb(values)).eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("update", id, existing, values);
  revalidatePath("/admin/partners");
  revalidatePath("/");
  return { success: true };
}

export async function deletePartner(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("partners").select("*").eq("id", id).single();
  const { error } = await supabase.from("partners").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("delete", id, existing, undefined);
  revalidatePath("/admin/partners");
  revalidatePath("/");
  return { success: true };
}
