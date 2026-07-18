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
        <span
          className={cn(
            "mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-gold",
            align === "center" && "justify-center"
          )}
        >
          <span className="h-px w-8 bg-gold/70" />
          {eyebrow}
          {align === "center" && <span className="h-px w-8 bg-gold/70" />}
        </span>
      )}
      {heading && (
        <h2
          className={cn(
            "heading-display text-3xl leading-tight text-navy md:text-4xl lg:text-[2.75rem]",
            headingClassName
          )}
        >
          {heading}
        </h2>
      )}
      {body && <p className="body-large mt-5 text-body/80">{body}</p>}
    </div>
  );
}
