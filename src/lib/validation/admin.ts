import { z } from "zod";

export const pageFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  hero_image_url: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().default(false),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  og_image_url: z.string().optional(),
  published_at: z.string().optional(),
});

export const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  summary: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  project_status: z.enum(["planned", "active", "completed", "on_hold"]),
  publication_status: z.enum(["draft", "published", "archived"]),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  hero_image_url: z.string().optional(),
  is_featured: z.boolean().default(false),
  sdgs: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  thematic_area_ids: z.array(z.string()).default([]),
});

export const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  post_type: z.enum(["news", "insight", "event", "announcement"]),
  excerpt: z.string().optional(),
  body: z.string().optional(),
  featured_image_url: z.string().optional(),
  author_name: z.string().optional(),
  event_date: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

export const resourceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  resource_type: z.enum([
    "report",
    "policy_brief",
    "research",
    "toolkit",
    "case_study",
    "video",
    "other",
  ]),
  description: z.string().optional(),
  file_url: z.string().optional(),
  external_url: z.string().optional(),
  cover_image_url: z.string().optional(),
  publication_year: z.coerce.number().optional(),
  author: z.string().optional(),
  language: z.string().default("English"),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().default(false),
  published_at: z.string().optional(),
});

export const teamMemberFormSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  biography: z.string().optional(),
  photo_url: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  linkedin_url: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

export const partnerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logo_url: z.string().optional(),
  website_url: z.string().optional(),
  partner_type: z.string().optional(),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

export const userRoleFormSchema = z.object({
  user_id: z.string().min(1, "User is required"),
  role: z.enum(["super_admin", "admin", "editor", "viewer"]),
  is_active: z.boolean().default(true),
});

/**
 * Short-name aliases used by form/action modules across the admin panel.
 */
export const pageSchema = pageFormSchema;
export const projectSchema = projectFormSchema;
export const postSchema = postFormSchema;
export const resourceSchema = resourceFormSchema;
export const teamMemberSchema = teamMemberFormSchema;
export const partnerSchema = partnerFormSchema;
export const userRoleSchema = userRoleFormSchema;

export type PageFormValues = z.infer<typeof pageFormSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema> & {
  thematic_area_ids?: string[];
};
export type PostFormValues = z.infer<typeof postFormSchema>;
export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
export type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;
export type PartnerFormValues = z.infer<typeof partnerFormSchema>;
export type UserRoleFormValues = z.infer<typeof userRoleFormSchema>;
