import type { ReactNode } from "react";

export type PageHeroContent = {
  eyebrow?: string;
  heading?: string;
  body?: string;
};

/**
 * The dark banner every inner page opens with.
 *
 * Content comes from the editable `<page>/hero` block, so the eyebrow, heading
 * and intro paragraph are all managed from Admin → Content. Pages that need
 * extra furniture below the copy (filter chips, CTA buttons) pass it as
 * children.
 */
export function PageHero({
  content,
  align = "left",
  headingClassName = "",
  children,
}: {
  content: PageHeroContent;
  align?: "left" | "center";
  headingClassName?: string;
  children?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <section className="bg-navy py-24 lg:py-32">
      <div className={`container-tpi ${centered ? "text-center" : ""}`}>
        {content.eyebrow ? (
          <span className="label-eyebrow mb-4 block text-gold">
            {content.eyebrow}
          </span>
        ) : null}
        <h1
          className={`heading-display text-4xl text-white md:text-5xl lg:text-6xl ${
            centered ? "mx-auto max-w-4xl" : ""
          } ${headingClassName}`}
        >
          {content.heading}
        </h1>
        {content.body ? (
          <p
            className={`mt-6 max-w-2xl text-lg leading-relaxed text-white/80 ${
              centered ? "mx-auto" : ""
            }`}
          >
            {content.body}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
