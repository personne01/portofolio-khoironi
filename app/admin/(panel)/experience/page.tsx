"use client";

import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminApi } from "@/lib/admin/client";
import type { AdminExperience } from "@/lib/admin/dto";
import type { ListColumn } from "@/components/admin/ResourceList";

const period = (row: AdminExperience) =>
  `${row.startDate.slice(0, 10)} — ${row.endDate === null ? "Present" : row.endDate.slice(0, 10)}`;

const columns: ListColumn<AdminExperience>[] = [
  { header: "Company", render: (row) => <span className="font-medium">{row.company}</span> },
  { header: "Role", render: (row) => row.role },
  { header: "Location", render: (row) => row.location ?? "—"},
  { header: "Period", render: period },
  { header: "Status", render: (row) => (row.isPublished ? "Published" : "Draft") },
];

export default function ExperiencePage() {
  return (
    <ResourceListPage
      title="Experience"
      description="Roles shown on the public timeline, in the order set here."
      newLabel="New experience"
      newHref="/admin/experience/new"
      load={adminApi.listExperiences}
      remove={adminApi.deleteExperience}
      restore={adminApi.restoreExperience}
      columns={columns}
    />
  );
}
