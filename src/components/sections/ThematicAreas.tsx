import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
            {areas.map((area, index) => (
              <div
                key={area.id}
                className={cn(
                  "flex flex-col rounded-2xl border-t-4 bg-soft-bg p-8"
                )}
                style={{ borderColor: area.accent_color || "#1686C4" }}
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
  );
}
