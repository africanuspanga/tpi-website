import { notFound } from "next/navigation";
import { getTeamMember } from "@/actions/admin/team";
import { AdminFormShell } from "@/components/admin/AdminPageHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export const metadata = { title: "Edit Team Member | TPi Admin" };

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getTeamMember(id);
  if (!member) notFound();

  return (
    <AdminFormShell title={`Edit: ${member.full_name}`} backHref="/admin/team">
      <TeamMemberForm member={member} />
    </AdminFormShell>
  );
}
