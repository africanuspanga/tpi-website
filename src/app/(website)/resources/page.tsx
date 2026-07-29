import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getResources } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import { FileText, ArrowRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "Resources",
  description:
    "Reports, policy briefs, research, toolkits and publications from TPi Tanzania.",
  path: "/resources",
});

const resourceTypes = [
  { key: "report", label: "Reports" },
  { key: "policy_brief", label: "Publications" },
  { key: "research", label: "Analysis" },
  { key: "toolkit", label: "Toolkits" },
  { key: "case_study", label: "Case Studies" },
  { key: "video", label: "Videos" },
  { key: "other", label: "Other" },
];

// Primary browse categories for the Resources section.
const resourceFilters = resourceTypes.filter((t) =>
  ["report", "policy_brief", "research"].includes(t.key)
);

function typeLabel(type: string) {
  return resourceTypes.find((t) => t.key === type)?.label || type;
}

export default async function ResourcesPage(props: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await props.searchParams;
  const resources = await getResources(type);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ]}
      />

      <section className="bg-navy py-28 text-white lg:py-36">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">
            Knowledge &amp; Resources
          </span>
          <h1 className="heading-display text-4xl text-white md:text-5xl lg:text-6xl">
            Evidence for better cities.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Explore our reports, publications and analysis — plus stories of
            change and the impact of our work advancing inclusive and
            climate-responsive urban development.
          </p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          {/* Filters */}
          <div className="mb-12 flex flex-wrap gap-2">
            <Link
              href="/resources"
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                !type
                  ? "border-navy bg-navy text-white"
                  : "border-border text-body hover:border-navy"
              )}
            >
              All
            </Link>
            {resourceFilters.map((t) => (
              <Link
                key={t.key}
                href={`/resources?type=${t.key}`}
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

          {resources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-text">
                No resources have been published yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <article
                  key={resource.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-soft-bg ring-1 ring-border/60 transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-navy/5">
                    {resource.cover_image_url ? (
                      <Image
                        src={resource.cover_image_url}
                        alt={resource.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FileText className="h-12 w-12 text-navy/30" />
                      </div>
                    )}
                    <Badge className="absolute left-4 top-4 bg-white/95 text-navy hover:bg-white">
                      {typeLabel(resource.resource_type)}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-text">
                      {resource.publication_year && (
                        <span>{resource.publication_year}</span>
                      )}
                      {resource.language && <span>{resource.language}</span>}
                    </div>
                    <h3 className="heading-display mt-2 text-xl text-navy">
                      {resource.title}
                    </h3>
                    {resource.description && (
                      <p className="mt-3 line-clamp-3 flex-1 text-sm text-body/80">
                        {resource.description}
                      </p>
                    )}
                    <div className="mt-6 pt-4">
                      <Link
                        href={`/resources/${resource.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-urban-blue"
                      >
                        View resource
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stories of Change & Impacts */}
      <section className="bg-soft-bg py-20 lg:py-28">
        <div className="container-tpi">
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/impact#stories"
              className="group flex flex-col justify-between rounded-2xl bg-navy p-8 text-white transition-transform hover:-translate-y-1 md:p-10"
            >
              <div>
                <span className="label-eyebrow mb-4 block text-gold">
                  Stories of Change
                </span>
                <h3 className="heading-display text-2xl text-white md:text-3xl">
                  Real change, told through the people at the heart of our work.
                </h3>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-medium text-gold">
                Read the stories
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              href="/impact#metrics"
              className="group flex flex-col justify-between rounded-2xl bg-white p-8 ring-1 ring-border/60 transition-transform hover:-translate-y-1 md:p-10"
            >
              <div>
                <span className="label-eyebrow mb-4 block text-urban-blue">
                  Impacts
                </span>
                <h3 className="heading-display text-2xl text-navy md:text-3xl">
                  The measurable difference our work makes in urban communities.
                </h3>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 font-medium text-navy">
                See our impact
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
