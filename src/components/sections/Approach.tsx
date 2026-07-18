import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    number: "01",
    title: "Listen",
    description:
      "We begin by understanding lived experience — mapping needs, assets and power dynamics with residents and local actors.",
  },
  {
    number: "02",
    title: "Co-Design",
    description:
      "Solutions are shaped jointly with the people they affect, blending community knowledge with technical and policy expertise.",
  },
  {
    number: "03",
    title: "Implement",
    description:
      "We support delivery on the ground, strengthen local capacity and adapt as contexts change.",
  },
  {
    number: "04",
    title: "Generate Evidence",
    description:
      "Rigorous monitoring, learning and documentation turn practice into insight that can be shared and scaled.",
  },
  {
    number: "05",
    title: "Influence Change",
    description:
      "We use evidence and partnerships to inform policy, investment and practice towards more inclusive urban systems.",
  },
];

export function Approach() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow="Our Approach"
          heading="People are not beneficiaries at end of a project. They are partners from the beginning."
          body="Everything we do is grounded in participation, equity and learning."
          align="center"
          className="mx-auto mb-16"
        />

        <div className="mx-auto max-w-4xl">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 hidden h-full w-px bg-border md:block" />

            <div className="space-y-10">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative flex flex-col gap-4 md:flex-row md:gap-10"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-gold md:sticky md:top-28">
                    {step.number}
                  </div>
                  <div className="flex-1 rounded-2xl bg-soft-bg p-6 md:p-8">
                    <h3 className="heading-display text-2xl text-navy">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-body/80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
