import { Reveal } from "@/components/ui/Reveal";

export function IntroSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi text-center">
        <Reveal>
          <span className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            <span className="h-px w-8 bg-gold/70" />
            Our Conviction
            <span className="h-px w-8 bg-gold/70" />
          </span>
          <h2 className="heading-display text-3xl leading-tight text-navy md:text-4xl lg:text-[2.75rem]">
            The living conditions in our urban poor communities are unacceptable.
          </h2>
          <p className="body-large mt-8 text-body/80">
            The narrative of poverty has shifted. Mass urban migration is
            outpacing infrastructure, turning cities into the new epicentres of
            severe marginalisation — overpopulated, underserved, and struggling
            to provide the basic jobs, hygiene and safety every person deserves.
            Through evidence-based programming, strategic partnerships and
            community empowerment, TPi drives inclusive, systemic change across
            Tanzania&apos;s cities.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-16 lg:mt-24">
          <p className="heading-display mx-auto max-w-5xl text-2xl leading-snug text-navy md:text-3xl lg:text-4xl">
            We envision a future where every urban resident lives in dignity,
            safety, and climate resilience with equal opportunities to thrive and
            contribute to the nation&apos;s economy.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
