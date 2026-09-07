import { getBlock } from "@/lib/content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.tpi.or.tz";

type SocialLinks = {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export async function OrganizationJsonLd() {
  // `sameAs` is what lets Google tie this site to its social profiles in the
  // knowledge panel, so it reads the same CMS block the footer renders from
  // rather than being a hardcoded empty array.
  const social = await getBlock<SocialLinks>("site", "social");
  const sameAs = [
    social.linkedin,
    social.twitter,
    social.facebook,
    social.instagram,
    social.youtube,
  ].filter((url): url is string => Boolean(url && url.startsWith("http")));

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "NGO",
        name: "TPi Tanzania",
        alternateName: "Tanzania Partnership Initiative",
        url: SITE_URL,
        logo: `${SITE_URL}/tpi-logo.png`,
        description:
          "TPi advances inclusive urban transformation, poverty reduction and climate resilience through community empowerment, partnerships and evidence-based solutions in Tanzania.",
        slogan: "Better Cities. Better Lives.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "21 Taasisi, Mikocheni, P.O. Box 4161",
          addressLocality: "Dar es Salaam",
          addressCountry: "TZ",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "info@TPi.or.tz",
          telephone: "+255-749-778-332",
          contactType: "General Enquiries",
          availableLanguage: ["English", "Swahili"],
        },
        sameAs,
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "TPi Tanzania",
        url: SITE_URL,
        inLanguage: "en",
        publisher: { "@type": "NGO", name: "TPi Tanzania" },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${SITE_URL}${item.path}`,
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  imageUrl,
  authorName,
}: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  imageUrl?: string;
  authorName?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${SITE_URL}${slug}`,
        image: imageUrl || `${SITE_URL}/tpi-image-1.jpeg`,
        datePublished: publishedAt,
        dateModified: modifiedAt || publishedAt,
        author: {
          "@type": "Organization",
          name: authorName || "TPi Tanzania",
        },
        publisher: {
          "@type": "NGO",
          name: "TPi Tanzania",
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/tpi-logo.png`,
          },
        },
      }}
    />
  );
}
