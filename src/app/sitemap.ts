import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tpi.or.tz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [
    pages,
    thematicAreas,
    projects,
    posts,
    resources,
    impactStories,
  ] = await Promise.all([
    supabase.from("pages").select("slug, updated_at").eq("status", "published"),
    supabase
      .from("thematic_areas")
      .select("slug, updated_at")
      .eq("is_active", true),
    supabase
      .from("projects")
      .select("slug, updated_at")
      .eq("publication_status", "published"),
    supabase.from("posts").select("slug, updated_at").eq("status", "published"),
    supabase
      .from("resources")
      .select("slug, updated_at")
      .eq("status", "published"),
    supabase
      .from("impact_stories")
      .select("slug, updated_at")
      .eq("status", "published"),
  ]);

  const routes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/what-we-do`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/impact`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/news`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/resources`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/partners`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/get-involved`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms-of-use`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const addRoutes = (
    items: { slug: string; updated_at?: string | null }[] | null,
    path: string,
    priority: number
  ) => {
    if (!items) return;
    for (const item of items) {
      routes.push({
        url: `${siteUrl}${path}/${item.slug}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
        changeFrequency: "monthly",
        priority,
      });
    }
  };

  // CMS-managed standard pages, excluding slugs that already have dedicated routes.
  const reservedSlugs = new Set(["home", "about"]);
  addRoutes(
    pages.data?.filter((p) => !reservedSlugs.has(p.slug)) || null,
    "",
    0.7
  );
  addRoutes(thematicAreas.data, "/what-we-do", 0.7);
  addRoutes(projects.data, "/projects", 0.7);
  addRoutes(posts.data, "/news", 0.6);
  addRoutes(resources.data, "/resources", 0.6);
  addRoutes(impactStories.data, "/impact", 0.6);

  return routes;
}
