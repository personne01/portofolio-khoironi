"use client";

import { useEffect, useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import type { AdminNavLink } from "@/lib/admin/dto";
import { Card, ErrorBanner } from "@/components/admin/fields";
import { NavLinkForm } from "@/components/admin/LinkForms";

export default function EditNavLink({ id }: { id: string }) {
  const [row, setRow] = useState<AdminNavLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived during render: validating inside the effect trips react-hooks/set-state-in-effect.
  const navId = Number(id);
  const invalidId = !Number.isInteger(navId) || navId <= 0;

  useEffect(() => {
    if (invalidId) return;
    let active = true;
    adminApi
      .listNavLinks(true)
      .then((rows) => {
        if (!active) return;
        const found = rows.find((candidate) => candidate.id === navId);
        if (found === undefined) setError("Nav link not found");
        else setRow(found);
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof ApiClientError ? caught.message : "Unable to load nav link");
      });
    return () => {
      active = false;
    };
  }, [invalidId, navId]);

  if (invalidId) {
    return (
      <Card title="Nav link">
        <ErrorBanner message="Invalid nav link id" />
      </Card>
    );
  }

  if (error !== null) {
    return (
      <Card title="Nav link">
        <ErrorBanner message={error} />
      </Card>
    );
  }

  return (
    <Card title="Edit nav link" description={row?.label}>
      {row === null ? <p className="text-sm text-[var(--muted-foreground)]">Loading…</p> : <NavLinkForm initial={row} />}
    </Card>
  );
}
