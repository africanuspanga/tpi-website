import { createClient } from "@/lib/supabase/server";
import type {
  ThematicArea,
  ThematicFocusItem,
  Project,
  ImpactMetric,
  ImpactStory,
  Partner,
  Post,
  Resource,
  TeamMember,
  Testimonial,
  Page,
  PageSection,
  SiteSetting,
  NavigationItem,
} from "@/types/supabase";

/**
 * Public data access layer.
 *
 * Every query is resilient: if the backend is unreachable or returns an error,
 * list queries resolve to an empty array and single-item queries resolve to
 * null. This keeps the public site rendering its designed empty states rather
 * than throwing — the intended behaviour before TPi publishes real content.
 */

async function safeList<T>(
  build: (
    supabase: Awaited<ReturnType<typeof createClient>>
  ) => PromiseLike<{ data: unknown; error: unknown }>
): Promise<T[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await build(supabase);
    if (error) return [];
    return (data as T[]) ?? [];
  } catch {
    return [];
  }
}

async function safeOne<T>(
  build: (
    supabase: Awaited<ReturnType<typeof createClient>>
  ) => PromiseLike<{ data: unknown; error: unknown }>
): Promise<T | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await build(supabase);
    if (error) return null;
    return (data as T) ?? null;
  } catch {
    return null;
  }
}

const PROJECT_SELECT =
  "*, project_themes(thematic_area:thematic_area_id(name, slug, accent_color))";

export function getPublishedPages() {
  return safeList<Page>((s) =>
    s.from("pages").select("*").eq("status", "published").order("title")
  );
}

export function getPageBySlug(slug: string) {
  return safeOne<Page>((s) =>
    s
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
  );
}

export function getPageSections(pageId: string) {
  return safeList<PageSection>((s) =>
    s
      .from("page_sections")
      .select("*")
      .eq("page_id", pageId)
      .eq("is_enabled", true)
      .order("sort_order")
  );
}

export function getThematicAreas() {
  return safeList<ThematicArea>((s) =>
    s
      .from("thematic_areas")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
  );
}

export function getThematicAreaBySlug(slug: string) {
  return safeOne<ThematicArea>((s) =>
    s
      .from("thematic_areas")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single()
  );
}

export function getFocusItems(thematicAreaId: string) {
  return safeList<ThematicFocusItem>((s) =>
    s
      .from("thematic_focus_items")
      .select("*")
      .eq("thematic_area_id", thematicAreaId)
      .eq("is_active", true)
      .order("sort_order")
  );
}

export function getFeaturedProjects(limit = 3) {
  return safeList<Project>((s) =>
    s
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("publication_status", "published")
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(limit)
  );
}

export function getProjects() {
  return safeList<Project>((s) =>
    s
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("publication_status", "published")
      .order("published_at", { ascending: false })
  );
}

export function getProjectBySlug(slug: string) {
  return safeOne<Project>((s) =>
    s
      .from("projects")
      .select(PROJECT_SELECT)
      .eq("slug", slug)
      .eq("publication_status", "published")
      .single()
  );
}

export function getImpactMetrics() {
  return safeList<ImpactMetric>((s) =>
    s
      .from("impact_metrics")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
  );
}

export function getFeaturedImpactStories(limit = 3) {
  return safeList<ImpactStory>((s) =>
    s
      .from("impact_stories")
      .select("*, thematic_area:thematic_area_id(name, slug)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit)
  );
}

export function getImpactStories() {
  return safeList<ImpactStory>((s) =>
    s
      .from("impact_stories")
      .select("*, thematic_area:thematic_area_id(name, slug)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
  );
}

export function getImpactStoryBySlug(slug: string) {
  return safeOne<ImpactStory>((s) =>
    s
      .from("impact_stories")
      .select("*, thematic_area:thematic_area_id(name, slug)")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
  );
}

export function getActivePartners() {
  return safeList<Partner>((s) =>
    s.from("partners").select("*").eq("is_active", true).order("sort_order")
  );
}

export function getPosts(type?: string) {
  return safeList<Post>((s) => {
    let query = s
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (type) query = query.eq("post_type", type);
    return query;
  });
}

export function getPostBySlug(slug: string) {
  return safeOne<Post>((s) =>
    s
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
  );
}

export function getResources(type?: string) {
  return safeList<Resource>((s) => {
    let query = s
      .from("resources")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (type) query = query.eq("resource_type", type);
    return query;
  });
}

export function getResourceBySlug(slug: string) {
  return safeOne<Resource>((s) =>
    s
      .from("resources")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single()
  );
}

export function getActiveTeamMembers() {
  return safeList<TeamMember>((s) =>
    s
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
  );
}

export function getPublishedTestimonials() {
  return safeList<Testimonial>((s) =>
    s
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order")
  );
}

export function getPublicSettings() {
  return safeList<SiteSetting>((s) =>
    s.from("site_settings").select("*").eq("is_public", true)
  );
}

export function getNavigation(location = "header") {
  return safeList<NavigationItem>((s) =>
    s
      .from("navigation_items")
      .select("*")
      .eq("is_active", true)
      .eq("location", location)
      .order("sort_order")
  );
}
