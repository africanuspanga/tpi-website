"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import type {
  ImpactStoryFormValues,
  ImpactMetricFormValues,
} from "@/lib/validation/impact";
import type { ImpactStory, ImpactMetric } from "@/types/supabase";

type ImpactEntityType = "impact_stories" | "impact_metrics";

async function audit(
  entityType: ImpactEntityType,
  action: string,
  entityId: string | null,
  oldData?: unknown,
  newData?: unknown
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_data: oldData || null,
    new_data: newData || null,
  });
}

function storyToDb(values: ImpactStoryFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt || null,
    body: values.body || null,
    location: values.location || null,
    featured_image_url: values.featured_image_url || null,
    project_id: values.project_id || null,
    thematic_area_id: values.thematic_area_id || null,
    status: values.status,
    is_featured: values.is_featured,
    published_at: values.published_at ? new Date(values.published_at).toISOString() : null,
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
  };
}

function metricToDb(values: ImpactMetricFormValues) {
  return {
    value: values.value,
    label: values.label,
    description: values.description || null,
    reporting_period: values.reporting_period || null,
    source: values.source || null,
    icon_name: values.icon_name || null,
    sort_order: values.sort_order ?? 0,
    is_active: values.is_active,
  };
}

export async function getImpactStories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("impact_stories")
    .select("id, title, slug, location, status, is_featured, published_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getImpactStory(id: string): Promise<ImpactStory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("impact_stories").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as ImpactStory;
}

export async function createImpactStory(values: ImpactStoryFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("impact_stories")
    .insert(storyToDb(values))
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("impact_stories", "create", data.id, undefined, values);
  revalidatePath("/admin/impact");
  revalidatePath("/impact");
  return { success: true, id: data.id };
}

export async function updateImpactStory(id: string, values: ImpactStoryFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("impact_stories").select("*").eq("id", id).single();

  const { error } = await supabase.from("impact_stories").update(storyToDb(values)).eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("impact_stories", "update", id, existing, values);
  revalidatePath("/admin/impact");
  revalidatePath("/impact");
  return { success: true };
}

export async function deleteImpactStory(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("impact_stories").select("*").eq("id", id).single();
  const { error } = await supabase.from("impact_stories").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("impact_stories", "delete", id, existing, undefined);
  revalidatePath("/admin/impact");
  revalidatePath("/impact");
  return { success: true };
}

export async function getImpactMetrics() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("impact_metrics")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []) as ImpactMetric[];
}

export async function createImpactMetric(values: ImpactMetricFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("impact_metrics")
    .insert(metricToDb(values))
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("impact_metrics", "create", data.id, undefined, values);
  revalidatePath("/admin/impact");
  revalidatePath("/impact");
  return { success: true, id: data.id };
}

export async function updateImpactMetric(id: string, values: ImpactMetricFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("impact_metrics").select("*").eq("id", id).single();

  const { error } = await supabase.from("impact_metrics").update(metricToDb(values)).eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("impact_metrics", "update", id, existing, values);
  revalidatePath("/admin/impact");
  revalidatePath("/impact");
  return { success: true };
}

export async function deleteImpactMetric(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("impact_metrics").select("*").eq("id", id).single();
  const { error } = await supabase.from("impact_metrics").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("impact_metrics", "delete", id, existing, undefined);
  revalidatePath("/admin/impact");
  revalidatePath("/impact");
  return { success: true };
}
