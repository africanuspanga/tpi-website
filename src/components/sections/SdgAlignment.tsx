import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export type SdgItem = {
  number: number;
  title: string;
  image: string;
  primary?: boolean;
};

export type SdgContent = {
  eyebrow: string;
  heading: string;
  body: string;
  legendPrimary: string;
  legendSupporting: string;
  items: SdgItem[];
};

export function SdgAlignment({ content }: { content: SdgContent }) {
  const sdgs = content.items ?? [];
  if (sdgs.length === 0) return null;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow={content.eyebrow}
          heading={content.heading}
          body={content.body}
          align="center"
          className="mx-auto mb-12"
        />

        {/* Legend */}
        <div className="mb-10 flex items-center justify-center gap-6 text-sm text-muted-text">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            {content.legendPrimary}
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            {content.legendSupporting}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {sdgs.map((sdg, index) => (
            <Reveal key={`${sdg.number}-${index}`} delay={index * 0.06}>
              <div className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                {sdg.image ? (
                  <Image
                    src={sdg.image}
                    alt={`SDG ${sdg.number}: ${sdg.title}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-soft-bg p-3 text-center text-sm font-semibold text-navy">
                    {sdg.title}
                  </div>
                )}
                {sdg.primary ? (
                  <>
                    <span className="pointer-events-none absolute inset-0 z-10 rounded-2xl ring-2 ring-inset ring-gold/80" />
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
                      Primary
                    </span>
                  </>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
