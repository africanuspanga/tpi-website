"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSuperAdmin } from "@/lib/utils/roles";
import type { UserRoleFormValues } from "@/lib/validation/admin";

export type AdminUserRow = {
  user_id: string;
  role: string;
  is_active: boolean;
  email: string | null;
  full_name: string | null;
};

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  if (!(await isSuperAdmin())) {
    throw new Error("Permission denied.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id, role, is_active")
    .order("created_at", { ascending: false });

  if (error) throw error;

  // profiles has no FK to admin_users, so fetch profiles separately
  const userIds = (data || []).map((item) => item.user_id);
  const { data: profiles } = userIds.length
    ? await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds)
    : { data: [] };
  const nameById = new Map(
    (profiles || []).map((p) => [p.user_id, p.full_name] as const)
  );

  const adminClient = createAdminClient();
  const rows: AdminUserRow[] = [];
  for (const item of data || []) {
    const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(
      item.user_id
    );
    rows.push({
      user_id: item.user_id,
      role: item.role,
      is_active: item.is_active,
      full_name: nameById.get(item.user_id) || null,
      email: userError ? null : userData.user.email || null,
    });
  }

  return rows;
}

export async function updateAdminUser(values: UserRoleFormValues) {
  if (!(await isSuperAdmin())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("admin_users").upsert(
    {
      user_id: values.user_id,
      role: values.role,
      is_active: values.is_active,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteAdminUser(userId: string) {
  if (!(await isSuperAdmin())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("admin_users").delete().eq("user_id", userId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
