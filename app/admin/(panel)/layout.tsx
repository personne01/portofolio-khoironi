import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (admin === null) redirect("/admin/login");

  return <AdminShell username={admin.username}>{children}</AdminShell>;
}
