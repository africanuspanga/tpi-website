import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getThematicAreaBySlug,
  getFocusItems,
  getProjects,
} from "@/lib/data/queries";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ThematicAreaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ThematicAreaPageProps) {
  const { slug } = await params;
  const area = await getThematicAreaBySlug(slug);
  if (!area) return {};
  return buildMetadata({
    title: area.seo_title || area.name,
    description:
      area.seo_description || area.short_description || undefined,
    path: `/what-we-do/${slug}`,
  });
}

function accentColorClass(accent?: string | null) {
  switch (accent) {
    case "urban-blue":
      return "bg-urban-blue";
    case "poverty-green":
      return "bg-poverty-green";
    case "climate-gold":
      return "bg-climate-gold";
    case "bright-blue":
      return "bg-bright-blue";
    case "gold":
      return "bg-gold";
    default:
      return "bg-urban-blue";
  }
}

export default async function ThematicAreaPage({
  params,
}: ThematicAreaPageProps) {
  const { slug } = await params;
  const area = await getThematicAreaBySlug(slug);
  if (!area) notFound();

  const [focusItems, allProjects] = await Promise.all([
    getFocusItems(area.id),
    getProjects(),
  ]);

  const relatedProjects = allProjects.filter((project) =>
    project.thematic_areas?.some((theme) => theme.slug === slug)
  );

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "What We Do", path: "/what-we-do" },
          { name: area.name, path: `/what-we-do/${slug}` },
        ]}
      />

      {/* Hero */}
      <section className="relative bg-navy py-28 text-white lg:py-36">
        <div className="absolute inset-0 overflow-hidden">
          {area.hero_image_url ? (
            <Image
              src={area.hero_image_url}
              alt={area.name}
              fill
              sizes="100vw"
              className="object-cover opacity-20"
            />
          ) : (
            <div className="absolute inset-0 bg-[url('/tpi-image-1.jpeg')] bg-cover bg-center opacity-20" />
          )}
        </div>
        <div className="container-tpi relative z-10">
          <Badge
            className={cn(
              "mb-6 text-white",
              accentColorClass(area.accent_color)
            )}
          >
            Thematic Area
          </Badge>
          <h1 className="heading-display max-w-3xl text-4xl text-white md:text-5xl lg:text-6xl">
            {area.name}
          </h1>
          {area.short_description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              {area.short_description}
            </p>
          )}
        </div>
      </section>

      {/* Description */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <div className="mx-auto max-w-3xl">
            {area.description ? (
              <div
                className="prose prose-lg max-w-none text-body/80"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(area.description) }}
              />
            ) : (
              <p className="text-lg text-body/80">
                Detailed description for this thematic area will appear here once
                published.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Focus areas */}
      <section className="bg-soft-bg py-20 lg:py-28">
        <div className="container-tpi">
          <h2 className="heading-display text-center text-3xl text-navy md:text-4xl">
            Focus Areas
          </h2>

          {focusItems.length === 0 ? (
            <div className="mt-12 rounded-2xl bg-white py-16 text-center">
              <p className="text-muted-text">
                Focus areas will appear here once published.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {focusItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white p-8 ring-1 ring-border/60"
                >
                  <h3 className="heading-display text-xl text-navy">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-3 text-body/80">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="bg-white py-20 lg:py-28">
          <div className="container-tpi">
            <h2 className="heading-display text-3xl text-navy md:text-4xl">
              Related Projects
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl bg-soft-bg p-6 ring-1 ring-border/60"
                >
                  <h3 className="heading-display text-xl text-navy">
                    {project.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-body/80">
                    {project.summary || ""}
                  </p>
                  <Button
                    asChild
                    variant="ghost"
                    className="mt-4 p-0 text-navy hover:bg-transparent hover:text-urban-blue"
                  >
                    <Link href={`/projects/${project.slug}`}>
                      Read project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-navy py-20 text-white lg:py-28">
        <div className="container-tpi text-center">
          <h2 className="heading-display text-3xl text-white md:text-4xl">
            Partner with us on {area.name.toLowerCase()}
          </h2>
          <Button
            asChild
            className="mt-8 bg-gold px-8 text-navy hover:bg-gold/90"
          >
            <Link href="/get-involved">Become a Partner</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
