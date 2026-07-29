import { getImpactStories, getImpactMetrics } from "@/actions/admin/impact";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ImpactStoriesTable } from "@/components/admin/ImpactStoriesTable";
import { ImpactMetricsManager } from "@/components/admin/ImpactMetricsManager";

export const metadata = { title: "Impact | TPi Admin" };

export default async function AdminImpactPage() {
  const [stories, metrics] = await Promise.all([getImpactStories(), getImpactMetrics()]);

  return (
    <div className="space-y-10">
      <AdminPageHeader
        title="Impact"
        description="Manage the impact stories and headline metrics shown on the Impact page."
      />
      <ImpactStoriesTable rows={stories} />
      <ImpactMetricsManager metrics={metrics} />
    </div>
  );
}
