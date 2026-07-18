"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import type { PageFormValues } from "@/lib/validation/admin";
import type { Page } from "@/types/supabase";

async function audit(action: string, entityId: string | null, oldData?: unknown, newData?: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    action,
    entity_type: "pages",
    entity_id: entityId,
    old_data: oldData || null,
    new_data: newData || null,
  });
}

function toDb(values: PageFormValues, pageType = "content") {
  return {
    title: values.title,
    slug: values.slug,
    page_type: pageType,
    excerpt: values.excerpt || null,
    content: values.content || null,
    hero_image_url: values.hero_image_url || null,
    status: values.status,
    is_featured: values.is_featured,
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
    og_image_url: values.og_image_url || null,
    published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
  };
}

export async function getPages() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("id, title, slug, status, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPage(id: string): Promise<Page | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("pages").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Page;
}

export async function createPage(values: PageFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("pages").insert(toDb(values)).select("id").single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("create", data.id, undefined, values);
  revalidatePath("/admin/pages");
  revalidatePath("/");
  return { success: true, id: data.id };
}

export async function updatePage(id: string, values: PageFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("pages").select("*").eq("id", id).single();

  const { error } = await supabase.from("pages").update(toDb(values)).eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("update", id, existing, values);
  revalidatePath("/admin/pages");
  revalidatePath("/");
  return { success: true };
}

export async function deletePage(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("pages").select("*").eq("id", id).single();
  const { error } = await supabase.from("pages").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("delete", id, existing, undefined);
  revalidatePath("/admin/pages");
  revalidatePath("/");
  return { success: true };
}
