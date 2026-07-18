import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { PageForm } from "@/components/admin/PageForm";

export const metadata = { title: "New Page | TPi Admin" };

export default function NewPagePage() {
  return (
    <AdminFormShell title="New page" backHref="/admin/pages">
      <PageForm />
    </AdminFormShell>
  );
}
