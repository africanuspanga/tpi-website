import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PartnerMarquee } from "@/components/ui/PartnerMarquee";
import { getActivePartners } from "@/lib/data/queries";

// Placeholder brand marks shown until real partner logos are uploaded.
const placeholderLogos = [
  "Logo 1",
  "Logo 2",
  "Logo 3",
  "Logo 4",
  "Logo 5",
  "Logo 6",
];

function PlaceholderMarquee() {
  const items = [...placeholderLogos, ...placeholderLogos];
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-8 group-hover:[animation-play-state:paused] md:gap-12">
        {items.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className="flex h-20 w-40 shrink-0 items-center justify-center gap-2 rounded-xl bg-white ring-1 ring-border/60"
          >
            <span className="h-6 w-6 rounded-md bg-gradient-to-br from-urban-blue to-navy" />
            <span className="text-sm font-semibold tracking-tight text-muted-text">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function Partners() {
  const partners = await getActivePartners();

  return (
    <section className="bg-soft-bg py-20 lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow="Partners"
          heading="Progress requires partnership."
          body="We work with government agencies, international cooperation partners,
          research institutions, civil society networks and communities."
          align="center"
          className="mx-auto mb-12"
        />

        {partners.length === 0 ? (
          <PlaceholderMarquee />
        ) : (
          <PartnerMarquee partners={partners} />
        )}

        <div className="mt-10 text-center">
          <Button
            asChild
            variant="outline"
            className="border-navy text-navy hover:bg-navy hover:text-white"
          >
            <Link href={partners.length === 0 ? "/get-involved" : "/partners"}>
              {partners.length === 0 ? "Partner With TPi" : "View All Partners"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
