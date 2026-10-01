"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import { normalizeTechnologies } from "@/lib/admin/forms";
import type { AdminCategories, AdminProject, AdminTechnology } from "@/lib/admin/dto";
import {
  Card,
  Checkbox,
  ErrorBanner,
  Field,
  NumberInput,
  SelectInput,
  SubmitButton,
  TextArea,
  TextInput,
} from "@/components/admin/fields";
import TechListEditor from "@/components/admin/TechListEditor";
import { useCategories, useResourceById } from "@/components/admin/hooks";

/**
 * Create/edit form for a project. The record is resolved in this component rather
 * than the page so the inner form only mounts once its initial values exist —
 * that keeps `useState` initialisation correct without an effect that copies
 * props into state.
 */
export default function ProjectForm({ id }: { id?: string }) {
  const { row, error, invalidId, loading } = useResourceById(adminApi.listProjects, id);
  const { categories, error: categoryError, loading: categoriesLoading } = useCategories();

  if (id !== undefined) {
    if (invalidId) {
      return (
        <Card title="Project">
          <ErrorBanner message="Invalid project id" />
        </Card>
      );
    }
    if (error !== null) {
      return (
        <Card title="Project">
          <ErrorBanner message={error} />
        </Card>
      );
    }
    if (loading || row === null) {
      return (
        <Card title="Project">
          <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>
        </Card>
      );
    }
    if (categoriesLoading) return <ProjectCategoryGate />;
    return <ProjectFormBody key={row.id} initial={row} categories={categories} categoryError={categoryError} />;
  }

  if (categoriesLoading) return <ProjectCategoryGate />;
  return <ProjectFormBody categories={categories} categoryError={categoryError} />;
}

/** The body tolerates `categories === null`, but would then submit `categoryId: 0`, which the server rejects. */
function ProjectCategoryGate() {
  return (
    <Card title="Project">
      <p className="text-sm text-[var(--muted-foreground)]">Loading categories…</p>
    </Card>
  );
}

function ProjectFormBody({
  initial,
  categories,
  categoryError,
}: {
  initial?: AdminProject;
  categories: AdminCategories | null;
  categoryError: string | null;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? "");
  const [metricValue, setMetricValue] = useState(initial?.metricValue ?? "");
  const [metricLabel, setMetricLabel] = useState(initial?.metricLabel ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? 0);
  const [technologies, setTechnologies] = useState<AdminTechnology[]>(initial?.technologies ?? []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const input = {
      title,
      slug,
      description,
      liveUrl,
      githubUrl,
      metricValue,
      metricLabel,
      sortOrder,
      isPublished,
      categoryId,
      technologies: normalizeTechnologies(technologies),
    };
    try {
      if (initial === undefined) await adminApi.createProject(input);
      else await adminApi.updateProject(initial.id, input);
      router.replace("/admin/projects");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiClientError ? caught.message : "Unable to save project");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card title={initial === undefined ? "New project" : "Edit project"} description={initial?.title}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <ErrorBanner message={error ?? categoryError} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="project-title">
            <TextInput id="project-title" value={title} onChange={setTitle} />
          </Field>
          <Field label="Slug" htmlFor="project-slug" hint="kebab-case, used in the public URL.">
            <TextInput id="project-slug" value={slug} onChange={setSlug} />
          </Field>
          <Field label="Category" htmlFor="project-category">
            <SelectInput
              id="project-category"
              value={categoryId}
              onChange={setCategoryId}
              options={(categories?.projects ?? []).map((category) => ({ id: category.id, label: category.label }))}
              emptyLabel="Select a category"
            />
          </Field>
          <Field label="Sort order" htmlFor="project-sort">
            <NumberInput id="project-sort" value={sortOrder} onChange={setSortOrder} min={0} />
          </Field>
          <Field label="Live URL" htmlFor="project-live" hint="Absolute https:// URL.">
            <TextInput id="project-live" value={liveUrl} onChange={setLiveUrl} />
          </Field>
          <Field label="GitHub URL" htmlFor="project-github" hint="Absolute https:// URL.">
            <TextInput id="project-github" value={githubUrl} onChange={setGithubUrl} />
          </Field>
          <Field label="Metric value" htmlFor="project-metric-value">
            <TextInput id="project-metric-value" value={metricValue} onChange={setMetricValue} />
          </Field>
          <Field label="Metric label" htmlFor="project-metric-label">
            <TextInput id="project-metric-label" value={metricLabel} onChange={setMetricLabel} />
          </Field>
        </div>
        <Field label="Description" htmlFor="project-description">
          <TextArea id="project-description" value={description} onChange={setDescription} rows={5} />
        </Field>
        <Field label="Technologies" htmlFor="project-tech-0" hint="Order here is the order saved.">
          <TechListEditor value={technologies} onChange={setTechnologies} idPrefix="project" />
        </Field>
        <Checkbox id="project-published" checked={isPublished} onChange={setIsPublished} label="Published" />
        <SubmitButton pending={pending} pendingLabel="Saving…">
          {initial === undefined ? "Create project" : "Save project"}
        </SubmitButton>
      </form>
    </Card>
  );
}
