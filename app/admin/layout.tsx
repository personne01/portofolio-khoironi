import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Khoironi Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">{children}</div>;
}
