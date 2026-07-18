import { getThematicAreas } from "@/actions/admin/projects";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = { title: "New Project | TPi Admin" };

export default async function NewProjectPage() {
  const thematicAreas = await getThematicAreas();
  return (
    <AdminFormShell title="New project" backHref="/admin/projects">
      <ProjectForm thematicAreas={thematicAreas} />
    </AdminFormShell>
  );
}
