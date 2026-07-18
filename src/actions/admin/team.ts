"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import type { TeamMemberFormValues } from "@/lib/validation/admin";
import type { TeamMember } from "@/types/supabase";

async function audit(action: string, entityId: string | null, oldData?: unknown, newData?: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    action,
    entity_type: "team_members",
    entity_id: entityId,
    old_data: oldData || null,
    new_data: newData || null,
  });
}

function toDb(values: TeamMemberFormValues) {
  return {
    full_name: values.full_name,
    position: values.position,
    biography: values.biography || null,
    photo_url: values.photo_url || null,
    email: values.email || null,
    linkedin_url: values.linkedin_url || null,
    sort_order: values.sort_order ?? 0,
    is_active: values.is_active,
  };
}

export async function getTeamMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("id, full_name, position, photo_url, sort_order, is_active")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getTeamMember(id: string): Promise<TeamMember | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_members").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as TeamMember;
}

export async function createTeamMember(values: TeamMemberFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .insert(toDb(values))
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("create", data.id, undefined, values);
  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true, id: data.id };
}

export async function updateTeamMember(id: string, values: TeamMemberFormValues) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("team_members").select("*").eq("id", id).single();

  const { error } = await supabase.from("team_members").update(toDb(values)).eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("update", id, existing, values);
  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true };
}

export async function deleteTeamMember(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase.from("team_members").select("*").eq("id", id).single();
  const { error } = await supabase.from("team_members").delete().eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("delete", id, existing, undefined);
  revalidatePath("/admin/team");
  revalidatePath("/team");
  return { success: true };
}
