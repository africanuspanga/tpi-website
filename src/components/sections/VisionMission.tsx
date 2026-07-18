export function VisionMission() {
  return (
    <section className="bg-soft-bg py-20 lg:py-28">
      <div className="container-tpi">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Vision */}
          <div className="relative overflow-hidden rounded-2xl bg-navy p-8 text-white md:p-12">
            <div className="absolute left-0 top-0 h-1.5 w-24 bg-gold" />
            <span className="label-eyebrow mb-4 block text-gold">Our Vision</span>
            <h2 className="heading-display text-3xl text-white md:text-4xl">
              Tanzanian cities where every person lives with dignity, opportunity
              and resilience.
            </h2>
            <p className="mt-6 text-white/80 leading-relaxed">
              We imagine urban neighbourhoods that are planned with residents, not
              for them; where public systems respond to the needs of the most
              excluded; and where economic, social and environmental progress is
              shared.
            </p>
          </div>

          {/* Mission */}
          <div className="relative overflow-hidden rounded-2xl bg-white p-8 md:p-12">
            <div className="absolute left-0 top-0 h-1.5 w-24 bg-urban-blue" />
            <span className="label-eyebrow mb-4 block text-urban-blue">
              Our Mission
            </span>
            <h2 className="heading-display text-3xl text-navy md:text-4xl">
              Partner with communities and institutions to advance inclusive,
              evidence-based urban change.
            </h2>
            <p className="mt-6 text-body/80 leading-relaxed">
              Through co-design, implementation, learning and advocacy, we help
              cities become more equitable, accountable and prepared for a changing
              climate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
