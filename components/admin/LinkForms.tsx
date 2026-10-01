"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import type { AdminNavLink, AdminSocialLink } from "@/lib/admin/dto";
import { ErrorBanner, Field, SubmitButton, TextInput } from "@/components/admin/fields";

export function NavLinkForm({ initial }: { initial?: AdminNavLink }) {
  const router = useRouter();
  const [url, setUrl] = useState(initial?.url ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const input = { url, label, sortOrder, isVisible };
    try {
      if (initial === undefined) await adminApi.createNavLink(input);
      else await adminApi.updateNavLink(initial.id, input);
      router.replace("/admin/settings");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiClientError ? caught.message : "Unable to save nav link");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <ErrorBanner message={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Label" htmlFor="nav-label">
          <TextInput id="nav-label" value={label} onChange={setLabel} />
        </Field>
        <Field label="URL" htmlFor="nav-url" hint="Absolute https:// URL, a /path, or a #fragment.">
          <TextInput id="nav-url" value={url} onChange={setUrl} />
        </Field>
        <Field label="Sort order" htmlFor="nav-sort">
          <TextInput id="nav-sort" value={String(sortOrder)} onChange={(v) => setSortOrder(Number(v))} />
        </Field>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
          Visible
        </label>
      </div>
      <SubmitButton pending={pending} pendingLabel="Saving…">
        {initial === undefined ? "Create nav link" : "Save nav link"}
      </SubmitButton>
    </form>
  );
}

export function SocialLinkForm({ initial }: { initial?: AdminSocialLink }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const input = { name, url, icon, sortOrder, isVisible };
    try {
      if (initial === undefined) await adminApi.createSocialLink(input);
      else await adminApi.updateSocialLink(initial.id, input);
      router.replace("/admin/settings");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiClientError ? caught.message : "Unable to save social link");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <ErrorBanner message={error} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="social-name">
          <TextInput id="social-name" value={name} onChange={setName} />
        </Field>
        <Field label="Icon" htmlFor="social-icon">
          <TextInput id="social-icon" value={icon} onChange={setIcon} />
        </Field>
        <Field label="URL" htmlFor="social-url">
          <TextInput id="social-url" value={url} onChange={setUrl} />
        </Field>
        <Field label="Sort order" htmlFor="social-sort">
          <TextInput id="social-sort" value={String(sortOrder)} onChange={(v) => setSortOrder(Number(v))} />
        </Field>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
          Visible
        </label>
      </div>
      <SubmitButton pending={pending} pendingLabel="Saving…">
        {initial === undefined ? "Create social link" : "Save social link"}
      </SubmitButton>
    </form>
  );
}
