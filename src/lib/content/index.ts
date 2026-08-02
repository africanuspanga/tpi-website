import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { blockDefaults } from "./schema";

export * from "./schema";

type ContentRow = {
  page_key: string;
  block_key: string;
  content: Record<string, unknown> | null;
};

/**
 * Load the entire editable-content table once per request.
 *
 * The table holds one small jsonb row per site block (a few dozen rows at
 * most), so a single round-trip is cheaper than one query per section — and
 * React's `cache` dedupes it across every component in the same render.
 *
 * Failures are swallowed on purpose: an unreachable database must fall back to
 * the defaults compiled into the app rather than blanking the public site.
 */
const loadContent = cache(async (): Promise<Map<string, Record<string, unknown>>> => {
  const map = new Map<string, Record<string, unknown>>();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("page_key, block_key, content");

    if (error || !data) return map;

    for (const row of data as ContentRow[]) {
      map.set(`${row.page_key}:${row.block_key}`, row.content ?? {});
    }
  } catch {
    // Backend unavailable — defaults will be used.
  }
  return map;
});

/**
 * Read one editable block, merged over the defaults declared in the schema.
 *
 * Only keys the editor actually set override the defaults, and blank strings
 * are treated as "not set". That means clearing a field in the admin restores
 * the shipped copy instead of leaving a hole in the page, and adding a new
 * field to the schema works immediately for already-saved blocks.
 */
export async function getBlock<T = Record<string, unknown>>(
  pageKey: string,
  blockKey: string
): Promise<T> {
  const defaults = blockDefaults(pageKey, blockKey);
  const stored = (await loadContent()).get(`${pageKey}:${blockKey}`);

  if (!stored) return { ...defaults } as T;

  const merged: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(stored)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    merged[key] = value;
  }

  return merged as T;
}

/** Raw stored values for a block — used by the admin editor, no defaults applied. */
export async function getStoredBlock(
  pageKey: string,
  blockKey: string
): Promise<Record<string, unknown> | null> {
  return (await loadContent()).get(`${pageKey}:${blockKey}`) ?? null;
}
