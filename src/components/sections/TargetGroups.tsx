import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  Users,
  Heart,
  Accessibility,
  Home,
  Landmark,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons are stored as names so they survive a round-trip through the database.
 * Anything unrecognised falls back to `Users` rather than breaking the render.
 */
const ICONS: Record<string, LucideIcon> = {
  users: Users,
  heart: Heart,
  accessibility: Accessibility,
  home: Home,
  landmark: Landmark,
};

export type TargetGroupItem = {
  title: string;
  description: string;
  image: string;
  icon: string;
};

export type TargetGroupsContent = {
  eyebrow: string;
  heading: string;
  body: string;
  items: TargetGroupItem[];
};

export function TargetGroups({ content }: { content: TargetGroupsContent }) {
  const groups = content.items ?? [];
  if (groups.length === 0) return null;

  return (
    <section className="bg-navy py-20 text-white lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow={content.eyebrow}
          heading={content.heading}
          body={content.body}
          align="center"
          className="mx-auto mb-16 [&_h2]:text-white [&_p]:text-white/80"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group, index) => {
            const Icon = ICONS[group.icon?.toLowerCase()] ?? Users;
            const isWide = index === 0 || index === 3;
            return (
              <article
                key={`${group.title}-${index}`}
                className={`group relative overflow-hidden rounded-2xl ${
                  isWide ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {group.image ? (
                    <Image
                      src={group.image}
                      alt={group.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-navy-light" />
                  )}
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
