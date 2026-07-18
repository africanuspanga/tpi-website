"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { canEditContent } from "@/lib/utils/roles";
import type { MediaAsset } from "@/types/supabase";

const ALLOWED_MIME_TYPES = ["image/", "application/pdf"];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

async function audit(action: string, entityId: string | null, newData?: unknown) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("audit_logs").insert({
    user_id: user?.id || null,
    action,
    entity_type: "media_assets",
    entity_id: entityId,
    old_data: null,
    new_data: newData || null,
  });
}

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function uploadMedia(formData: FormData) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) || "";
  const altText = (formData.get("alt_text") as string | null) || "";

  if (!file) {
    return { success: false, message: "No file provided." };
  }

  if (!ALLOWED_MIME_TYPES.some((type) => file.type.startsWith(type))) {
    return { success: false, message: "Only images and PDF files are allowed." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, message: "File size must be less than 20MB." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const pathParts = [folder, `${Date.now()}_${sanitizedName}`].filter(Boolean);
  const storagePath = pathParts.join("/");

  const adminClient = createAdminClient();
  const { error: uploadError } = await adminClient.storage
    .from("public-media")
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return { success: false, message: uploadError.message };
  }

  const { data: publicUrlData } = adminClient.storage.from("public-media").getPublicUrl(storagePath);
  const fileUrl = publicUrlData.publicUrl;

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      file_name: file.name,
      file_url: fileUrl,
      storage_path: storagePath,
      mime_type: file.type,
      file_size: file.size,
      alt_text: altText || null,
      folder: folder || null,
      is_public: true,
      uploaded_by: user?.id || null,
    })
    .select("id")
    .single();

  if (error) {
    return { success: false, message: error.message };
  }

  await audit("create", data.id, { file_name: file.name, file_url: fileUrl });
  revalidatePath("/admin/media");
  return { success: true, id: data.id };
}

export async function deleteMediaAsset(id: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { data: asset } = await supabase.from("media_assets").select("*").eq("id", id).single();

  if (!asset) {
    return { success: false, message: "Media not found." };
  }

  if (asset.storage_path) {
    const adminClient = createAdminClient();
    await adminClient.storage.from("public-media").remove([asset.storage_path]);
  }

  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) {
    return { success: false, message: error.message };
  }

  await audit("delete", id, asset);
  revalidatePath("/admin/media");
  return { success: true };
}
