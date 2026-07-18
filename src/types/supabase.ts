export type AppRole = "super_admin" | "admin" | "editor" | "viewer";

export type ContentStatus = "draft" | "published" | "archived";

export type ProjectStatus = "planned" | "active" | "completed" | "on_hold";

export type MessageStatus = "new" | "in_progress" | "resolved" | "spam";

export type ResourceKind =
  | "report"
  | "policy_brief"
  | "research"
  | "toolkit"
  | "case_study"
  | "video"
  | "other";

export type PostType = "news" | "insight" | "event" | "announcement";

export interface Profile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  job_title: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  user_id: string;
  role: AppRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: unknown;
  is_public: boolean;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  parent_id: string | null;
  label: string;
  url: string;
  location: string;
  sort_order: number;
  opens_new_tab: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  page_type: string;
  excerpt: string | null;
  content: string | null;
  hero_image_url: string | null;
  status: ContentStatus;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  section_key: string;
  section_type: string;
  eyebrow: string | null;
  heading: string | null;
  body: string | null;
  image_url: string | null;
  content: Record<string, unknown>;
  sort_order: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

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

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  location: string | null;
  project_status: ProjectStatus;
  publication_status: ContentStatus;
  start_date: string | null;
  end_date: string | null;
  hero_image_url: string | null;
  gallery: string[];
  partners: { name: string; logo_url?: string; website_url?: string }[];
  sdgs: string[];
  is_featured: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  thematic_areas?: ThematicArea[];
}

export interface ImpactMetric {
  id: string;
  value: string;
  label: string;
  description: string | null;
  reporting_period: string | null;
  source: string | null;
  icon_name: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  location: string | null;
  featured_image_url: string | null;
  project_id: string | null;
  thematic_area_id: string | null;
  status: ContentStatus;
  is_featured: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  full_name: string;
  position: string;
  biography: string | null;
  photo_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  partner_type: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  post_type: PostType;
  excerpt: string | null;
  body: string | null;
  featured_image_url: string | null;
  author_name: string | null;
  event_date: string | null;
  location: string | null;
  status: ContentStatus;
  is_featured: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  resource_type: ResourceKind;
  file_url: string | null;
  external_url: string | null;
  cover_image_url: string | null;
  publication_year: number | null;
  author: string | null;
  language: string;
  status: ContentStatus;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  person_name: string;
  organization: string | null;
  position: string | null;
  photo_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  file_name: string;
  file_url: string;
  storage_path: string | null;
  mime_type: string | null;
  file_size: number | null;
  alt_text: string | null;
  caption: string | null;
  folder: string | null;
  is_public: boolean;
  uploaded_by: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  enquiry_type: string | null;
  subject: string;
  message: string;
  consent_given: boolean;
  status: MessageStatus;
  admin_notes: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  created_at: string;
}
