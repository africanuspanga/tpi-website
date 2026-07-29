import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/actions/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  const user = await getAdminUser();
  if (user) redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy p-4">
      {/* Ambient brand glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-urban-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <Image
            src="/tpi-logo.png"
            alt="TPi Tanzania"
            width={1448}
            height={1086}
            className="mx-auto mb-4 h-16 w-auto object-contain"
            priority
          />
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
