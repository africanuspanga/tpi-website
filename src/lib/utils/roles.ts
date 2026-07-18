import { createClient } from "@/lib/supabase/server";

export async function currentAppRole() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase.rpc("current_app_role");
  if (error || !data) return null;
  return data as string;
}

export async function canViewAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("can_view_admin");
  if (error) return false;
  return !!data;
}

export async function canEditContent() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("can_edit_content");
  if (error) return false;
  return !!data;
}

export async function isSuperAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_super_admin");
  if (error) return false;
  return !!data;
}
