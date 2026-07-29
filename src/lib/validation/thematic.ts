import { z } from "zod";

export const thematicAreaFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  number_label: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  icon_name: z.string().optional(),
  accent_color: z.string().optional(),
  hero_image_url: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export const focusItemFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

export const thematicAreaSchema = thematicAreaFormSchema;
export const focusItemSchema = focusItemFormSchema;

export type ThematicAreaFormValues = z.infer<typeof thematicAreaFormSchema>;
export type FocusItemFormValues = z.infer<typeof focusItemFormSchema>;

export interface ThematicArea {
  id: string;
  name: string;
  slug: string;
  number_label: string | null;
  short_description: string | null;
  description: string | null;
  icon_name: string | null;
  accent_color: string | null;
  hero_image_url: string | null;
  sort_order: number;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ThematicFocusItem {
  id: string;
  thematic_area_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
