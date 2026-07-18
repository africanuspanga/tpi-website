import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFeaturedProjects } from "@/lib/data/queries";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

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

export async function FeaturedProjects() {
  const projects = await getFeaturedProjects(3);

  return (
    <section className="bg-soft-bg py-20 lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow="Our Work"
          heading="Our Work in Action"
          body="Community-led solutions for complex urban challenges."
        />

        {projects.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-white py-16 text-center">
            <p className="text-muted-text">
              Projects will appear here once published.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const projectThemes = (project as unknown as { project_themes?: { thematic_area: { name: string; slug: string; accent_color: string | null } }[] }).project_themes;
              const theme = projectThemes?.[0]?.thematic_area;
              return (
                <article
                  key={project.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border/60 transition-shadow hover:shadow-lg"
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
                    <h3 className="heading-display mt-2 text-xl text-navy md:text-2xl">
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
  );
}
