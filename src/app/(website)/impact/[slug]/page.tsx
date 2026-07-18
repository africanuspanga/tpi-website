import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getImpactStoryBySlug } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/lib/seo/json-ld";
import { MapPin, ArrowLeft } from "lucide-react";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getImpactStoryBySlug(slug);
  if (!story) return {};
  return buildMetadata({
    title: story.seo_title || story.title,
    description: story.seo_description || story.excerpt || undefined,
    ogImage: story.featured_image_url || undefined,
    path: `/impact/${slug}`,
    type: "article",
    publishedAt: story.published_at,
  });
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getImpactStoryBySlug(slug);
  if (!story) notFound();

  const area = (
    story as unknown as { thematic_area?: { name: string; slug: string } | null }
  ).thematic_area;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Impact", path: "/impact" },
          { name: story.title, path: `/impact/${slug}` },
        ]}
      />
      {story.published_at && (
        <ArticleJsonLd
          title={story.title}
          description={story.excerpt || story.title}
          slug={`/impact/${slug}`}
          publishedAt={story.published_at}
          modifiedAt={story.updated_at}
          imageUrl={story.featured_image_url || undefined}
        />
      )}

      <article>
        {/* Hero */}
        <section className="relative bg-navy text-white">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={story.featured_image_url || "/tpi-image-2.jpeg"}
              alt={story.title}
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
              <Link href="/impact">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All stories
              </Link>
            </Button>
            {area && (
              <Badge className="mb-4 bg-white/95 text-navy hover:bg-white">
                {area.name}
              </Badge>
            )}
            <h1 className="heading-display max-w-4xl text-4xl md:text-5xl lg:text-6xl">
              {story.title}
            </h1>
            {story.location && (
              <div className="mt-6 flex items-center gap-2 text-white/80">
                <MapPin className="h-4 w-4 text-gold" />
                {story.location}
              </div>
            )}
          </div>
        </section>

        {/* Body */}
        <section className="bg-white py-20 lg:py-28">
          <div className="container-tpi">
            <div className="mx-auto max-w-3xl">
              {story.excerpt && (
                <p className="body-large text-body/90">{story.excerpt}</p>
              )}
              {story.body ? (
                <div
                  className="prose prose-lg mt-8 max-w-none text-body/80"
                  dangerouslySetInnerHTML={{ __html: story.body }}
                />
              ) : (
                <p className="mt-8 text-body/70">
                  The full story will appear here once published.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-soft-bg py-16 lg:py-20">
          <div className="container-tpi text-center">
            <Button asChild className="bg-navy px-8 text-white hover:bg-navy/90">
              <Link href="/impact">Explore more stories</Link>
            </Button>
          </div>
        </section>
      </article>
    </>
  );
}
