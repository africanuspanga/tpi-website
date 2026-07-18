import { getResources } from "@/actions/admin/resources";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataView } from "@/components/admin/AdminDataView";

export const metadata = { title: "Resources | TPi Admin" };

export default async function AdminResourcesPage() {
  const rows = await getResources();
  return (
    <div>
      <AdminPageHeader
        title="Resources"
        description="Publish reports, policy briefs, research and toolkits."
        newHref="/admin/resources/new"
        newLabel="New resource"
      />
      <AdminDataView
        rows={rows}
        entity="resources"
        basePath="/admin/resources"
        viewBase="/resources"
        columns={[
          { key: "title", header: "Title" },
          { key: "resource_type", header: "Type" },
          { key: "status", header: "Status", type: "status" },
          { key: "is_featured", header: "Featured", type: "featured" },
          { key: "updated_at", header: "Updated", type: "date" },
        ]}
      />
    </div>
  );
}
