"use client";

import type { ReactNode } from "react";

const inputClass =
  "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]";

export function Field({ label, htmlFor, error, hint, children }: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </label>
      {children}
      {hint !== undefined && <p className="text-xs text-[var(--muted-foreground)]">{hint}</p>}
      {error !== undefined && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function TextInput({ id, value, onChange, ...rest }: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "date" | "url" | "password";
}) {
  return (
    <input
      id={id}
      type={rest.type ?? "text"}
      value={value}
      placeholder={rest.placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    />
  );
}

export function TextArea({ id, value, onChange, rows = 4 }: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    />
  );
}

export function NumberInput({ id, value, onChange, min, max }: {
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <input
      id={id}
      type="number"
      value={String(value)}
      min={min}
      max={max}
      onChange={(event) => onChange(Number(event.target.value))}
      className={inputClass}
    />
  );
}

export function SelectInput<T extends number>({ id, value, onChange, options, emptyLabel }: {
  id: string;
  value: T;
  onChange: (value: T) => void;
  options: { id: number; label: string }[];
  emptyLabel?: string;
}) {
  return (
    <select
      id={id}
      value={String(value)}
      onChange={(event) => onChange(Number(event.target.value) as T)}
      className={inputClass}
    >
      {emptyLabel !== undefined && <option value="0">{emptyLabel}</option>}
      {options.map((option) => (
        <option key={option.id} value={String(option.id)}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({ id, checked, onChange, label }: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[var(--primary)]"
      />
      {label}
    </label>
  );
}

export function SubmitButton({ pending, children, pendingLabel = "Saving…" }: {
  pending: boolean;
  children: ReactNode;
  pendingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] disabled:opacity-50"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string | null }) {
  if (message === null) return null;
  return (
    <div role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }: { message: string | null }) {
  if (message === null) return null;
  return (
    <div role="status" className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
      {message}
    </div>
  );
}

export function Card({ title, description, children }: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 p-5">
      <h2 className="text-base font-semibold">{title}</h2>
      {description !== undefined && <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}
