import Link from "next/link";
import { getBlock } from "@/lib/content";
import type { PageHeroContent } from "@/components/sections/PageHero";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProjects, getThematicAreas } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "Projects",
  description:
    "Browse TPi Tanzania's portfolio of inclusive urban development projects.",
  path: "/projects",
});

function statusLabel(status: string) {
  switch (status) {
    case "active":
      return "Active";
    case "completed":
      return "Completed";
    case "planned":
      return "Planned";
    case "on_hold":
      return "On hold";
    default:
      return status;
  }
}

function statusVariant(status: string) {
  switch (status) {
    case "active":
      return "bg-poverty-green text-white";
    case "completed":
      return "bg-navy text-white";
    case "planned":
      return "bg-gold text-navy";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function formatPeriod(start?: string | null, end?: string | null) {
  if (!start && !end) return null;
  const s = start ? new Date(start).getFullYear() : "";
  const e = end ? new Date(end).getFullYear() : "Present";
  return `${s}–${e}`;
}

export default async function ProjectsPage(props: {
  searchParams: Promise<{ area?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const [projects, areas] = await Promise.all([
    getProjects(),
    getThematicAreas(),
  ]);

  const filtered = projects.filter((project) => {
    const matchesArea =
      !searchParams.area ||
      project.thematic_areas?.some((t) => t.slug === searchParams.area);
    const matchesStatus =
      !searchParams.status || project.project_status === searchParams.status;
    return matchesArea && matchesStatus;
  });

  const hero = await getBlock<PageHeroContent>("projects", "hero");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ]}
      />

      <section className="bg-navy py-28 text-white lg:py-36">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">{hero.eyebrow}</span>
          <h1 className="heading-display text-4xl text-white md:text-5xl lg:text-6xl">{hero.heading}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{hero.body}</p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          {/* Filters */}
          <div className="mb-12 flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-text">
                Thematic area
              </label>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/projects"
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm transition-colors",
                    !searchParams.area
                      ? "border-navy bg-navy text-white"
                      : "border-border text-body hover:border-navy"
                  )}
                >
                  All
                </Link>
                {areas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/projects?area=${area.slug}${
                      searchParams.status ? `&status=${searchParams.status}` : ""
                    }`}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm transition-colors",
                      searchParams.area === area.slug
                        ? "border-navy bg-navy text-white"
                        : "border-border text-body hover:border-navy"
                    )}
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-text">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {["active", "completed", "planned", "on_hold"].map((status) => (
                  <Link
                    key={status}
                    href={`/projects?${
                      searchParams.area ? `area=${searchParams.area}&` : ""
                    }status=${status}`}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm capitalize transition-colors",
                      searchParams.status === status
                        ? "border-navy bg-navy text-white"
                        : "border-border text-body hover:border-navy"
                    )}
                  >
                    {statusLabel(status)}
                  </Link>
                ))}
                {searchParams.status && (
                  <Link
                    href={`/projects${
                      searchParams.area ? `?area=${searchParams.area}` : ""
                    }`}
                    className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-text hover:border-navy"
                  >
                    Clear status
                  </Link>
                )}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-text">
                No projects match the selected filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => {
                const theme = project.thematic_areas?.[0];
                return (
                  <article
                    key={project.id}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-soft-bg ring-1 ring-border/60 transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={project.hero_image_url || "/tpi-image-1.jpeg"}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        {theme && (
                          <Badge className="bg-white/95 text-navy hover:bg-white/95">
                            {theme.name}
                          </Badge>
                        )}
                        <Badge className={cn("", statusVariant(project.project_status))}>
                          {statusLabel(project.project_status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-text">
                        <MapPin className="h-3.5 w-3.5" />
                        {project.location || "Tanzania"}
                      </div>
                      <h3 className="heading-display mt-2 text-xl text-navy">
                        {project.title}
                      </h3>
                      <p className="mt-3 line-clamp-3 flex-1 text-sm text-body/80">
                        {project.summary || "A TPi project advancing inclusive cities."}
                      </p>
                      {formatPeriod(project.start_date, project.end_date) && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-text">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatPeriod(project.start_date, project.end_date)}
                        </div>
                      )}
                      <div className="mt-6 pt-4">
                        <Button
                          asChild
                          variant="ghost"
                          className="p-0 text-navy hover:bg-transparent hover:text-urban-blue"
                        >
                          <Link href={`/projects/${project.slug}`}>
                            Read project
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
