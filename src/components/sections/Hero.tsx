import Link from "next/link";
import { Button } from "@/components/ui/button";

const floatingLabels = [
  "Inclusive Cities",
  "Poverty Reduction",
  "Climate Resilience",
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        poster="/TPI IMAGE 1.jpeg"
      >
        <source src="/hero section background.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-navy/70" />

      {/* Content */}
      <div className="container-tpi relative z-10 py-32 pt-40">
        <div className="max-w-4xl">
          <span className="label-eyebrow mb-6 inline-block text-gold">
            Advancing Inclusive Urban Development in Tanzania
          </span>

          <h1 className="heading-display text-5xl text-white md:text-7xl lg:text-8xl">
            Better Cities.
            <br />
            Better Lives.
          </h1>

          <p className="body-large mt-6 max-w-2xl text-white/80">
            TPi Tanzania partners with communities, local governments and allies to
            make cities more inclusive, resilient and just — so every resident can
            thrive.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              asChild
              className="bg-gold px-6 text-navy hover:bg-gold/90"
            >
              <Link href="/what-we-do">Explore Our Work</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/get-involved">Partner With TPi</Link>
            </Button>
          </div>
        </div>

        {/* Floating labels */}
        <div className="mt-16 flex flex-wrap gap-3">
          {floatingLabels.map((label) => (
            <span
              key={label}
              className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
