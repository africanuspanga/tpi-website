import { buildMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/sections/Hero";
import { IntroSection } from "@/components/sections/IntroSection";
import { TargetGroups } from "@/components/sections/TargetGroups";
import { SdgAlignment } from "@/components/sections/SdgAlignment";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = buildMetadata({});

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroSection />
      <TargetGroups />

      {/* Community statement */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi text-center">
          <Reveal>
            <span className="mx-auto mb-8 block h-px w-16 bg-gold" />
            <p className="heading-display mx-auto max-w-5xl text-2xl leading-snug text-navy md:text-3xl lg:text-4xl">
              People are not beneficiaries at the end of a project. They are
              partners from the beginning. TPi is grounded on participation,
              equity and learning.
            </p>
          </Reveal>
        </div>
      </section>

      <SdgAlignment />
      <FinalCta />
    </>
  );
}
