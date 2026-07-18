"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import type { ResourceFormValues } from "@/lib/validation/admin";
import type { Resource } from "@/types/supabase";

async function audit(action: string, entityId: string | null, oldData?: unknown, newData?: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    action,
    entity_type: "resources",
    entity_id: entityId,
    old_data: oldData || null,
    new_data: newData || null,
  });
}

function toDb(values: ResourceFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    resource_type: values.resource_type,
    description: values.description || null,
    file_url: values.file_url || null,
    external_url: values.external_url || null,
    cover_image_url: values.cover_image_url || null,
    publication_year: values.publication_year ? Number(values.publication_year) : null,
    author: values.author || null,
    language: values.language || "en",
    status: values.status,
    is_featured: values.is_featured,
    published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
  };
}

export async function getResources() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("id, title, slug, resource_type, status, is_featured, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getResource(id: string): Promise<Resource | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("resources").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Resource;
}

export async function createResource(values: ResourceFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("resources").insert(toDb(values)).select("id").single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("create", data.id, undefined, values);
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true, id: data.id };
}

export async function updateResource(id: string, values: ResourceFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("resources").select("*").eq("id", id).single();

  const { error } = await supabase.from("resources").update(toDb(values)).eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("update", id, existing, values);
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}

export async function deleteResource(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("resources").select("*").eq("id", id).single();
  const { error } = await supabase.from("resources").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("delete", id, existing, undefined);
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}
