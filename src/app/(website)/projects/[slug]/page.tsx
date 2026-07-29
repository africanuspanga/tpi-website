import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProjectBySlug } from "@/lib/data/queries";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import { MapPin, Calendar, ArrowLeft, ExternalLink } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.seo_title || project.title,
    description: project.seo_description || project.summary || undefined,
    ogImage: project.hero_image_url || undefined,
    path: `/projects/${slug}`,
  });
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    active: "Active",
    completed: "Completed",
    planned: "Planned",
    on_hold: "On hold",
  };
  return map[status] || status;
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

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const themes =
    (project as unknown as {
      project_themes?: { thematic_area: { name: string; slug: string } }[];
    }).project_themes?.map((pt) => pt.thematic_area) ?? [];
  const period = formatPeriod(project.start_date, project.end_date);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${slug}` },
        ]}
      />

      {/* Hero */}
      <section className="relative bg-navy text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={project.hero_image_url || "/tpi-image-1.jpeg"}
            alt={project.title}
            fill
            sizes="100vw"
            className="object-cover opacity-25"
            priority
          />
        </div>
        <div className="container-tpi relative z-10 py-28 lg:py-36">
          <Button
            asChild
            variant="ghost"
            className="mb-6 p-0 text-white/80 hover:bg-transparent hover:text-gold"
          >
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All projects
            </Link>
          </Button>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <Badge key={t.slug} className="bg-white/95 text-navy hover:bg-white">
                {t.name}
              </Badge>
            ))}
            <Badge className={cn("", statusVariant(project.project_status))}>
              {statusLabel(project.project_status)}
            </Badge>
          </div>
          <h1 className="heading-display mt-6 max-w-4xl text-4xl text-white md:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-6 text-white/80">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" />
              {project.location || "Tanzania"}
            </span>
            {period && (
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold" />
                {period}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {project.summary && (
                <p className="body-large text-body/90">{project.summary}</p>
              )}
              {project.description ? (
                <div
                  className="prose prose-lg mt-8 max-w-none text-body/80"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(project.description) }}
                />
              ) : (
                <p className="mt-8 text-body/70">
                  A detailed description of this project will appear here once
                  published.
                </p>
              )}

              {/* Gallery */}
              {project.gallery?.length > 0 && (
                <div className="mt-12 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl"
                    >
                      <Image
                        src={src}
                        alt={`${project.title} — image ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="rounded-2xl bg-soft-bg p-6">
                <h3 className="heading-display text-lg text-navy">
                  Project details
                </h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-muted-text">Status</dt>
                    <dd className="font-medium text-body">
                      {statusLabel(project.project_status)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-text">Location</dt>
                    <dd className="font-medium text-body">
                      {project.location || "Tanzania"}
                    </dd>
                  </div>
                  {period && (
                    <div>
                      <dt className="text-muted-text">Period</dt>
                      <dd className="font-medium text-body">{period}</dd>
                    </div>
                  )}
                  {themes.length > 0 && (
                    <div>
                      <dt className="text-muted-text">Thematic areas</dt>
                      <dd className="font-medium text-body">
                        {themes.map((t) => t.name).join(", ")}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {project.partners?.length > 0 && (
                <div className="rounded-2xl bg-soft-bg p-6">
                  <h3 className="heading-display text-lg text-navy">Partners</h3>
                  <ul className="mt-4 space-y-3">
                    {project.partners.map((partner, i) => (
                      <li key={i} className="text-sm text-body/80">
                        {partner.website_url ? (
                          <a
                            href={partner.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-urban-blue"
                          >
                            {partner.name}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          partner.name
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.sdgs?.length > 0 && (
                <div className="rounded-2xl bg-soft-bg p-6">
                  <h3 className="heading-display text-lg text-navy">
                    SDG alignment
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.sdgs.map((sdg) => (
                      <Badge key={sdg} variant="outline" className="border-navy/20">
                        {sdg}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20 text-white lg:py-28">
        <div className="container-tpi text-center">
          <h2 className="heading-display text-3xl text-white md:text-4xl">
            Interested in this work?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Partner with TPi to strengthen communities and institutions across
            Tanzania.
          </p>
          <Button asChild className="mt-8 bg-gold px-8 text-navy hover:bg-gold/90">
            <Link href="/get-involved">Become a Partner</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
