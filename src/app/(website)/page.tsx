import { buildMetadata } from "@/lib/seo/metadata";
import { getBlock } from "@/lib/content";
import { Hero, type HeroSlide } from "@/components/sections/Hero";
import {
  IntroSection,
  type IntroContent,
} from "@/components/sections/IntroSection";
import {
  TargetGroups,
  type TargetGroupsContent,
} from "@/components/sections/TargetGroups";
import {
  SdgAlignment,
  type SdgContent,
} from "@/components/sections/SdgAlignment";
import { FinalCta, type FinalCtaContent } from "@/components/sections/FinalCta";
import { Reveal } from "@/components/ui/Reveal";

export const metadata = buildMetadata({});

export default async function HomePage() {
  const [hero, intro, targetGroups, statement, sdg, finalCta] =
    await Promise.all([
      getBlock<{ slides: HeroSlide[] }>("home", "hero"),
      getBlock<IntroContent>("home", "intro"),
      getBlock<TargetGroupsContent>("home", "target_groups"),
      getBlock<{ text: string }>("home", "community_statement"),
      getBlock<SdgContent>("home", "sdg"),
      getBlock<FinalCtaContent>("home", "final_cta"),
    ]);

  return (
    <>
      <Hero slides={hero.slides} />
      <IntroSection content={intro} />
      <TargetGroups content={targetGroups} />

      {/* Community statement */}
      {statement.text ? (
        <section className="bg-white py-20 lg:py-28">
          <div className="container-tpi text-center">
            <Reveal>
              <span className="mx-auto mb-8 block h-px w-16 bg-gold" />
              <p className="heading-display mx-auto max-w-5xl text-2xl leading-snug text-navy md:text-3xl lg:text-4xl">
                {statement.text}
              </p>
            </Reveal>
          </div>
        </section>
      ) : null}

      <SdgAlignment content={sdg} />
      <FinalCta content={finalCta} />
    </>
  );
}
