import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/lib/seo/json-ld";
import { Calendar, MapPin, ArrowLeft, User } from "lucide-react";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const typeLabels: Record<string, string> = {
  news: "News",
  insight: "Insight",
  event: "Event",
  announcement: "Announcement",
};

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || undefined,
    ogImage: post.featured_image_url || undefined,
    path: `/news/${slug}`,
    type: "article",
    publishedAt: post.published_at,
    modifiedAt: post.updated_at,
  });
}

function formatDate(date?: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const displayDate = formatDate(post.published_at || post.event_date);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "News & Insights", path: "/news" },
          { name: post.title, path: `/news/${slug}` },
        ]}
      />
      {post.published_at && (
        <ArticleJsonLd
          title={post.title}
          description={post.excerpt || post.title}
          slug={`/news/${slug}`}
          publishedAt={post.published_at}
          modifiedAt={post.updated_at}
          imageUrl={post.featured_image_url || undefined}
          authorName={post.author_name || undefined}
        />
      )}

      <article>
        <section className="bg-navy py-24 text-white lg:py-28">
          <div className="container-tpi">
            <Button
              asChild
              variant="ghost"
              className="mb-6 p-0 text-white/80 hover:bg-transparent hover:text-gold"
            >
              <Link href="/news">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All articles
              </Link>
            </Button>
            <Badge className="mb-4 bg-gold text-navy hover:bg-gold">
              {typeLabels[post.post_type] || post.post_type}
            </Badge>
            <h1 className="heading-display max-w-4xl text-3xl text-white md:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-white/80">
              {displayDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold" />
                  {displayDate}
                </span>
              )}
              {post.author_name && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gold" />
                  {post.author_name}
                </span>
              )}
              {post.location && (
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gold" />
                  {post.location}
                </span>
              )}
            </div>
          </div>
        </section>

        {post.featured_image_url && (
          <div className="bg-white">
            <div className="container-tpi -mt-12 lg:-mt-16">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        )}

        <section className="bg-white py-16 lg:py-20">
          <div className="container-tpi">
            <div className="mx-auto max-w-3xl">
              {post.excerpt && (
                <p className="body-large text-body/90">{post.excerpt}</p>
              )}
              {post.body ? (
                <div
                  className="prose prose-lg mt-8 max-w-none text-body/80"
                  dangerouslySetInnerHTML={{ __html: post.body }}
                />
              ) : (
                <p className="mt-8 text-body/70">
                  The full article will appear here once published.
                </p>
              )}
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
