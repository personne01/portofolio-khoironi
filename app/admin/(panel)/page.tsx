"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import type { AdminStats } from "@/lib/admin/dto";
import { ErrorBanner } from "@/components/admin/fields";

const SHORTCUTS = [
  { href: "/admin/projects/new", label: "New project" },
  { href: "/admin/skills/new", label: "New skill" },
  { href: "/admin/experience/new", label: "New experience" },
  { href: "/admin/articles/new", label: "New article" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminApi
      .stats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof ApiClientError ? caught.message : "Unable to load statistics");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <ErrorBanner message={error} />
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">Content currently stored in the database.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats === null ? (
          <p className="col-span-full text-sm text-[var(--muted-foreground)]">Loading…</p>
        ) : (
          <>
            <Stat label="Projects" value={stats.totalProjects} />
            <Stat label="Published" value={stats.publishedProjects} />
            <Stat label="Drafts" value={stats.draftProjects} />
            <Stat label="Articles" value={stats.totalArticles} />
            <Stat label="Skills" value={stats.totalSkills} />
            <Stat label="Experience" value={stats.totalExperiences} />
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[var(--border)] pt-4">
        {SHORTCUTS.map((shortcut) => (
          <Link
            key={shortcut.href}
            href={shortcut.href}
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:border-[var(--primary)]"
          >
            {shortcut.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-[var(--muted-foreground)]">{label}</p>
    </div>
  );
}
