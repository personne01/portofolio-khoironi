"use client";

import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminApi } from "@/lib/admin/client";
import type { AdminArticle } from "@/lib/admin/dto";
import type { ListColumn } from "@/components/admin/ResourceList";

const columns: ListColumn<AdminArticle>[] = [
  { header: "Title", render: (row) => <span className="font-medium">{row.title}</span> },
  { header: "Category", render: (row) => row.category },
  { header: "Published", render: (row) => row.publishedAt.slice(0, 10) },
  { header: "Read time", render: (row) => `${row.readTimeMinutes} min` },
  { header: "Status", render: (row) => (row.isPublished ? "Published" : "Draft") },
];

export default function ArticlesPage() {
  return (
    <ResourceListPage
      title="Articles"
      description="Published articles are listed in the public writing section."
      newLabel="New article"
      newHref="/admin/articles/new"
      load={adminApi.listArticles}
      remove={adminApi.deleteArticle}
      restore={adminApi.restoreArticle}
      columns={columns}
    />
  );
}
