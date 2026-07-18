import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowRight, Download } from "lucide-react";

export function IntroSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="container-tpi">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
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
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl lg:aspect-square">
            <Image
              src="/Dar es Salaam city.jpg"
              alt="Aerial view of Dar es Salaam"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
