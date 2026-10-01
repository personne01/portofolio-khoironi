"use client";

import { useEffect, useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import type { AdminSocialLink } from "@/lib/admin/dto";
import { Card, ErrorBanner } from "@/components/admin/fields";
import { SocialLinkForm } from "@/components/admin/LinkForms";

export default function EditSocialLink({ id }: { id: string }) {
  const [row, setRow] = useState<AdminSocialLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived during render: validating inside the effect trips react-hooks/set-state-in-effect.
  const socialId = Number(id);
  const invalidId = !Number.isInteger(socialId) || socialId <= 0;

  useEffect(() => {
    if (invalidId) return;
    let active = true;
    adminApi
      .listSocialLinks(true)
      .then((rows) => {
        if (!active) return;
        const found = rows.find((candidate) => candidate.id === socialId);
        if (found === undefined) setError("Social link not found");
        else setRow(found);
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof ApiClientError ? caught.message : "Unable to load social link");
      });
    return () => {
      active = false;
    };
  }, [invalidId, socialId]);

  if (invalidId) {
    return (
      <Card title="Social link">
        <ErrorBanner message="Invalid social link id" />
      </Card>
    );
  }

  if (error !== null) {
    return (
      <Card title="Social link">
        <ErrorBanner message={error} />
      </Card>
    );
  }

  return (
    <Card title="Edit social link" description={row?.name}>
      {row === null ? <p className="text-sm text-[var(--muted-foreground)]">Loading…</p> : <SocialLinkForm initial={row} />}
    </Card>
  );
}
