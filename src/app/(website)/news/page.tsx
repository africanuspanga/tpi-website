import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPosts } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "News & Insights",
  description:
    "News, insights, events and announcements from TPi Tanzania's work on inclusive urban development.",
  path: "/news",
});

const postTypes = [
  { key: "news", label: "News" },
  { key: "insight", label: "Insights" },
  { key: "event", label: "Events" },
  { key: "announcement", label: "Announcements" },
];

function typeLabel(type: string) {
  return postTypes.find((t) => t.key === type)?.label || type;
}

function formatDate(date?: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsPage(props: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await props.searchParams;
  const posts = await getPosts(type);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "News & Insights", path: "/news" },
        ]}
      />

      <section className="bg-navy py-28 text-white lg:py-36">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">
            News &amp; Insights
          </span>
          <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl">
            Stories, ideas and updates.
          </h1>
          <p className="body-large mt-6 max-w-2xl text-white/80">
            Follow our latest news, field insights, events and organizational
            announcements.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          {/* Filters */}
          <div className="mb-12 flex flex-wrap gap-2">
            <Link
              href="/news"
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                !type
                  ? "border-navy bg-navy text-white"
                  : "border-border text-body hover:border-navy"
              )}
            >
              All
            </Link>
            {postTypes.map((t) => (
              <Link
                key={t.key}
                href={`/news?type=${t.key}`}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  type === t.key
                    ? "border-navy bg-navy text-white"
                    : "border-border text-body hover:border-navy"
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-text">
                No articles have been published yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-soft-bg ring-1 ring-border/60 transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.featured_image_url || "/TPI IMAGE 3.jpeg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <Badge className="absolute left-4 top-4 bg-white/95 text-navy hover:bg-white">
                      {typeLabel(post.post_type)}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {formatDate(post.published_at || post.event_date) && (
                      <div className="flex items-center gap-2 text-sm text-muted-text">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(post.published_at || post.event_date)}
                      </div>
                    )}
                    <h3 className="heading-display mt-2 text-xl text-navy">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 flex-1 text-sm text-body/80">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-6 pt-4">
                      <Button
                        asChild
                        variant="ghost"
                        className="p-0 text-navy hover:bg-transparent hover:text-urban-blue"
                      >
                        <Link href={`/news/${post.slug}`}>
                          Read more
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
