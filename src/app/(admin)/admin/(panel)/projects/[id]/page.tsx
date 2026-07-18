import { notFound } from "next/navigation";
import { getProject, getThematicAreas } from "@/actions/admin/projects";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = { title: "Edit Project | TPi Admin" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, thematicAreas] = await Promise.all([
    getProject(id),
    getThematicAreas(),
  ]);
  if (!project) notFound();

  return (
    <AdminFormShell title={`Edit: ${project.title}`} backHref="/admin/projects">
      <ProjectForm project={project} thematicAreas={thematicAreas} />
    </AdminFormShell>
  );
}
