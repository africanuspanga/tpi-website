import { getProjects, getThematicAreas } from "@/actions/admin/projects";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { ImpactStoryForm } from "@/components/admin/ImpactStoryForm";

export const metadata = { title: "New Impact Story | TPi Admin" };

export default async function NewImpactStoryPage() {
  const [projects, thematicAreas] = await Promise.all([getProjects(), getThematicAreas()]);

  return (
    <AdminFormShell title="New impact story" backHref="/admin/impact">
      <ImpactStoryForm
        projects={projects.map((p) => ({ id: p.id, label: p.title }))}
        thematicAreas={thematicAreas.map((a) => ({ id: a.id, label: a.name }))}
      />
    </AdminFormShell>
  );
}
