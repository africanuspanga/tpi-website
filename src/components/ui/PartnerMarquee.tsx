"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Partner } from "@/types/supabase";

interface PartnerMarqueeProps {
  partners: Partner[];
  className?: string;
}

export function PartnerMarquee({ partners, className }: PartnerMarqueeProps) {
  if (partners.length === 0) return null;

  // Duplicate partners to create seamless loop
  const items = [...partners, ...partners];

  return (
    <div
      className={cn(
        "group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div className="flex w-max animate-marquee items-center gap-12 group-hover:[animation-play-state:paused] md:gap-16">
        {items.map((partner, index) => (
          <a
            key={`${partner.id}-${index}`}
            href={partner.website_url || "#"}
            target={partner.website_url ? "_blank" : undefined}
            rel={partner.website_url ? "noopener noreferrer" : undefined}
            className="flex h-20 w-40 shrink-0 items-center justify-center rounded-lg bg-white px-4 py-3 ring-1 ring-border/60 transition-shadow hover:ring-gold/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={partner.name}
          >
            {partner.logo_url ? (
              <Image
                src={partner.logo_url}
                alt={partner.name}
                width={140}
                height={64}
                className="max-h-12 w-auto object-contain"
                unoptimized={partner.logo_url.startsWith("http")}
              />
            ) : (
              <span className="text-sm font-semibold text-navy">
                {partner.name}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
