import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Clock, ArrowRight, ArrowUpRight } from "lucide-react";

const posts = [
  {
    category: "Insight",
    title: "Why participatory planning changes who a city works for",
    excerpt:
      "When residents help shape the plan, priorities shift from prestige projects to the drainage, water and land tenure that everyday life depends on.",
    image: "/community-development-meeting.jpg",
    readTime: "3 min read",
    accent: "text-urban-blue",
  },
  {
    category: "Climate",
    title: "Building climate resilience from the neighbourhood up",
    excerpt:
      "Coastal Dar es Salaam faces rising flood risk. Community-led adaptation shows how resilience can be practical, affordable and locally owned.",
    image: "/climate-resilience.jpg",
    readTime: "3 min read",
    accent: "text-climate-gold",
  },
  {
    category: "Livelihoods",
    title: "Backing women and youth entrepreneurs in urban Tanzania",
    excerpt:
      "Financial inclusion and skills are lifting small businesses in informal settlements — and reshaping who gets to build the urban economy.",
    image: "/women-entrepreneurs.jpg",
    readTime: "3 min read",
    accent: "text-poverty-green",
  },
];

export function BlogHighlights() {
  return (
    <section className="bg-soft-bg py-20 lg:py-28">
      <div className="container-tpi">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Latest Insights"
            heading="Ideas and stories from the field."
            body="Short reads on inclusive cities, climate resilience and the people driving change."
            className="mb-0"
          />
          <Button
            asChild
            variant="outline"
            className="hidden shrink-0 border-navy text-navy hover:bg-navy hover:text-white md:inline-flex"
          >
            <Link href="/news">
              View all insights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.title} delay={index * 0.1}>
              <Link
                href="/news"
                className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy/5"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy backdrop-blur">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-text">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </div>
                  <h3 className="heading-display mt-3 text-xl leading-snug text-navy">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-sm text-body/80">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy transition-colors group-hover:text-urban-blue">
                    Read article
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Button
            asChild
            variant="outline"
            className="border-navy text-navy hover:bg-navy hover:text-white"
          >
            <Link href="/news">View all insights</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
