import { buildMetadata } from "@/lib/seo/metadata";
import { Hero } from "@/components/sections/Hero";
import { IntroSection } from "@/components/sections/IntroSection";
import { VisionMission } from "@/components/sections/VisionMission";
import { ThematicAreas } from "@/components/sections/ThematicAreas";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Approach } from "@/components/sections/Approach";
import { TargetGroups } from "@/components/sections/TargetGroups";
import { ImpactMetrics } from "@/components/sections/ImpactMetrics";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { Partners } from "@/components/sections/Partners";
import { BlogHighlights } from "@/components/sections/BlogHighlights";
import { SdgAlignment } from "@/components/sections/SdgAlignment";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata = buildMetadata({});

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroSection />
      <VisionMission />
      <ThematicAreas />
      <FeaturedProjects />
      <Approach />
      <TargetGroups />
      <ImpactMetrics />
      <SuccessStories />
      <Partners />
      <BlogHighlights />
      <SdgAlignment />
      <FinalCta />
    </>
  );
}
