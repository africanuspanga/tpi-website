import { getProjects } from "@/actions/admin/projects";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminDataView } from "@/components/admin/AdminDataView";

export const metadata = { title: "Projects | TPi Admin" };

export default async function AdminProjectsPage() {
  const rows = await getProjects();
  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Publish and manage TPi's project portfolio."
        newHref="/admin/projects/new"
        newLabel="New project"
      />
      <AdminDataView
        rows={rows}
        entity="projects"
        basePath="/admin/projects"
        viewBase="/projects"
        columns={[
          { key: "title", header: "Title" },
          { key: "location", header: "Location" },
          { key: "project_status", header: "Stage" },
          { key: "publication_status", header: "Status", type: "status" },
          { key: "is_featured", header: "Featured", type: "featured" },
          { key: "updated_at", header: "Updated", type: "date" },
        ]}
      />
    </div>
  );
}
