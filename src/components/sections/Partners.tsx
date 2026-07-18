import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PartnerMarquee } from "@/components/ui/PartnerMarquee";
import { getActivePartners } from "@/lib/data/queries";
import { Handshake } from "lucide-react";

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
          <div className="rounded-2xl bg-white py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-navy">
              <Handshake className="h-8 w-8" />
            </div>
            <h3 className="heading-display mt-6 text-2xl text-navy">
              Become a partner
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-body/80">
              We are always open to collaborations that advance inclusive urban
              development in Tanzania.
            </p>
            <Button
              asChild
              className="mt-6 bg-navy text-white hover:bg-navy/90"
            >
              <Link href="/get-involved">Partner With TPi</Link>
            </Button>
          </div>
        ) : (
          <>
            <PartnerMarquee partners={partners} />
            <div className="mt-10 text-center">
              <Button
                asChild
                variant="outline"
                className="border-navy text-navy hover:bg-navy hover:text-white"
              >
                <Link href="/partners">View All Partners</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
