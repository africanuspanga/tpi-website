import { notFound } from "next/navigation";
import { getImpactStory } from "@/actions/admin/impact";
import { getProjects, getThematicAreas } from "@/actions/admin/projects";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { ImpactStoryForm } from "@/components/admin/ImpactStoryForm";

export const metadata = { title: "Edit Impact Story | TPi Admin" };

export default async function EditImpactStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [story, projects, thematicAreas] = await Promise.all([
    getImpactStory(id),
    getProjects(),
    getThematicAreas(),
  ]);
  if (!story) notFound();

  return (
    <AdminFormShell title={`Edit: ${story.title}`} backHref="/admin/impact">
      <ImpactStoryForm
        story={story}
        projects={projects.map((p) => ({ id: p.id, label: p.title }))}
        thematicAreas={thematicAreas.map((a) => ({ id: a.id, label: a.name }))}
      />
    </AdminFormShell>
  );
}
