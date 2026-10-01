"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiClientError } from "@/lib/admin/client";
import { ErrorBanner } from "@/components/admin/fields";
import { ResourceList, type ListColumn } from "@/components/admin/ResourceList";

type Deletable = { id: number; deletedAt: string | null };

/**
 * Shared shell for the six admin collection pages. Each page supplies its own
 * loader, mutators and column set; loading state, the include-deleted toggle and
 * the soft-delete/restore round trip are identical for every resource.
 */
export default function ResourceListPage<T extends Deletable>({
  title,
  description,
  newLabel,
  newHref,
  load,
  remove,
  restore,
  columns,
}: {
  title: string;
  description: string;
  newLabel: string;
  newHref: string;
  load: (includeDeleted: boolean) => Promise<T[]>;
  remove: (id: number) => Promise<unknown>;
  restore: (id: number) => Promise<unknown>;
  columns: ListColumn<T>[];
}) {
  const [rows, setRows] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const refresh = () => {
    setPending(true);
    setError(null);
    load(includeDeleted)
      .then(setRows)
      .catch((caught: unknown) => {
        setError(caught instanceof ApiClientError ? caught.message : "Unable to load records");
      })
      .finally(() => setPending(false));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDeleted]);

  async function handleDelete(row: T) {
    if (!confirm(`Delete this ${title.toLowerCase()}? It will be soft-deleted.`)) return;
    setPending(true);
    try {
      await remove(row.id);
      refresh();
    } catch (caught: unknown) {
      setError(caught instanceof ApiClientError ? caught.message : "Delete failed");
      setPending(false);
    }
  }

  async function handleRestore(row: T) {
    setPending(true);
    try {
      await restore(row.id);
      refresh();
    } catch (caught: unknown) {
      setError(caught instanceof ApiClientError ? caught.message : "Restore failed");
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeDeleted}
              onChange={(event) => setIncludeDeleted(event.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            Include deleted
          </label>
          <Link
            href={newHref}
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:border-[var(--primary)]"
          >
            {newLabel}
          </Link>
        </div>
      </div>
      <ErrorBanner message={error} />
      <ResourceList
        rows={rows}
        columns={columns}
        getKey={(row) => row.id}
        isDeleted={(row) => row.deletedAt !== null}
        editHref={(row) => `${newHref.replace(/\/new$/, "")}/${row.id}`}
        onDelete={handleDelete}
        onRestore={handleRestore}
        error={null}
        pending={pending}
      />
    </div>
  );
}
