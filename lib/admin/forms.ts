import type { AdminTechnology } from "@/lib/admin/dto";

/**
 * Form-boundary conversions. DTOs carry dates as ISO-8601 strings while the
 * admin API only accepts exact `YYYY-MM-DD`, so every date crossing this
 * boundary is converted here rather than duplicated across forms.
 */

/** ISO-8601 (or already-trimmed) date to the value a `<input type="date">` needs. */
export const toDateInput = (value: string | null): string => (value === null ? "" : value.slice(0, 10));

/** Empty date input to `null`; the API treats `null` as "no end date". */
export const toNullableDate = (value: string): string | null => (value === "" ? null : value);

/** Empty text input to `null`, so optional fields store absence instead of "". */
export const toNullableText = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

/**
 * Drops blank rows the operator started but never filled in, then re-indexes
 * `sortOrder` contiguously. The server still re-validates every entry.
 */
export const normalizeTechnologies = (technologies: AdminTechnology[]): AdminTechnology[] =>
  technologies
    .filter((tech) => tech.name.trim() !== "")
    .map((tech, index) => ({ name: tech.name.trim(), sortOrder: index }));
