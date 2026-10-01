"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi } from "@/lib/admin/client";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminShell({ username, children }: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    try {
      await adminApi.logout();
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-[var(--border)] p-4 md:flex">
        <p className="px-2 pb-3 text-sm font-semibold tracking-wide">Admin</p>
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-2 py-1.5 text-sm ${
                active ? "bg-[var(--muted)] font-medium" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <div className="mt-auto border-t border-[var(--border)] pt-3">
          <p className="px-2 pb-2 text-xs text-[var(--muted-foreground)]">Signed in as {username}</p>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="w-full rounded-md border border-[var(--border)] px-2 py-1.5 text-left text-sm hover:border-[var(--primary)] disabled:opacity-50"
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 overflow-x-auto border-b border-[var(--border)] px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap text-sm text-[var(--muted-foreground)]">
              {item.label}
            </Link>
          ))}
          <button type="button" onClick={signOut} className="ml-auto whitespace-nowrap text-sm text-[var(--muted-foreground)]">
            Sign out
          </button>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">{children}</main>
      </div>
    </div>
  );
}
