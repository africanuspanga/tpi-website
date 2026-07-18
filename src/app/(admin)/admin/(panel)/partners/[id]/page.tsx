import { notFound } from "next/navigation";
import { getPartner } from "@/actions/admin/partners";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { PartnerForm } from "@/components/admin/PartnerForm";

export const metadata = { title: "Edit Partner | TPi Admin" };

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await getPartner(id);
  if (!partner) notFound();

  return (
    <AdminFormShell title={`Edit: ${partner.name}`} backHref="/admin/partners">
      <PartnerForm partner={partner} />
    </AdminFormShell>
  );
}
