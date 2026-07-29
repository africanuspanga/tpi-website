import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { ThematicAreaForm } from "@/components/admin/ThematicAreaForm";

export const metadata = { title: "New Thematic Area | TPi Admin" };

export default function NewThematicAreaPage() {
  return (
    <AdminFormShell title="New thematic area" backHref="/admin/thematic-areas">
      <ThematicAreaForm />
    </AdminFormShell>
  );
}
