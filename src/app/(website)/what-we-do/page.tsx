import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getThematicAreas, getFocusItems } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";
import { Layers, Briefcase, MapPin, Target, ArrowRight } from "lucide-react";
import type { ThematicArea } from "@/types/supabase";

const workAreas = [
  {
    title: "Programs",
    description:
      "Our thematic programmes across inclusive cities, poverty reduction and climate resilience.",
    href: "/what-we-do#programs",
    Icon: Layers,
  },
  {
    title: "Projects",
    description:
      "The initiatives we deliver with communities and local partners on the ground.",
    href: "/projects",
    Icon: Briefcase,
  },
  {
    title: "Coverage",
    description:
      "Where we work — the urban centres and communities we partner with across Tanzania.",
    href: "/what-we-do#coverage",
    Icon: MapPin,
  },
  {
    title: "Focus",
    description:
      "The specific focus areas that shape each programme and guide our interventions.",
    href: "/what-we-do#programs",
    Icon: Target,
  },
];

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
        <div className="absolute inset-0 bg-[url('/tpi-image-1.jpeg')] bg-cover bg-center opacity-20" />
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

      {/* Our Work overview */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-tpi">
          <SectionHeader
            eyebrow="Our Work"
            heading="How our work is organised."
            align="center"
            className="mx-auto mb-12"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workAreas.map(({ title, description, href, Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl bg-soft-bg p-6 ring-1 ring-border/60 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="heading-display text-lg text-navy">{title}</h3>
                <p className="mt-2 flex-1 text-sm text-body/80">{description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy transition-colors group-hover:text-urban-blue">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Programs / Thematic areas */}
      <section id="programs" className="scroll-mt-28 bg-soft-bg py-20 lg:py-28">
        <div className="container-tpi">
          <SectionHeader
            eyebrow="Programs & Focus"
            heading="Our thematic areas"
            align="center"
            className="mx-auto mb-16"
          />

          {areas.length === 0 ? (
            <div className="rounded-2xl bg-white py-16 text-center">
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
                    "flex flex-col rounded-2xl border-t-4 bg-white p-8 shadow-sm ring-1 ring-border/40",
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

      {/* Coverage */}
      <section id="coverage" className="scroll-mt-28 bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeader
                eyebrow="Coverage"
                heading="Where we work."
                body="TPi works across Tanzania's fast-growing urban centres — partnering with local governments, communities and civil society in the areas where marginalisation, poverty and climate vulnerability are most acute. Our footprint grows with each project as we reach more informal settlements and underserved neighbourhoods."
              />
              <div className="mt-8">
                <Button asChild className="bg-navy text-white hover:bg-navy/90">
                  <Link href="/projects">
                    See our projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  Icon: MapPin,
                  title: "Urban centres",
                  body: "Focused on Tanzania's rapidly urbanising cities and towns.",
                },
                {
                  Icon: Briefcase,
                  title: "Local partnerships",
                  body: "Delivered with local governments and community institutions.",
                },
                {
                  Icon: Layers,
                  title: "Informal settlements",
                  body: "Prioritising underserved and marginalised neighbourhoods.",
                },
                {
                  Icon: Target,
                  title: "Community-led",
                  body: "Co-designed with the residents we work alongside.",
                },
              ].map(({ Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl bg-soft-bg p-6 ring-1 ring-border/60"
                >
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-gold">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-semibold text-navy">{title}</h3>
                  <p className="mt-1 text-sm text-body/80">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
