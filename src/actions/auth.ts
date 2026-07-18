"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginFormValues } from "@/lib/validation/auth";

export async function signIn(values: LoginFormValues) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please check your email and password.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return {
      success: false,
      message: error?.message || "Invalid email or password.",
    };
  }

  // Verify the user has an active admin role
  const { data: adminData, error: adminError } = await supabase
    .from("admin_users")
    .select("role, is_active")
    .eq("user_id", data.user.id)
    .single();

  if (adminError || !adminData?.is_active) {
    await supabase.auth.signOut();
    return {
      success: false,
      message: "You do not have permission to access the admin panel.",
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("role, is_active, profiles(full_name, avatar_url)")
    .eq("user_id", user.id)
    .single();

  if (error || !data?.is_active) return null;

  return {
    id: user.id,
    email: user.email,
    role: data.role,
    full_name: (data.profiles as { full_name?: string } | null)?.full_name || "",
    avatar_url:
      (data.profiles as { avatar_url?: string } | null)?.avatar_url || "",
  };
}
