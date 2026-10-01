"use client";

import type { AdminTechnology } from "@/lib/admin/dto";
import { TextInput } from "@/components/admin/fields";

/**
 * Editor for the nested `technologies: [{ name, sortOrder }]` array shared by
 * projects and experience entries. `sortOrder` follows the current row order,
 * so the operator never types it; the server still re-validates it.
 */
export default function TechListEditor({ value, onChange, idPrefix }: {
  value: AdminTechnology[];
  onChange: (value: AdminTechnology[]) => void;
  idPrefix: string;
}) {
  function rename(index: number, name: string) {
    onChange(value.map((tech, position) => (position === index ? { ...tech, name } : tech)));
  }

  function remove(index: number) {
    onChange(value.filter((_, position) => position !== index).map((tech, position) => ({ ...tech, sortOrder: position })));
  }

  function add() {
    onChange([...value, { name: "", sortOrder: value.length }]);
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const moved = next[index];
    const displaced = next[target];
    if (moved === undefined || displaced === undefined) return;
    next[index] = displaced;
    next[target] = moved;
    onChange(next.map((tech, position) => ({ ...tech, sortOrder: position })));
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length === 0 && <p className="text-xs text-[var(--muted-foreground)]">No technologies listed yet.</p>}
      {value.map((tech, index) => (
        <div key={`${idPrefix}-tech-${index}`} className="flex items-center gap-2">
          <div className="flex-1">
            <TextInput
              id={`${idPrefix}-tech-${index}`}
              value={tech.name}
              onChange={(name) => rename(index, name)}
              placeholder="Technology name"
            />
          </div>
          <button
            type="button"
            onClick={() => move(index, -1)}
            disabled={index === 0}
            className="rounded-md border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-40"
            aria-label="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => move(index, 1)}
            disabled={index === value.length - 1}
            className="rounded-md border border-[var(--border)] px-2 py-1 text-xs disabled:opacity-40"
            aria-label="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-300"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:border-[var(--primary)]"
      >
        Add technology
      </button>
    </div>
  );
}
