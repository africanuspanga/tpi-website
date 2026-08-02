import Link from "next/link";
import { getBlock } from "@/lib/content";
import type { PageHeroContent } from "@/components/sections/PageHero";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getActivePartners } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { ExternalLink } from "lucide-react";
import type { Partner } from "@/types/supabase";

export const metadata = buildMetadata({
  title: "Partners",
  description:
    "TPi collaborates with communities, governments, civil society, development partners, research institutions and the private sector.",
  path: "/partners",
});

export default async function PartnersPage() {
  const partners = await getActivePartners();

  // Group by partner_type, preserving sort order.
  const groups = partners.reduce<Record<string, Partner[]>>((acc, partner) => {
    const key = partner.partner_type || "Partners";
    (acc[key] ||= []).push(partner);
    return acc;
  }, {});

  const hero = await getBlock<PageHeroContent>("partners", "hero");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Partners", path: "/partners" },
        ]}
      />

      <section className="bg-navy py-28 text-white lg:py-36">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">{hero.eyebrow}</span>
          <h1 className="heading-display text-4xl text-white md:text-5xl lg:text-6xl">{hero.heading}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{hero.body}</p>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          {partners.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-muted-text">
                Partner organizations will be listed here soon.
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(groups).map(([groupName, items]) => (
                <div key={groupName}>
                  <h2 className="heading-display text-2xl text-navy md:text-3xl">
                    {groupName}
                  </h2>
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((partner) => {
                      const card = (
                        <div className="flex h-full flex-col items-center rounded-2xl bg-soft-bg p-6 text-center ring-1 ring-border/60 transition-shadow hover:shadow-md">
                          <div className="relative flex h-20 w-full items-center justify-center">
                            {partner.logo_url ? (
                              <Image
                                src={partner.logo_url}
                                alt={partner.name}
                                width={160}
                                height={80}
                                className="h-16 w-auto object-contain"
                              />
                            ) : (
                              <span className="heading-display text-lg text-navy">
                                {partner.name}
                              </span>
                            )}
                          </div>
                          <p className="mt-4 text-sm font-medium text-body">
                            {partner.name}
                          </p>
                          {partner.website_url && (
                            <span className="mt-2 inline-flex items-center gap-1 text-xs text-urban-blue">
                              Visit website
                              <ExternalLink className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                      );

                      return partner.website_url ? (
                        <a
                          key={partner.id}
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {card}
                        </a>
                      ) : (
                        <div key={partner.id}>{card}</div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-soft-bg py-20 lg:py-28">
        <div className="container-tpi text-center">
          <h2 className="heading-display text-3xl text-navy md:text-4xl">
            Become a partner
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-body/80">
            Join us in building more inclusive, resilient and poverty-free cities
            across Tanzania.
          </p>
          <Button asChild className="mt-8 bg-navy px-8 text-white hover:bg-navy/90">
            <Link href="/get-involved">Explore partnership</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
