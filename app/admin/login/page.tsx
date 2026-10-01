import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin !== null) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-semibold">Admin sign in</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Use your admin credentials to continue.</p>
        <LoginForm />
      </div>
    </main>
  );
}
