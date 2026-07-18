import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tpi.or.tz";
const defaultTitle = "TPi Tanzania | Better Cities. Better Lives.";
const defaultDescription =
  "TPi advances inclusive urban transformation, poverty reduction and climate resilience through community empowerment, partnerships and evidence-based solutions in Tanzania.";

export interface SeoInput {
  title?: string | null;
  description?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedAt?: string | null;
  modifiedAt?: string | null;
  path?: string;
}

export function buildMetadata(input: SeoInput = {}): Metadata {
  const title = input.title
    ? `${input.title} | TPi Tanzania`
    : defaultTitle;
  const description = input.description || defaultDescription;
  const canonical = input.canonical || (input.path ? `${siteUrl}${input.path}` : siteUrl);
  const ogImage = input.ogImage || `${siteUrl}/tpi-image-1.jpeg`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "TPi Tanzania",
      locale: "en_TZ",
      type: input.type || "website",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
      ...(input.publishedAt ? { publishedTime: input.publishedAt } : {}),
      ...(input.modifiedAt ? { modifiedTime: input.modifiedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
