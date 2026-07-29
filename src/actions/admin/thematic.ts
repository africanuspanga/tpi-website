"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import type {
  ThematicAreaFormValues,
  FocusItemFormValues,
  ThematicArea,
  ThematicFocusItem,
} from "@/lib/validation/thematic";

type EntityType = "thematic_areas" | "thematic_focus_items";

async function audit(
  entityType: EntityType,
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

function revalidate(areaId?: string) {
  revalidatePath("/admin/thematic-areas");
  if (areaId) revalidatePath(`/admin/thematic-areas/${areaId}`);
  revalidatePath("/what-we-do");
  revalidatePath("/projects");
}

function areaToDb(values: ThematicAreaFormValues) {
  return {
    name: values.name,
    slug: values.slug,
    number_label: values.number_label || null,
    short_description: values.short_description || null,
    description: values.description || null,
    icon_name: values.icon_name || null,
    accent_color: values.accent_color || null,
    hero_image_url: values.hero_image_url || null,
    sort_order: values.sort_order ?? 0,
    is_active: values.is_active,
    seo_title: values.seo_title || null,
    seo_description: values.seo_description || null,
  };
}

function focusItemToDb(values: FocusItemFormValues) {
  return {
    title: values.title,
    description: values.description || null,
    sort_order: values.sort_order ?? 0,
    is_active: values.is_active,
  };
}

export async function getAdminThematicAreas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("thematic_areas")
    .select("id, name, slug, number_label, accent_color, sort_order, is_active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getThematicArea(
  id: string
): Promise<{ area: ThematicArea; focusItems: ThematicFocusItem[] } | null> {
  const supabase = await createClient();
  const { data: area, error } = await supabase
    .from("thematic_areas")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !area) return null;

  const { data: focusItems } = await supabase
    .from("thematic_focus_items")
    .select("*")
    .eq("thematic_area_id", id)
    .order("sort_order", { ascending: true });

  return {
    area: area as ThematicArea,
    focusItems: (focusItems || []) as ThematicFocusItem[],
  };
}

export async function createThematicArea(values: ThematicAreaFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("thematic_areas")
    .insert(areaToDb(values))
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("thematic_areas", "create", data.id, undefined, values);
  revalidate(data.id);
  return { success: true, id: data.id };
}

export async function updateThematicArea(id: string, values: ThematicAreaFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("thematic_areas")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("thematic_areas")
    .update(areaToDb(values))
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("thematic_areas", "update", id, existing, values);
  revalidate(id);
  return { success: true };
}

export async function deleteThematicArea(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("thematic_areas")
    .select("*")
    .eq("id", id)
    .single();
  const { error } = await supabase.from("thematic_areas").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("thematic_areas", "delete", id, existing, undefined);
  revalidate(id);
  return { success: true };
}

export async function addFocusItem(areaId: string, values: FocusItemFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("thematic_focus_items")
    .insert({ ...focusItemToDb(values), thematic_area_id: areaId })
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("thematic_focus_items", "create", data.id, undefined, {
    thematic_area_id: areaId,
    ...values,
  });
  revalidate(areaId);
  return { success: true, id: data.id };
}

export async function updateFocusItem(
  areaId: string,
  id: string,
  values: FocusItemFormValues
) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("thematic_focus_items")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("thematic_focus_items")
    .update(focusItemToDb(values))
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("thematic_focus_items", "update", id, existing, values);
  revalidate(areaId);
  return { success: true };
}

export async function deleteFocusItem(areaId: string, id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("thematic_focus_items")
    .select("*")
    .eq("id", id)
    .single();
  const { error } = await supabase
    .from("thematic_focus_items")
    .delete()
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("thematic_focus_items", "delete", id, existing, undefined);
  revalidate(areaId);
  return { success: true };
}
