import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getFeaturedImpactStories } from "@/lib/data/queries";
import { MapPin, ArrowRight } from "lucide-react";

export async function SuccessStories() {
  const stories = await getFeaturedImpactStories(3);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow="Stories of Change"
          heading="Change is visible in people, communities and institutions."
          body="Real stories from the neighbourhoods and partnerships where TPi works."
        />

        {stories.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="text-muted-text">Stories will appear here once published.</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => {
              const themeArea = (
                story as unknown as {
                  thematic_area?: { name: string; slug: string } | null;
                }
              ).thematic_area;
              return (
              <article
                key={story.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-soft-bg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={story.featured_image_url || "/tpi-image-3.jpeg"}
                    alt={story.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-text">
                    <MapPin className="h-3.5 w-3.5" />
                    {story.location || "Tanzania"}
                  </div>
                  {themeArea && (
                    <Badge variant="secondary" className="mt-3 w-fit">
                      {themeArea.name}
                    </Badge>
                  )}
                  <h3 className="heading-display mt-3 text-xl text-navy">
                    {story.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm text-body/80">
                    {story.excerpt || "A story of change from TPi's work."}
                  </p>
                  <div className="mt-6">
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
  );
}
