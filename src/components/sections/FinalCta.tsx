import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 lg:py-32">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-urban-blue blur-3xl" />
      </div>

      <div className="container-tpi relative z-10 text-center">
        <span className="label-eyebrow mb-4 inline-block text-gold">
          Partner With TPi
        </span>
        <h2 className="heading-display mx-auto max-w-4xl text-4xl text-white md:text-5xl lg:text-6xl">
          Let us build more inclusive and resilient cities together.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
          Partner with TPi to support communities, strengthen institutions and
          develop practical solutions for Tanzania's urban future.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            asChild
            className="bg-gold px-8 text-navy hover:bg-gold/90"
          >
            <Link href="/get-involved">Become a Partner</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white px-8 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/contact">Contact TPi</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
