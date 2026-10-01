"use client";

import { useEffect, useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import type { AdminCategories } from "@/lib/admin/dto";

type Identified = { id: number };

/**
 * Loads a single row by id. The admin API exposes collection reads only, so
 * edit forms resolve their record by filtering the list rather than fetching
 * `/resource/:id`. The id is validated during render — validating inside the
 * effect would set state synchronously and trip react-hooks/set-state-in-effect.
 */
export function useResourceById<T extends Identified>(
  load: (includeDeleted: boolean) => Promise<T[]>,
  id: string | undefined,
) {
  const [row, setRow] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const numericId = id === undefined ? null : Number(id);
  const invalidId = numericId !== null && (!Number.isInteger(numericId) || numericId <= 0);

  useEffect(() => {
    if (numericId === null || invalidId) return;
    let active = true;
    // Deleted rows stay editable so an accidental delete can be corrected here.
    load(true)
      .then((rows) => {
        if (!active) return;
        const found = rows.find((candidate) => candidate.id === numericId);
        if (found === undefined) setError("Record not found");
        else setRow(found);
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof ApiClientError ? caught.message : "Unable to load record");
      });
    return () => {
      active = false;
    };
  }, [load, numericId, invalidId]);

  return { row, error, invalidId, loading: numericId !== null && !invalidId && row === null && error === null };
}

/** Categories are read-only reference data needed by project and skill forms. */
export function useCategories() {
  const [categories, setCategories] = useState<AdminCategories | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminApi
      .categories()
      .then((result) => {
        if (active) setCategories(result);
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof ApiClientError ? caught.message : "Unable to load categories");
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, error, loading: categories === null && error === null };
}
