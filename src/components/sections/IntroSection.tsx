import { Reveal } from "@/components/ui/Reveal";

export type IntroContent = {
  eyebrow: string;
  heading: string;
  body: string;
  statement: string;
};

export function IntroSection({ content }: { content: IntroContent }) {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi text-center">
        <Reveal>
          {content.eyebrow ? (
            <span className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              <span className="h-px w-8 bg-gold/70" />
              {content.eyebrow}
              <span className="h-px w-8 bg-gold/70" />
            </span>
          ) : null}
          <h2 className="heading-display text-3xl leading-tight text-navy md:text-4xl lg:text-[2.75rem]">
            {content.heading}
          </h2>
          {content.body ? (
            <p className="body-large mt-8 text-body/80">{content.body}</p>
          ) : null}
        </Reveal>

        {content.statement ? (
          <Reveal delay={0.15} className="mt-16 lg:mt-24">
            <p className="heading-display mx-auto max-w-5xl text-2xl leading-snug text-navy md:text-3xl lg:text-4xl">
              {content.statement}
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
