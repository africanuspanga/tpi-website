import Link from "next/link";
import { getBlock } from "@/lib/content";
import type { PageHeroContent } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import {
  HandHeart,
  Landmark,
  Users,
  FlaskConical,
  Building2,
  Newspaper,
  ArrowRight,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Get Involved",
  description:
    "Partner with TPi Tanzania — as a development partner, government, civil society organization, researcher or private-sector actor.",
  path: "/get-involved",
});

const ways = [
  {
    icon: HandHeart,
    title: "Development partners & donors",
    body: "Fund and co-design programmes that expand opportunity and resilience for excluded urban residents.",
    enquiry: "Funding and development cooperation",
  },
  {
    icon: Landmark,
    title: "Local & national government",
    body: "Collaborate on participatory planning, service delivery and climate-responsive urban governance.",
    enquiry: "Partnership",
  },
  {
    icon: Users,
    title: "Civil society & communities",
    body: "Work with us to amplify community voice, strengthen accountability and reach those most often left out.",
    enquiry: "Community engagement",
  },
  {
    icon: FlaskConical,
    title: "Research institutions",
    body: "Generate evidence together — from baseline studies to policy-relevant urban research.",
    enquiry: "Research collaboration",
  },
  {
    icon: Building2,
    title: "Private sector",
    body: "Bring innovation, technology and investment to inclusive and sustainable urban solutions.",
    enquiry: "Partnership",
  },
  {
    icon: Newspaper,
    title: "Media & careers",
    body: "Tell the story of inclusive cities, or join a team committed to dignity, equity and impact.",
    enquiry: "Media enquiry",
  },
];

export default async function GetInvolvedPage() {
  const hero = await getBlock<PageHeroContent>("get-involved", "hero");

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Get Involved", path: "/get-involved" },
        ]}
      />

      <section className="bg-navy py-28 text-white lg:py-36">
        <div className="container-tpi">
          <span className="label-eyebrow mb-4 block text-gold">{hero.eyebrow}</span>
          <h1 className="heading-display text-4xl text-white md:text-5xl lg:text-6xl">{hero.heading}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{hero.body}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild className="bg-gold px-6 text-navy hover:bg-gold/90">
              <Link href="/contact?enquiry=Partnership">Become a Partner</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Contact TPi</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 lg:py-28">
        <div className="container-tpi">
          <h2 className="heading-display text-center text-3xl text-navy md:text-4xl">
            Ways to partner with us
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-body/80">
            However you work, there is a place for you in building better cities.
          </p>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ways.map((way) => {
              const Icon = way.icon;
              return (
                <div
                  key={way.title}
                  className="flex flex-col rounded-2xl bg-soft-bg p-8 ring-1 ring-border/60"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5 text-navy">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="heading-display mt-5 text-xl text-navy">
                    {way.title}
                  </h3>
                  <p className="mt-3 flex-1 text-body/80">{way.body}</p>
                  <Link
                    href={`/contact?enquiry=${encodeURIComponent(way.enquiry)}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-urban-blue"
                  >
                    Start a conversation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 text-white lg:py-28">
        <div className="container-tpi text-center">
          <h2 className="heading-display text-3xl text-white md:text-4xl">
            Ready to work together?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Tell us about your priorities and we will find the best way to
            collaborate.
          </p>
          <Button asChild className="mt-8 bg-gold px-8 text-navy hover:bg-gold/90">
            <Link href="/contact?enquiry=Partnership">Get in touch</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
