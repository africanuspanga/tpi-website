import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getActiveTeamMembers } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { ArrowRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about TPi Tanzania, our mission, vision, values and approach to inclusive urban development.",
  path: "/about",
});

const coreValues = [
  {
    title: "Dignity and Respect",
    description:
      "Every person has the right to live in decent conditions and to be treated with respect, regardless of income, gender, age, disability or social status.",
  },
  {
    title: "Equity and Inclusion",
    description:
      "We prioritise the needs and voices of vulnerable groups, including women, children, youth, persons with disabilities, older persons and marginalised households.",
  },
  {
    title: "Community Participation",
    description:
      "Communities are central to planning, implementation, monitoring and learning, so that interventions respond to real needs and are locally owned.",
  },
  {
    title: "Accountability and Transparency",
    description:
      "We are committed to the responsible use of resources, ethical practice, openness and accountability to communities, partners, donors and public institutions.",
  },
  {
    title: "Partnership and Collaboration",
    description:
      "We work with government authorities, civil society organisations, communities, development partners, private sector actors and research institutions to achieve greater impact.",
  },
];

const thematicAreas = [
  {
    title: "Inclusive Urban Transformation",
    description:
      "Making cities inclusive, safe and well-governed — so residents of informal settlements and vulnerable groups can access services, opportunities and a voice in decisions.",
    accent: "bg-urban-blue",
  },
  {
    title: "Poverty Reduction",
    description:
      "Expanding livelihoods, economic inclusion and access to basic services for low-income and marginalised urban households.",
    accent: "bg-gold",
  },
  {
    title: "Climate Resilience",
    description:
      "Helping communities and local governments prepare for, adapt to and withstand climate shocks through sustainable, climate-responsive solutions.",
    accent: "bg-poverty-green",
  },
];

export default async function AboutPage() {
  const team = await getActiveTeamMembers();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy py-24 lg:py-32">
        <div className="container-tpi text-center">
          <span className="label-eyebrow mb-4 block text-gold">About Us</span>
          <h1 className="heading-display mx-auto max-w-4xl text-4xl text-white md:text-5xl lg:text-6xl">
            A national NGO advancing inclusive, sustainable and climate-responsive
            urban development in Tanzania.
          </h1>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <SectionHeader
            eyebrow="Who We Are"
            heading="Cities should be inclusive, safe and resilient."
            body="TPi is a national non-governmental organization working in Tanzania to advance inclusive urban transformation, poverty reduction and climate resilience. We believe that every person—regardless of income, gender, age, disability or social status—deserves access to opportunities, services and dignity."
            align="center"
            className="mx-auto"
          />
        </div>
        <div className="relative mt-12 h-[45vh] w-full overflow-hidden lg:mt-16 lg:h-[65vh]">
          <Image
            src="/community-development-meeting.jpg"
            alt="Community discussion in Tanzania"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-soft-bg py-20 lg:py-28">
        <div className="container-tpi">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="relative overflow-hidden rounded-2xl bg-navy p-8 text-white md:p-10">
              <div className="absolute left-0 top-0 h-1.5 w-24 bg-gold" />
              <span className="label-eyebrow mb-4 block text-gold">Our Vision</span>
              <h2 className="heading-display text-justify text-2xl leading-snug text-white md:text-3xl">
                Inclusive, resilient and poverty-free urban communities in Tanzania.
              </h2>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 md:p-10">
              <div className="absolute left-0 top-0 h-1.5 w-24 bg-urban-blue" />
              <span className="label-eyebrow mb-4 block text-urban-blue">
                Our Mission
              </span>
              <h2 className="heading-display text-justify text-2xl leading-snug text-navy md:text-3xl">
                To build inclusive, resilient and poverty-free urban communities
                through community empowerment, policy change and innovative,
                evidence-based solutions.
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <SectionHeader
            eyebrow="Core Values"
            heading="The principles that guide our work."
            align="center"
            className="mx-auto mb-16"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl bg-soft-bg p-8 transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 h-1.5 w-16 bg-gold" />
                <h3 className="heading-display text-xl text-navy">{value.title}</h3>
                <p className="mt-3 text-body/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Thematic Areas */}
      <section className="bg-soft-bg py-20 lg:py-28">
        <div className="container-tpi">
          <SectionHeader
            eyebrow="Our Core Thematic Areas"
            heading="Three interconnected areas of change."
            align="center"
            className="mx-auto mb-16"
          />
          <div className="grid gap-8 md:grid-cols-3">
            {thematicAreas.map((area, index) => (
              <div
                key={area.title}
                className="flex flex-col rounded-2xl bg-white p-8 shadow-sm ring-1 ring-border/60"
              >
                <span className={`mb-6 inline-block h-1.5 w-16 ${area.accent}`} />
                <span className="text-5xl font-bold text-border/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="heading-display mt-4 text-2xl text-navy">
                  {area.title}
                </h3>
                <p className="mt-3 text-body/80">{area.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild className="bg-navy text-white hover:bg-navy/90">
              <Link href="/what-we-do">
                See how we deliver this
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-navy py-20 text-white lg:py-28">
        <div className="container-tpi">
          <SectionHeader
            eyebrow="Our Approach"
            heading="Community-led, evidence-informed and partnership-driven."
            body="We listen, co-design, implement, generate evidence and influence change. Communities are partners from the beginning, not beneficiaries at the end of a project."
            align="center"
            className="mx-auto mb-12 [&_h2]:text-white [&_p]:text-white/80"
          />
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { n: "01", t: "Listen" },
              { n: "02", t: "Co-Design" },
              { n: "03", t: "Implement" },
              { n: "04", t: "Generate Evidence" },
              { n: "05", t: "Influence Change" },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-xl bg-white/5 p-6 text-center backdrop-blur"
              >
                <span className="text-3xl font-bold text-gold">{step.n}</span>
                <p className="mt-2 font-medium text-white">{step.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <SectionHeader
            eyebrow="Governance and Team"
            heading="The people behind TPi."
            align="center"
            className="mx-auto mb-16"
          />
          {team.length === 0 ? (
            <p className="text-center text-muted-text">
              Team information will be updated soon.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full bg-soft-bg">
                    {member.photo_url ? (
                      <Image
                        src={member.photo_url}
                        alt={member.full_name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <h3 className="heading-display mt-4 text-lg text-navy">
                    {member.full_name}
                  </h3>
                  <p className="text-sm text-muted-text">{member.position}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
