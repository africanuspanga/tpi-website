import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getResourceBySlug } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { ArrowLeft, Download, ExternalLink, FileText } from "lucide-react";

interface ResourcePageProps {
  params: Promise<{ slug: string }>;
}

const typeLabels: Record<string, string> = {
  report: "Report",
  policy_brief: "Policy Brief",
  research: "Research",
  toolkit: "Toolkit",
  case_study: "Case Study",
  video: "Video",
  other: "Resource",
};

export async function generateMetadata({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) return {};
  return buildMetadata({
    title: resource.title,
    description: resource.description || undefined,
    ogImage: resource.cover_image_url || undefined,
    path: `/resources/${slug}`,
  });
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) notFound();

  const downloadUrl = resource.file_url || resource.external_url;
  const isExternal = !resource.file_url && !!resource.external_url;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: resource.title, path: `/resources/${slug}` },
        ]}
      />

      <section className="bg-navy py-24 text-white lg:py-28">
        <div className="container-tpi">
          <Button
            asChild
            variant="ghost"
            className="mb-6 p-0 text-white/80 hover:bg-transparent hover:text-gold"
          >
            <Link href="/resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All resources
            </Link>
          </Button>
          <Badge className="mb-4 bg-gold text-navy hover:bg-gold">
            {typeLabels[resource.resource_type] || "Resource"}
          </Badge>
          <h1 className="heading-display max-w-4xl text-3xl text-white md:text-4xl lg:text-5xl">
            {resource.title}
          </h1>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-tpi">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {resource.description ? (
                <p className="body-large text-body/90">{resource.description}</p>
              ) : (
                <p className="text-body/70">
                  A description of this resource will appear here once published.
                </p>
              )}

              {downloadUrl && (
                <Button
                  asChild
                  className="mt-8 bg-navy px-6 text-white hover:bg-navy/90"
                >
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...(!isExternal ? { download: true } : {})}
                  >
                    {isExternal ? (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open resource
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </>
                    )}
                  </a>
                </Button>
              )}
            </div>

            <aside>
              <div className="overflow-hidden rounded-2xl border border-border">
                <div className="relative aspect-[3/4] bg-navy/5">
                  {resource.cover_image_url ? (
                    <Image
                      src={resource.cover_image_url}
                      alt={resource.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <FileText className="h-16 w-16 text-navy/30" />
                    </div>
                  )}
                </div>
                <dl className="space-y-3 p-6 text-sm">
                  {resource.author && (
                    <div>
                      <dt className="text-muted-text">Author</dt>
                      <dd className="font-medium text-body">{resource.author}</dd>
                    </div>
                  )}
                  {resource.publication_year && (
                    <div>
                      <dt className="text-muted-text">Published</dt>
                      <dd className="font-medium text-body">
                        {resource.publication_year}
                      </dd>
                    </div>
                  )}
                  {resource.language && (
                    <div>
                      <dt className="text-muted-text">Language</dt>
                      <dd className="font-medium text-body">
                        {resource.language}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
