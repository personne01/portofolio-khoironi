"use client";

import type { ReactNode } from "react";

export type ListColumn<T> = { header: string; render: (row: T) => ReactNode };

/**
 * Shared table for the admin resources: renders rows, and routes the
 * soft-delete / restore actions back to the caller so each page keeps its own
 * request wiring. Soft-deleted rows are dimmed and offer restore instead of
 * delete.
 */
export function ResourceList<T>({ rows, columns, getKey, isDeleted, editHref, onDelete, onRestore, error, pending }: {
  rows: T[];
  columns: ListColumn<T>[];
  getKey: (row: T) => number;
  isDeleted: (row: T) => boolean;
  editHref: (row: T) => string;
  onDelete: (row: T) => void;
  onRestore: (row: T) => void;
  error: string | null;
  pending: boolean;
}) {
  if (error !== null) {
    return <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
          <tr>
            {columns.map((column) => (
              <th key={column.header} className="px-3 py-2 font-medium">
                {column.header}
              </th>
            ))}
            <th className="px-3 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-3 py-6 text-center text-[var(--muted-foreground)]">
                Nothing here yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={getKey(row)} className={`border-b border-[var(--border)] last:border-0 ${isDeleted(row) ? "opacity-50" : ""}`}>
                {columns.map((column) => (
                  <td key={column.header} className="px-3 py-2 align-top">
                    {column.render(row)}
                  </td>
                ))}
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {isDeleted(row) ? (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => onRestore(row)}
                      className="rounded-md border border-[var(--border)] px-2 py-1 text-xs hover:border-[var(--primary)] disabled:opacity-50"
                    >
                      Restore
                    </button>
                  ) : (
                    <>
                      <a href={editHref(row)} className="mr-2 rounded-md border border-[var(--border)] px-2 py-1 text-xs hover:border-[var(--primary)]">
                        Edit
                      </a>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => onDelete(row)}
                        className="rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-300 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
