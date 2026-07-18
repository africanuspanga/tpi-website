import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { ResourceForm } from "@/components/admin/ResourceForm";

export const metadata = { title: "New Resource | TPi Admin" };

export default function NewResourcePage() {
  return (
    <AdminFormShell title="New resource" backHref="/admin/resources">
      <ResourceForm />
    </AdminFormShell>
  );
}
