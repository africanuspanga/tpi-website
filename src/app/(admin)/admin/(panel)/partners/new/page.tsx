import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { PartnerForm } from "@/components/admin/PartnerForm";

export const metadata = { title: "New Partner | TPi Admin" };

export default function NewPartnerPage() {
  return (
    <AdminFormShell title="New partner" backHref="/admin/partners">
      <PartnerForm />
    </AdminFormShell>
  );
}
