import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPosts, getResources } from "@/lib/data/queries";
import { Calendar, ArrowRight, Download, FileText } from "lucide-react";

function formatDate(date?: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function resourceTypeLabel(type: string) {
  switch (type) {
    case "report":
      return "Report";
    case "policy_brief":
      return "Policy Brief";
    case "research":
      return "Research";
    case "toolkit":
      return "Toolkit";
    case "case_study":
      return "Case Study";
    case "video":
      return "Video";
    default:
      return "Resource";
  }
}

export async function NewsResources() {
  const [posts, resources] = await Promise.all([
    getPosts(),
    getResources(),
  ]);

  const latestPosts = posts.slice(0, 3);
  const latestResources = resources.slice(0, 3);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Latest Insights */}
          <div>
            <span className="label-eyebrow mb-4 block text-urban-blue">
              Latest Insights
            </span>
            <h2 className="heading-display text-3xl text-navy md:text-4xl">
              News, insights and updates
            </h2>

            {latestPosts.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border py-12 text-center">
                <p className="text-muted-text">No articles published yet.</p>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                {latestPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group flex gap-5 rounded-2xl bg-soft-bg p-4 transition-colors hover:bg-white hover:ring-1 hover:ring-border/60"
                  >
                    <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:block">
                      <Image
                        src={post.featured_image_url || "/TPI IMAGE 1.jpeg"}
                        alt={post.title}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-text">
                        <Badge variant="secondary">{post.post_type}</Badge>
                        {formatDate(post.published_at) && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(post.published_at)}
                          </span>
                        )}
                      </div>
                      <h3 className="heading-display mt-2 text-lg text-navy">
                        <Link
                          href={`/news/${post.slug}`}
                          className="hover:text-urban-blue"
                        >
                          {post.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Button
              asChild
              variant="ghost"
              className="mt-6 p-0 text-navy hover:bg-transparent hover:text-urban-blue"
            >
              <Link href="/news">
                View all news
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Knowledge Resources */}
          <div>
            <span className="label-eyebrow mb-4 block text-gold">
              Knowledge Resources
            </span>
            <h2 className="heading-display text-3xl text-navy md:text-4xl">
              Reports, toolkits and research
            </h2>

            {latestResources.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-border py-12 text-center">
                <p className="text-muted-text">No resources published yet.</p>
              </div>
            ) : (
              <div className="mt-8 space-y-6">
                {latestResources.map((resource) => (
                  <article
                    key={resource.id}
                    className="group flex gap-5 rounded-2xl bg-soft-bg p-4 transition-colors hover:bg-white hover:ring-1 hover:ring-border/60"
                  >
                    <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:block">
                      <Image
                        src={resource.cover_image_url || "/TPI IMAGE 4.jpeg"}
                        alt={resource.title}
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-text">
                        <Badge variant="secondary">
                          {resourceTypeLabel(resource.resource_type)}
                        </Badge>
                        {resource.publication_year && (
                          <span>{resource.publication_year}</span>
                        )}
                      </div>
                      <h3 className="heading-display mt-2 text-lg text-navy">
                        <Link
                          href={`/resources/${resource.slug}`}
                          className="hover:text-urban-blue"
                        >
                          {resource.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <Button
              asChild
              variant="ghost"
              className="mt-6 p-0 text-navy hover:bg-transparent hover:text-urban-blue"
            >
              <Link href="/resources">
                Browse library
                <FileText className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
