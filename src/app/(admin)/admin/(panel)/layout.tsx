import { redirect } from "next/navigation";
import { getAdminUser } from "@/actions/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={user} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto bg-gray-50/50 p-6">{children}</main>
      </div>
    </div>
  );
}
