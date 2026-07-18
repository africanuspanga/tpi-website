import { getImpactMetrics } from "@/lib/data/queries";
import { SectionHeader } from "@/components/ui/SectionHeader";

export async function ImpactMetrics() {
  const metrics = await getImpactMetrics();

  if (metrics.length === 0) return null;

  return (
    <section className="bg-soft-bg py-20 lg:py-28">
      <div className="container-tpi">
        <SectionHeader
          eyebrow="Impact"
          heading="Results that matter to people and systems."
          body="We report only verified, active metrics. Where data is still being gathered, we say so."
          align="center"
          className="mx-auto mb-16"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.id}
              className="rounded-2xl bg-white p-6 ring-1 ring-border/60"
            >
              <div className="heading-display text-4xl text-navy lg:text-5xl">
                {metric.value}
              </div>
              <h3 className="mt-3 font-semibold text-navy">{metric.label}</h3>
              {metric.description && (
                <p className="mt-2 text-sm text-body/80">{metric.description}</p>
              )}
              {(metric.reporting_period || metric.source) && (
                <p className="mt-4 text-xs text-muted-text">
                  {metric.reporting_period}
                  {metric.reporting_period && metric.source && " · "}
                  {metric.source}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
