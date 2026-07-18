import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getActiveTeamMembers } from "@/lib/data/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { Download, ArrowRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "About TPi",
  description:
    "Learn about TPi Tanzania, our mission, vision, values and approach to inclusive urban development.",
  path: "/about",
});

const coreValues = [
  {
    title: "Dignity and Respect",
    description:
      "Every person has the right to live in decent conditions and be treated with respect.",
  },
  {
    title: "Equity and Inclusion",
    description:
      "We prioritize the voices and needs of vulnerable and marginalized groups.",
  },
  {
    title: "Community Participation",
    description:
      "Communities are central to planning, implementation, monitoring and learning.",
  },
  {
    title: "Accountability and Transparency",
    description:
      "We are committed to ethical practice, openness and responsible use of resources.",
  },
  {
    title: "Partnership and Collaboration",
    description:
      "We work with public institutions, civil society, communities, development partners, the private sector and research institutions.",
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
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">About TPi</span>
          <h1 className="heading-display max-w-4xl text-4xl text-white md:text-5xl lg:text-6xl">
            A national NGO advancing inclusive, sustainable and climate-responsive
            urban development in Tanzania.
          </h1>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeader
                eyebrow="Who We Are"
                heading="Cities should be inclusive, safe and resilient."
                body="TPi is a national non-governmental organization working in Tanzania to advance inclusive urban transformation, poverty reduction and climate resilience. We believe that every person—regardless of income, gender, age, disability or social status—deserves access to opportunities, services and dignity."
              />
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild className="bg-navy text-white hover:bg-navy/90">
                  <Link href="/what-we-do">
                    Explore Our Work
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-navy text-navy hover:bg-navy/5"
                >
                  <Link href="/TPi_Organization_Profile.pdf" target="_blank">
                    <Download className="mr-2 h-4 w-4" />
                    Download Organization Profile
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-square">
              <Image
                src="/Tanzanian residents, women, youth and local leaders discussing community development..jpg"
                alt="Community discussion in Tanzania"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-soft-bg py-20 lg:py-28">
        <div className="container-tpi">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="relative overflow-hidden rounded-2xl bg-navy p-8 text-white md:p-12">
              <div className="absolute left-0 top-0 h-1.5 w-24 bg-gold" />
              <span className="label-eyebrow mb-4 block text-gold">Our Vision</span>
              <h2 className="heading-display text-3xl text-white md:text-4xl">
                Inclusive, resilient and poverty-free urban communities in Tanzania.
              </h2>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-white p-8 md:p-12">
              <div className="absolute left-0 top-0 h-1.5 w-24 bg-urban-blue" />
              <span className="label-eyebrow mb-4 block text-urban-blue">
                Our Mission
              </span>
              <h2 className="heading-display text-3xl text-navy md:text-4xl">
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
