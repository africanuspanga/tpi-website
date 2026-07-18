"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";

export async function updateSiteSetting(
  key: string,
  value: unknown,
  isPublic = true
) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert(
    {
      setting_key: key,
      setting_value: value,
      is_public: isPublic,
    },
    { onConflict: "setting_key" }
  );

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { success: true };
}
