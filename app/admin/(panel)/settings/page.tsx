"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import type { AdminNavLink, AdminSocialLink } from "@/lib/admin/dto";
import { Card, ErrorBanner } from "@/components/admin/fields";
import { ResourceList } from "@/components/admin/ResourceList";

export default function AdminSettingsPage() {
  const [navs, setNavs] = useState<AdminNavLink[]>([]);
  const [socials, setSocials] = useState<AdminSocialLink[]>([]);
  const [navError, setNavError] = useState<string | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const load = () => {
    setPending(true);
    setNavError(null);
    setSocialError(null);
    Promise.all([adminApi.listNavLinks(includeDeleted), adminApi.listSocialLinks(includeDeleted)])
      .then(([n, s]) => {
        setNavs(n);
        setSocials(s);
      })
      .catch((c: unknown) => {
        const m = c instanceof ApiClientError ? c.message : "Unable to load settings";
        setNavError(m);
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDeleted]);

  async function delNav(row: AdminNavLink) {
    if (!confirm("Delete this nav link? It will be soft-deleted.")) return;
    setPending(true);
    try {
      await adminApi.deleteNavLink(row.id);
      load();
    } catch (c: unknown) {
      setNavError(c instanceof ApiClientError ? c.message : "Delete failed");
    } finally {
      setPending(false);
    }
  }

  async function resNav(row: AdminNavLink) {
    setPending(true);
    try {
      await adminApi.restoreNavLink(row.id);
      load();
    } catch (c: unknown) {
      setNavError(c instanceof ApiClientError ? c.message : "Restore failed");
    } finally {
      setPending(false);
    }
  }

  async function delSocial(row: AdminSocialLink) {
    if (!confirm("Delete this social link? It will be soft-deleted.")) return;
    setPending(true);
    try {
      await adminApi.deleteSocialLink(row.id);
      load();
    } catch (c: unknown) {
      setSocialError(c instanceof ApiClientError ? c.message : "Delete failed");
    } finally {
      setPending(false);
    }
  }

  async function resSocial(row: AdminSocialLink) {
    setPending(true);
    try {
      await adminApi.restoreSocialLink(row.id);
      load();
    } catch (c: unknown) {
      setSocialError(c instanceof ApiClientError ? c.message : "Restore failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Navigation and social links visible on the public site.</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={includeDeleted} onChange={(e) => setIncludeDeleted(e.target.checked)} />
          Include deleted
        </label>
      </div>

      <Card title="Navigation links">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted-foreground)]">Used in the public navigation bar.</p>
          <Link href="/admin/settings/nav/new" className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:border-[var(--primary)]">
            New nav link
          </Link>
        </div>
        <ErrorBanner message={navError} />
        <ResourceList
          rows={navs}
          columns={[
            { header: "Label", render: (r: AdminNavLink) => r.label },
            { header: "URL", render: (r: AdminNavLink) => <span className="break-all">{r.url}</span> },
            { header: "Sort", render: (r: AdminNavLink) => r.sortOrder },
            { header: "Visible", render: (r: AdminNavLink) => (r.isVisible ? "Yes" : "No") },
            { header: "Deleted", render: (r: AdminNavLink) => (r.deletedAt === null ? "No" : "Yes") },
          ]}
          getKey={(r) => r.id}
          isDeleted={(r) => r.deletedAt !== null}
          editHref={(r) => `/admin/settings/nav/${r.id}`}
          onDelete={delNav}
          onRestore={resNav}
          error={null}
          pending={pending}
        />
      </Card>

      <Card title="Social links">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted-foreground)]">Shown in the footer and contact area.</p>
          <Link href="/admin/settings/social/new" className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:border-[var(--primary)]">
            New social link
          </Link>
        </div>
        <ErrorBanner message={socialError} />
        <ResourceList
          rows={socials}
          columns={[
            { header: "Name", render: (r: AdminSocialLink) => r.name },
            { header: "Icon", render: (r: AdminSocialLink) => r.icon },
            { header: "URL", render: (r: AdminSocialLink) => <span className="break-all">{r.url}</span> },
            { header: "Sort", render: (r: AdminSocialLink) => r.sortOrder },
            { header: "Visible", render: (r: AdminSocialLink) => (r.isVisible ? "Yes" : "No") },
            { header: "Deleted", render: (r: AdminSocialLink) => (r.deletedAt === null ? "No" : "Yes") },
          ]}
          getKey={(r) => r.id}
          isDeleted={(r) => r.deletedAt !== null}
          editHref={(r) => `/admin/settings/social/${r.id}`}
          onDelete={delSocial}
          onRestore={resSocial}
          error={null}
          pending={pending}
        />
      </Card>
    </div>
  );
}
