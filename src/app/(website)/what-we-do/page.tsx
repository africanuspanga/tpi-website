import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getThematicAreas, getFocusItems } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import type { ThematicArea } from "@/types/supabase";

export const metadata = buildMetadata({
  title: "What We Do",
  description:
    "Explore TPi Tanzania's three thematic areas: inclusive cities, poverty reduction and climate resilience.",
  path: "/what-we-do",
});

const defaultFocusAreas: Record<string, string[]> = {
  "inclusive-cities": [
    "Participatory urban planning",
    "Upgrading informal settlements",
    "Governance and citizen voice",
  ],
  "poverty-reduction": [
    "Livelihoods and economic inclusion",
    "Women and youth empowerment",
    "Social protection and access to services",
  ],
  "climate-resilience": [
    "Disaster risk reduction",
    "Sustainable water and sanitation",
    "Ecosystem-based adaptation",
  ],
};

function accentColorClass(accent?: string | null) {
  switch (accent) {
    case "urban-blue":
      return "border-urban-blue";
    case "poverty-green":
      return "border-poverty-green";
    case "climate-gold":
      return "border-climate-gold";
    case "bright-blue":
      return "border-bright-blue";
    case "gold":
      return "border-gold";
    default:
      return "border-urban-blue";
  }
}

async function FocusList({ area }: { area: ThematicArea }) {
  const items = await getFocusItems(area.id);
  const focus =
    items.length > 0
      ? items.map((i) => i.title)
      : defaultFocusAreas[area.slug] || [];

  return (
    <ul className="mt-4 space-y-2">
      {focus.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-body/80">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function WhatWeDoPage() {
  const areas = await getThematicAreas();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "What We Do", path: "/what-we-do" },
        ]}
      />

      {/* Hero */}
      <section className="relative bg-navy py-28 text-white lg:py-36">
        <div className="absolute inset-0 bg-[url('/TPI IMAGE 1.jpeg')] bg-cover bg-center opacity-20" />
        <div className="container-tpi relative z-10">
          <span className="label-eyebrow mb-4 block text-gold">What We Do</span>
          <h1 className="heading-display max-w-3xl text-4xl md:text-5xl lg:text-6xl">
            Inclusive cities, poverty reduction and climate resilience.
          </h1>
          <p className="body-large mt-6 max-w-2xl text-white/80">
            Our programmes connect people, evidence and institutions to address
            the urban challenges that matter most to excluded residents.
          </p>
        </div>
      </section>

      {/* Thematic areas */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <SectionHeader
            eyebrow="Programmes"
            heading="Our thematic areas"
            align="center"
            className="mx-auto mb-16"
          />

          {areas.length === 0 ? (
            <div className="rounded-2xl bg-soft-bg py-16 text-center">
              <p className="text-muted-text">
                Thematic areas will appear here once published.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {areas.map((area, index) => (
                <div
                  key={area.id}
                  className={cn(
                    "flex flex-col rounded-2xl border-t-4 bg-soft-bg p-8",
                    accentColorClass(area.accent_color)
                  )}
                >
                  <span className="text-5xl font-bold text-border/60">
                    {area.number_label || String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="heading-display mt-4 text-2xl text-navy">
                    {area.name}
                  </h3>
                  <p className="mt-3 text-body/80">
                    {area.short_description ||
                      "Collaborative solutions with communities and local partners."}
                  </p>
                  <FocusList area={area} />
                  <div className="mt-auto pt-8">
                    <Button
                      asChild
                      variant="outline"
                      className="border-navy text-navy hover:bg-navy hover:text-white"
                    >
                      <Link href={`/what-we-do/${area.slug}`}>
                        Explore {area.name}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
