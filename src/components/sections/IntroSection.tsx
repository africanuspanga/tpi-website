import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, Download, Building2 } from "lucide-react";

export function IntroSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeader
              eyebrow="Who We Are"
              heading="Cities should work for everyone."
              body="TPi Tanzania is a learning and action organisation dedicated to
              inclusive urban development. We work with residents of informal
              settlements, women, youth, people with disabilities, low-income
              households and local governments to co-design solutions that
              improve access to services, livelihoods, climate resilience and
              voice in decision-making."
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="bg-navy text-white hover:bg-navy/90">
                <Link href="/about">
                  Learn About TPi
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
          </Reveal>

          <Reveal delay={0.15} className="relative">
            {/* Offset accent square */}
            <div className="absolute -right-4 -top-4 hidden h-40 w-40 rounded-3xl bg-gold/15 lg:block" />
            <div className="absolute -bottom-5 -left-5 hidden h-28 w-28 rounded-3xl border-2 border-urban-blue/20 lg:block" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl shadow-navy/10 ring-1 ring-navy/5 lg:aspect-square">
              <Image
                src="/dar-es-salaam-city.jpg"
                alt="Aerial view of Dar es Salaam"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
            </div>

            {/* Floating glass card */}
            <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white/95 p-4 shadow-lg ring-1 ring-navy/5 backdrop-blur sm:left-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold leading-tight text-navy">
                  A national NGO
                </p>
                <p className="text-xs text-muted-text">
                  Inclusive · Resilient · Poverty-free
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
