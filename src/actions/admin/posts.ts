"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import type { PostFormValues } from "@/lib/validation/admin";
import type { Post } from "@/types/supabase";

async function audit(action: string, entityId: string | null, oldData?: unknown, newData?: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    action,
    entity_type: "posts",
    entity_id: entityId,
    old_data: oldData || null,
    new_data: newData || null,
  });
}

function toDb(values: PostFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    post_type: values.post_type,
    excerpt: values.excerpt || null,
    body: values.body || null,
    featured_image_url: values.featured_image_url || null,
    author_name: values.author_name || null,
    event_date: values.event_date || null,
    location: values.location || null,
    status: values.status,
    is_featured: values.is_featured,
    published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
  };
}

export async function getPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, slug, post_type, status, is_featured, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Post;
}

export async function createPost(values: PostFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").insert(toDb(values)).select("id").single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("create", data.id, undefined, values);
  revalidatePath("/admin/posts");
  revalidatePath("/news");
  revalidatePath("/events");
  return { success: true, id: data.id };
}

export async function updatePost(id: string, values: PostFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("posts").select("*").eq("id", id).single();

  const { error } = await supabase.from("posts").update(toDb(values)).eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("update", id, existing, values);
  revalidatePath("/admin/posts");
  revalidatePath("/news");
  revalidatePath("/events");
  return { success: true };
}

export async function deletePost(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("posts").select("*").eq("id", id).single();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("delete", id, existing, undefined);
  revalidatePath("/admin/posts");
  revalidatePath("/news");
  revalidatePath("/events");
  return { success: true };
}
