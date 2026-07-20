import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImpactMetrics, getImpactStories } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "Impact",
  description:
    "How TPi's work translates into measurable change for communities, institutions and cities across Tanzania.",
  path: "/impact",
});

export default async function ImpactPage() {
  const [metrics, stories] = await Promise.all([
    getImpactMetrics(),
    getImpactStories(),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Impact", path: "/impact" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy py-28 text-white lg:py-36">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">Our Impact</span>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl">
            Change is visible in people, communities and institutions.
          </h1>
          <p className="body-large mt-6 max-w-2xl text-white/80">
            We measure success not by activities delivered, but by the lasting
            difference our work makes in the lives of urban residents.
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section id="metrics" className="scroll-mt-28 bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <h2 className="heading-display text-center text-3xl text-navy md:text-4xl">
            Impact in numbers
          </h2>
          {metrics.length === 0 ? (
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-text">
                Verified impact figures will be published here once confirmed.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="rounded-2xl bg-soft-bg p-8 text-center"
                >
                  <p className="heading-display text-4xl text-navy md:text-5xl">
                    {metric.value}
                  </p>
                  <p className="mt-2 font-semibold text-body">{metric.label}</p>
                  {metric.description && (
                    <p className="mt-2 text-sm text-muted-text">
                      {metric.description}
                    </p>
                  )}
                  {metric.reporting_period && (
                    <p className="mt-3 text-xs uppercase tracking-wider text-muted-text">
                      {metric.reporting_period}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Success stories */}
      <section id="stories" className="scroll-mt-28 bg-soft-bg py-20 lg:py-28">
        <div className="container-tpi">
          <h2 className="heading-display text-3xl text-navy md:text-4xl">
            Success stories
          </h2>
          <p className="mt-3 max-w-2xl text-body/80">
            Real change, told through the people and places at the heart of our
            work.
          </p>

          {stories.length === 0 ? (
            <div className="mt-12 rounded-2xl bg-white py-16 text-center">
              <p className="text-muted-text">
                Success stories will appear here once published.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {stories.map((story) => {
                const area = (
                  story as unknown as {
                    thematic_area?: { name: string; slug: string } | null;
                  }
                ).thematic_area;
                return (
                  <article
                    key={story.id}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border/60 transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={story.featured_image_url || "/tpi-image-2.jpeg"}
                        alt={story.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {story.location && (
                        <div className="flex items-center gap-2 text-sm text-muted-text">
                          <MapPin className="h-3.5 w-3.5" />
                          {story.location}
                        </div>
                      )}
                      <h3 className="heading-display mt-2 text-xl text-navy">
                        {story.title}
                      </h3>
                      {story.excerpt && (
                        <p className="mt-3 line-clamp-3 flex-1 text-sm text-body/80">
                          {story.excerpt}
                        </p>
                      )}
                      {area && (
                        <Badge
                          variant="outline"
                          className="mt-4 w-fit border-navy/20 text-navy"
                        >
                          {area.name}
                        </Badge>
                      )}
                      <div className="mt-6 pt-4">
                        <Button
                          asChild
                          variant="ghost"
                          className="p-0 text-navy hover:bg-transparent hover:text-urban-blue"
                        >
                          <Link href={`/impact/${story.slug}`}>
                            Read story
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
