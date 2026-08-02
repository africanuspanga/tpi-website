import Link from "next/link";
import { getBlock } from "@/lib/content";
import type { PageHeroContent } from "@/components/sections/PageHero";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import type { Post } from "@/types/supabase";

export const metadata = buildMetadata({
  title: "Events",
  description:
    "News, upcoming and past events, jobs and adverts from TPi Tanzania's work on inclusive urban development.",
  path: "/events",
});

const sections = [
  { id: "news", label: "News" },
  { id: "upcoming", label: "Upcoming Events" },
  { id: "past", label: "Past Events" },
  { id: "jobs", label: "Jobs & Adverts" },
];

function formatDate(date?: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function PostCard({ post }: { post: Post }) {
  const date = formatDate(post.event_date || post.published_at);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-soft-bg ring-1 ring-border/60 transition-shadow hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.featured_image_url || "/tpi-image-3.jpeg"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-text">
          {date && (
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </span>
          )}
          {post.location && (
            <span className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              {post.location}
            </span>
          )}
        </div>
        <h3 className="heading-display mt-2 text-xl text-navy">{post.title}</h3>
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
  );
}

function EventSection({
  id,
  label,
  posts,
  emptyText,
}: {
  id: string;
  label: string;
  posts: Post[];
  emptyText: string;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="mb-8 flex items-center gap-4">
        <h2 className="heading-display text-2xl text-navy md:text-3xl">
          {label}
        </h2>
        <span className="h-px flex-1 bg-border" />
      </div>
      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-12 text-center">
          <p className="text-muted-text">{emptyText}</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function EventsPage() {
  const posts = await getPosts();
  const now = new Date();

  const news = posts.filter(
    (p) => p.post_type === "news" || p.post_type === "insight"
  );
  const events = posts.filter((p) => p.post_type === "event");
  const upcoming = events.filter(
    (p) => p.event_date && new Date(p.event_date) >= now
  );
  const past = events.filter(
    (p) => !p.event_date || new Date(p.event_date) < now
  );
  const jobs = posts.filter((p) => p.post_type === "announcement");

  const hero = await getBlock<PageHeroContent>("events", "hero");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
        ]}
      />

      <section className="bg-navy py-28 text-white lg:py-36">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">{hero.eyebrow}</span>
          <h1 className="heading-display text-4xl text-white md:text-5xl lg:text-6xl">{hero.heading}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{hero.body}</p>

          {/* Quick section navigation */}
          <div className="mt-10 flex flex-wrap gap-2">
            {sections.map((s) => (
              <Link
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-white/25 px-4 py-1.5 text-sm text-white/80 transition-colors hover:border-gold hover:text-gold"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-white py-20 lg:py-28">
        <div className="container-tpi space-y-20">
          <EventSection
            id="news"
            label="News"
            posts={news}
            emptyText="No news has been published yet."
          />
          <EventSection
            id="upcoming"
            label="Upcoming Events"
            posts={upcoming}
            emptyText="No upcoming events are scheduled right now — check back soon."
          />
          <EventSection
            id="past"
            label="Past Events"
            posts={past}
            emptyText="Past events will be listed here."
          />
          <EventSection
            id="jobs"
            label="Jobs & Adverts"
            posts={jobs}
            emptyText="There are no open positions or adverts at the moment."
          />
        </div>
      </div>
    </>
  );
}
