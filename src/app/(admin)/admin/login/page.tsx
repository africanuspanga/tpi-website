import { redirect } from "next/navigation";
import { getAdminUser } from "@/actions/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  const user = await getAdminUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-soft-bg p-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">TPi Admin</h1>
          <p className="mt-2 text-sm text-muted-text">
            Sign in to manage the TPi Tanzania website.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
