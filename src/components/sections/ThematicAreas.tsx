import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";
import {
  getThematicAreas,
  getFocusItems,
} from "@/lib/data/queries";
import { cn } from "@/lib/utils";
import type { ThematicArea } from "@/types/supabase";

const defaultFocusAreas: Record<string, string[]> = {
  "inclusive-urban-transformation": [
    "Participatory urban planning",
    "Equitable access to social services",
    "Secure land rights and decent housing",
    "Accessible urban infrastructure",
    "Urban governance and accountability",
  ],
  "poverty-reduction": [
    "Livelihoods and economic empowerment",
    "MSME development",
    "Financial inclusion",
    "Education and vocational skills",
    "Social protection",
    "Pro-poor policy and budget advocacy",
  ],
  "climate-resilience": [
    "Climate-smart urban planning",
    "Disaster risk reduction",
    "Ecosystem-based adaptation",
    "Climate-resilient infrastructure",
    "Community climate action",
    "Sustainable blue economy",
    "Coastal protection",
  ],
};

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

export async function ThematicAreas() {
  const areas = await getThematicAreas();

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow="What We Do"
          heading="Three interconnected pathways to better cities."
          body="Our work is organised around the urban challenges that most affect
          excluded residents and the systems that must change to include them."
          align="center"
          className="mx-auto mb-16"
        />

        {areas.length === 0 ? (
          <div className="rounded-2xl bg-soft-bg py-16 text-center">
            <p className="text-muted-text">Thematic areas will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, index) => {
              const accent = area.accent_color || "#1686C4";
              return (
                <Reveal key={area.id} delay={index * 0.1}>
                  <div
                    className={cn(
                      "group relative flex h-full flex-col overflow-hidden rounded-3xl border-t-4 bg-white p-8 ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-navy/5"
                    )}
                    style={{ borderColor: accent }}
                  >
                    {/* Hover glow */}
                    <span
                      className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
                      style={{ backgroundColor: accent }}
                    />
                    <span
                      className="heading-display text-6xl font-bold leading-none opacity-15 transition-opacity group-hover:opacity-30"
                      style={{ color: accent }}
                    >
                      {area.number_label || String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="heading-display mt-5 text-2xl text-navy">
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
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
