"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import type { ProjectFormValues } from "@/lib/validation/admin";
import type { Project, ThematicArea } from "@/types/supabase";

async function audit(action: string, entityId: string | null, oldData?: unknown, newData?: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    action,
    entity_type: "projects",
    entity_id: entityId,
    old_data: oldData || null,
    new_data: newData || null,
  });
}

function parseSdgs(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toDb(values: ProjectFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    summary: values.summary || null,
    description: values.description || null,
    location: values.location || null,
    project_status: values.project_status,
    publication_status: values.publication_status,
    start_date: values.start_date || null,
    end_date: values.end_date || null,
    hero_image_url: values.hero_image_url || null,
    is_featured: values.is_featured,
    sdgs: parseSdgs(values.sdgs),
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
    published_at:
      values.publication_status === "published"
        ? new Date().toISOString()
        : null,
  };
}

export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("id, title, location, project_status, publication_status, is_featured, updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getProject(id: string): Promise<(Project & { thematic_area_ids?: string[] }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
  if (error || !data) return null;

  const { data: links } = await supabase
    .from("project_themes")
    .select("thematic_area_id")
    .eq("project_id", id);

  return {
    ...data,
    thematic_area_ids: links?.map((l) => l.thematic_area_id) || [],
  } as Project & { thematic_area_ids?: string[] };
}

export async function getThematicAreas(): Promise<ThematicArea[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("thematic_areas")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return (data || []) as ThematicArea[];
}

export async function createProject(values: ProjectFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").insert(toDb(values)).select("id").single();

  if (error || !data) {
    return { success: false, message: error?.message || "Failed to create project." };
  }

  if (values.thematic_area_ids?.length) {
    await supabase.from("project_themes").insert(
      values.thematic_area_ids.map((thematicAreaId) => ({
        project_id: data.id,
        thematic_area_id: thematicAreaId,
      }))
    );
  }

  await audit("create", data.id, undefined, values);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true, id: data.id };
}

export async function updateProject(id: string, values: ProjectFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("projects").select("*").eq("id", id).single();

  const { error } = await supabase.from("projects").update(toDb(values)).eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await supabase.from("project_themes").delete().eq("project_id", id);
  if (values.thematic_area_ids?.length) {
    await supabase.from("project_themes").insert(
      values.thematic_area_ids.map((thematicAreaId) => ({
        project_id: id,
        thematic_area_id: thematicAreaId,
      }))
    );
  }

  await audit("update", id, existing, values);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}

export async function deleteProject(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("projects").select("*").eq("id", id).single();

  await supabase.from("project_themes").delete().eq("project_id", id);
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("delete", id, existing, undefined);
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { success: true };
}
