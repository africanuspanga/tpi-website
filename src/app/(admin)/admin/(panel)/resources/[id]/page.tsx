import { notFound } from "next/navigation";
import { getResource } from "@/actions/admin/resources";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { ResourceForm } from "@/components/admin/ResourceForm";

export const metadata = { title: "Edit Resource | TPi Admin" };

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resource = await getResource(id);
  if (!resource) notFound();

  return (
    <AdminFormShell title={`Edit: ${resource.title}`} backHref="/admin/resources">
      <ResourceForm resource={resource} />
    </AdminFormShell>
  );
}
