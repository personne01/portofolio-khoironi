"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import type { AdminCategories, AdminSkill } from "@/lib/admin/dto";
import {
  Card,
  ErrorBanner,
  Field,
  NumberInput,
  SelectInput,
  SubmitButton,
  TextInput,
} from "@/components/admin/fields";
import { useCategories, useResourceById } from "@/components/admin/hooks";

/** Create/edit form for a skill. Level is bounded 0–100 by the server schema. */
export default function SkillForm({ id }: { id?: string }) {
  const { row, error, invalidId, loading } = useResourceById(adminApi.listSkills, id);
  const { categories, error: categoryError, loading: categoriesLoading } = useCategories();

  if (id !== undefined) {
    if (invalidId) {
      return (
        <Card title="Skill">
          <ErrorBanner message="Invalid skill id" />
        </Card>
      );
    }
    if (error !== null) {
      return (
        <Card title="Skill">
          <ErrorBanner message={error} />
        </Card>
      );
    }
    if (loading || row === null) {
      return (
        <Card title="Skill">
          <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>
        </Card>
      );
    }
    if (categoriesLoading) return <SkillCategoryGate />;
    return <SkillFormBody key={row.id} initial={row} categories={categories} categoryError={categoryError} />;
  }

  if (categoriesLoading) return <SkillCategoryGate />;
  return <SkillFormBody categories={categories} categoryError={categoryError} />;
}

/** As in `ProjectForm`: the body would otherwise submit `categoryId: 0`, which the server rejects. */
function SkillCategoryGate() {
  return (
    <Card title="Skill">
      <p className="text-sm text-[var(--muted-foreground)]">Loading categories…</p>
    </Card>
  );
}

function SkillFormBody({
  initial,
  categories,
  categoryError,
}: {
  initial?: AdminSkill;
  categories: AdminCategories | null;
  categoryError: string | null;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [level, setLevel] = useState(initial?.level ?? 0);
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? 0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const input = { name, level, sortOrder, categoryId };
    try {
      if (initial === undefined) await adminApi.createSkill(input);
      else await adminApi.updateSkill(initial.id, input);
      router.replace("/admin/skills");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiClientError ? caught.message : "Unable to save skill");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card title={initial === undefined ? "New skill" : "Edit skill"} description={initial?.name}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <ErrorBanner message={error ?? categoryError} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="skill-name">
            <TextInput id="skill-name" value={name} onChange={setName} />
          </Field>
          <Field label="Category" htmlFor="skill-category">
            <SelectInput
              id="skill-category"
              value={categoryId}
              onChange={setCategoryId}
              options={(categories?.skills ?? []).map((category) => ({ id: category.id, label: category.label }))}
              emptyLabel="Select a category"
            />
          </Field>
          <Field label="Level" htmlFor="skill-level" hint="0–100.">
            <NumberInput id="skill-level" value={level} onChange={setLevel} min={0} max={100} />
          </Field>
          <Field label="Sort order" htmlFor="skill-sort">
            <NumberInput id="skill-sort" value={sortOrder} onChange={setSortOrder} min={0} />
          </Field>
        </div>
        <SubmitButton pending={pending} pendingLabel="Saving…">
          {initial === undefined ? "Create skill" : "Save skill"}
        </SubmitButton>
      </form>
    </Card>
  );
}
