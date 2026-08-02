"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { canEditContent } from "@/lib/utils/roles";
import {
  CONTENT_PAGES,
  findBlock,
  findPage,
  isListField,
  type Field,
} from "@/lib/content/schema";

/**
 * Coerce a submitted block payload to the shape its schema declares.
 *
 * The admin form is generated from the same registry, but the values still
 * arrive from the browser, so nothing is written to the database without being
 * validated against the declared field list. Unknown keys are dropped, and each
 * value is cast to the declared type instead of being trusted.
 */
function sanitizeBlock(
  fields: Field[],
  raw: Record<string, unknown>
): Record<string, unknown> {
  const clean: Record<string, unknown> = {};

  for (const field of fields) {
    const value = raw[field.name];

    if (isListField(field)) {
      const items = Array.isArray(value) ? value : [];
      clean[field.name] = items
        .filter((item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item)
        )
        .map((item) => sanitizeBlock(field.fields, item));
      continue;
    }

    switch (field.type) {
      case "boolean":
        clean[field.name] = value === true || value === "true";
        break;
      case "number": {
        const num = typeof value === "number" ? value : Number(value);
        clean[field.name] = Number.isFinite(num) ? num : null;
        break;
      }
      default:
        clean[field.name] = typeof value === "string" ? value : value == null ? "" : String(value);
    }
  }

  return clean;
}

export async function getContentBlocks(pageKey: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("block_key, content, updated_at")
    .eq("page_key", pageKey);

  if (error || !data) return {} as Record<string, Record<string, unknown>>;

  const map: Record<string, Record<string, unknown>> = {};
  for (const row of data) {
    map[row.block_key as string] =
      (row.content as Record<string, unknown>) ?? {};
  }
  return map;
}

export async function saveContentBlock(
  pageKey: string,
  blockKey: string,
  values: Record<string, unknown>
) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const page = findPage(pageKey);
  const block = findBlock(pageKey, blockKey);
  if (!page || !block) {
    return { success: false, message: "Unknown content block." };
  }

  const content = sanitizeBlock(block.fields, values ?? {});

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("site_content").upsert(
    {
      page_key: pageKey,
      block_key: blockKey,
      content,
      updated_by: user?.id ?? null,
    },
    { onConflict: "page_key,block_key" }
  );

  if (error) {
    return { success: false, message: error.message };
  }

  await supabase.from("audit_logs").insert({
    user_id: user?.id ?? null,
    action: "update",
    entity_type: "site_content",
    entity_id: null,
    new_data: { page_key: pageKey, block_key: blockKey },
  });

  // The edited block may appear on more than one route (global blocks appear on
  // every page), so refresh the whole public tree plus the editor itself.
  revalidatePath("/", "layout");
  revalidatePath(`/admin/content/${pageKey}`);

  return { success: true, message: `${block.label} saved.` };
}

/** Clear a block's overrides so the site falls back to its shipped copy. */
export async function resetContentBlock(pageKey: string, blockKey: string) {
  if (!(await canEditContent())) {
    return { success: false, message: "Permission denied." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_content")
    .delete()
    .eq("page_key", pageKey)
    .eq("block_key", blockKey);

  if (error) return { success: false, message: error.message };

  revalidatePath("/", "layout");
  revalidatePath(`/admin/content/${pageKey}`);
  return { success: true, message: "Reset to the original content." };
}

/** Page list for the admin Content index, with an "edited" indicator. */
export async function getContentOverview() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_content").select("page_key");

  const edited = new Set((data ?? []).map((row) => row.page_key as string));

  return CONTENT_PAGES.map((page) => ({
    key: page.key,
    label: page.label,
    path: page.path,
    description: page.description ?? "",
    blockCount: page.blocks.length,
    isCustomised: edited.has(page.key),
  }));
}
