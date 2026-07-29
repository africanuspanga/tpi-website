import { z } from "zod";

export const impactStoryFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  location: z.string().optional(),
  featured_image_url: z.string().optional(),
  project_id: z.string().optional(),
  thematic_area_id: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export const impactMetricFormSchema = z.object({
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
  description: z.string().optional(),
  reporting_period: z.string().optional(),
  source: z.string().optional(),
  icon_name: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

/**
 * Short-name aliases used by form/action modules across the admin panel.
 */
export const impactStorySchema = impactStoryFormSchema;
export const impactMetricSchema = impactMetricFormSchema;

export type ImpactStoryFormValues = z.infer<typeof impactStoryFormSchema>;
export type ImpactMetricFormValues = z.infer<typeof impactMetricFormSchema>;
