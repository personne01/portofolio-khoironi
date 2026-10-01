"use client";

import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminApi } from "@/lib/admin/client";
import type { AdminProject } from "@/lib/admin/dto";
import type { ListColumn } from "@/components/admin/ResourceList";

const columns: ListColumn<AdminProject>[] = [
  { header: "Title", render: (row) => <span className="font-medium">{row.title}</span> },
  { header: "Category", render: (row) => row.category.label },
  { header: "Status", render: (row) => (row.isPublished ? "Published" : "Draft") },
  { header: "Order", render: (row) => row.sortOrder },
];

export default function ProjectsPage() {
  return (
    <ResourceListPage
      title="Projects"
      description="Published projects appear on the public site; drafts are hidden."
      newLabel="New project"
      newHref="/admin/projects/new"
      load={adminApi.listProjects}
      remove={adminApi.deleteProject}
      restore={adminApi.restoreProject}
      columns={columns}
    />
  );
}
