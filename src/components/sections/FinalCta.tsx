import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 lg:py-32">
      {/* Ambient colour glows */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-urban-blue blur-3xl" />
      </div>
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="container-tpi relative z-10 text-center">
        <Reveal>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Partner With TPi
          </span>
          <h2 className="heading-display mx-auto max-w-4xl text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            Let us build more inclusive and resilient cities together.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Partner with TPi to support communities, strengthen institutions and
            develop practical solutions for Tanzania&apos;s urban future.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 bg-gold px-8 text-base text-navy shadow-lg shadow-gold/20 hover:bg-gold/90"
            >
              <Link href="/get-involved">Become a Partner</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-white/40 bg-white/5 px-8 text-base text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
            >
              <Link href="/contact">Contact TPi</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
