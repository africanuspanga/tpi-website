import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string | null;
  heading?: string | null;
  body?: string | null;
  align?: "left" | "center";
  className?: string;
  headingClassName?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  body,
  align = "left",
  className,
  headingClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="label-eyebrow mb-4 block text-gold">{eyebrow}</span>
      )}
      {heading && (
        <h2
          className={cn(
            "heading-display text-3xl text-navy md:text-4xl lg:text-5xl",
            headingClassName
          )}
        >
          {heading}
        </h2>
      )}
      {body && (
        <p className="body-large mt-4 text-body/80">{body}</p>
      )}
    </div>
  );
}
