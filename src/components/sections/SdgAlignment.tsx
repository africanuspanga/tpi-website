import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

const sdgs = [
  { number: "01", title: "No Poverty", color: "#E5243B", primary: true },
  { number: "03", title: "Good Health & Well-being", color: "#4C9F38" },
  { number: "04", title: "Quality Education", color: "#C5192D" },
  { number: "05", title: "Gender Equality", color: "#FF3A21" },
  { number: "06", title: "Clean Water & Sanitation", color: "#26BDE2" },
  { number: "10", title: "Reduced Inequalities", color: "#DD1367" },
  {
    number: "11",
    title: "Sustainable Cities & Communities",
    color: "#FD9D24",
    primary: true,
  },
  { number: "13", title: "Climate Action", color: "#3F7E44", primary: true },
];

export function SdgAlignment() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow="SDG Alignment"
          heading="Contributing to the Global Goals."
          body="TPi's mandate directly advances SDG 1, SDG 11 and SDG 13, with meaningful contributions to SDGs 3, 4, 5, 6 and 10."
          align="center"
          className="mx-auto mb-12"
        />

        {/* Legend */}
        <div className="mb-10 flex items-center justify-center gap-6 text-sm text-muted-text">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            Primary focus
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            Supporting contribution
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {sdgs.map((sdg, index) => (
            <Reveal key={sdg.number} delay={index * 0.06}>
              <div
                className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl p-5 text-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={{ backgroundColor: sdg.color }}
              >
                {/* Depth overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/25" />
                {/* Primary ring */}
                {sdg.primary && (
                  <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-gold/80" />
                )}

                <div className="relative z-10 flex items-start justify-between">
                  <span className="heading-display text-4xl font-bold leading-none md:text-5xl">
                    {sdg.number}
                  </span>
                  {sdg.primary && (
                    <span className="rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
                      Primary
                    </span>
                  )}
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Goal {Number(sdg.number)}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold leading-snug md:text-base">
                    {sdg.title}
                  </h3>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
