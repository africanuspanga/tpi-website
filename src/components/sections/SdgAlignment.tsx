import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

const sdgs = [
  {
    number: 1,
    title: "No Poverty",
    image: "/sdg/sdg-01.png",
    primary: true,
  },
  { number: 3, title: "Good Health & Well-being", image: "/sdg/sdg-03.png" },
  { number: 4, title: "Quality Education", image: "/sdg/sdg-04.png" },
  { number: 5, title: "Gender Equality", image: "/sdg/sdg-05.png" },
  { number: 6, title: "Clean Water & Sanitation", image: "/sdg/sdg-06.png" },
  { number: 10, title: "Reduced Inequalities", image: "/sdg/sdg-10.png" },
  {
    number: 11,
    title: "Sustainable Cities & Communities",
    image: "/sdg/sdg-11.png",
    primary: true,
  },
  {
    number: 13,
    title: "Climate Action",
    image: "/sdg/sdg-13.png",
    primary: true,
  },
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
              <div className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <Image
                  src={sdg.image}
                  alt={`SDG ${sdg.number}: ${sdg.title}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {sdg.primary && (
                  <>
                    <span className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-2 ring-inset ring-gold/80" />
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
                      Primary
                    </span>
                  </>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
