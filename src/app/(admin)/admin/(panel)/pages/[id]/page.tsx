import { notFound } from "next/navigation";
import { getPage } from "@/actions/admin/pages";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { PageForm } from "@/components/admin/PageForm";

export const metadata = { title: "Edit Page | TPi Admin" };

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPage(id);
  if (!page) notFound();

  return (
    <AdminFormShell title={`Edit: ${page.title}`} backHref="/admin/pages">
      <PageForm page={page} />
    </AdminFormShell>
  );
}
