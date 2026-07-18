import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  Users,
  Heart,
  Accessibility,
  Home,
  Landmark,
} from "lucide-react";

const groups = [
  {
    title: "Residents of informal settlements",
    description:
      "Supporting people in unplanned neighbourhoods to secure services, tenure and a meaningful say in city decisions.",
    image: "/community-water-point.jpg",
    icon: Users,
  },
  {
    title: "Women and youth",
    description:
      "Creating space, skills and economic opportunities for women and young people to lead urban change.",
    image: "/women-entrepreneurs.jpg",
    icon: Heart,
  },
  {
    title: "Persons with disabilities",
    description:
      "Ensuring urban planning, services and infrastructure are accessible and responsive to diverse needs.",
    image: "/community-development-meeting.jpg",
    icon: Accessibility,
  },
  {
    title: "Low-income urban households",
    description:
      "Working with families facing poverty to improve livelihoods, housing conditions and access to basic services.",
    image: "/tpi-image-2.jpeg",
    icon: Home,
  },
  {
    title: "Local governments and urban authorities",
    description:
      "Strengthening the capacity, data and processes that make public institutions more inclusive and accountable.",
    image: "/local-government-partnership.jpg",
    icon: Landmark,
  },
];

export function TargetGroups() {
  return (
    <section className="bg-navy py-20 text-white lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow="Who We Work With"
          heading="Our work centres on people and institutions too often left out of urban planning."
          body="When the most excluded residents have voice and agency, cities improve for everyone."
          align="center"
          className="mx-auto mb-16 [&_h2]:text-white [&_p]:text-white/80"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, index) => {
            const Icon = group.icon;
            const isWide = index === 0 || index === 3;
            return (
              <article
                key={group.title}
                className={`group relative overflow-hidden rounded-2xl ${
                  isWide ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={group.image}
                    alt={group.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold text-navy">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="heading-display text-xl text-white md:text-2xl">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {group.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
