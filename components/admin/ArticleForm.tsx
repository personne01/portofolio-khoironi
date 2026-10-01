"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import { toDateInput } from "@/lib/admin/forms";
import type { AdminArticle } from "@/lib/admin/dto";
import {
  Card,
  Checkbox,
  ErrorBanner,
  Field,
  NumberInput,
  SubmitButton,
  TextArea,
  TextInput,
} from "@/components/admin/fields";
import { useResourceById } from "@/components/admin/hooks";

/**
 * Create/edit form for an article. Unlike projects and skills, the article
 * category is free text, so no category lookup is required here.
 */
export default function ArticleForm({ id }: { id?: string }) {
  const { row, error, invalidId, loading } = useResourceById(adminApi.listArticles, id);

  if (id !== undefined) {
    if (invalidId) {
      return (
        <Card title="Article">
          <ErrorBanner message="Invalid article id" />
        </Card>
      );
    }
    if (error !== null) {
      return (
        <Card title="Article">
          <ErrorBanner message={error} />
        </Card>
      );
    }
    if (loading || row === null) {
      return (
        <Card title="Article">
          <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>
        </Card>
      );
    }
    return <ArticleFormBody key={row.id} initial={row} />;
  }

  return <ArticleFormBody />;
}

function ArticleFormBody({ initial }: { initial?: AdminArticle }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [publishedAt, setPublishedAt] = useState(initial === undefined ? "" : toDateInput(initial.publishedAt));
  const [readTimeMinutes, setReadTimeMinutes] = useState(initial?.readTimeMinutes ?? 0);
  const [category, setCategory] = useState(initial?.category ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const input = {
      title,
      description,
      url,
      publishedAt,
      readTimeMinutes,
      category,
      sortOrder,
      isPublished,
    };
    try {
      if (initial === undefined) await adminApi.createArticle(input);
      else await adminApi.updateArticle(initial.id, input);
      router.replace("/admin/articles");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiClientError ? caught.message : "Unable to save article");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card title={initial === undefined ? "New article" : "Edit article"} description={initial?.title}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <ErrorBanner message={error} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="article-title">
            <TextInput id="article-title" value={title} onChange={setTitle} />
          </Field>
          <Field label="Category" htmlFor="article-category" hint="Free text, e.g. Engineering.">
            <TextInput id="article-category" value={category} onChange={setCategory} />
          </Field>
          <Field label="URL" htmlFor="article-url" hint="Absolute https:// URL.">
            <TextInput id="article-url" value={url} onChange={setUrl} />
          </Field>
          <Field label="Published date" htmlFor="article-published-at">
            <TextInput id="article-published-at" value={publishedAt} onChange={setPublishedAt} type="date" />
          </Field>
          <Field label="Read time (minutes)" htmlFor="article-read-time">
            <NumberInput id="article-read-time" value={readTimeMinutes} onChange={setReadTimeMinutes} min={0} />
          </Field>
          <Field label="Sort order" htmlFor="article-sort">
            <NumberInput id="article-sort" value={sortOrder} onChange={setSortOrder} min={0} />
          </Field>
        </div>
        <Field label="Description" htmlFor="article-description">
          <TextArea id="article-description" value={description} onChange={setDescription} rows={5} />
        </Field>
        <Checkbox id="article-published" checked={isPublished} onChange={setIsPublished} label="Published" />
        <SubmitButton pending={pending} pendingLabel="Saving…">
          {initial === undefined ? "Create article" : "Save article"}
        </SubmitButton>
      </form>
    </Card>
  );
}
