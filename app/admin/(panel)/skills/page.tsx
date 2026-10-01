"use client";

import ResourceListPage from "@/components/admin/ResourceListPage";
import { adminApi } from "@/lib/admin/client";
import type { AdminSkill } from "@/lib/admin/dto";
import type { ListColumn } from "@/components/admin/ResourceList";

const columns: ListColumn<AdminSkill>[] = [
  { header: "Name", render: (row) => <span className="font-medium">{row.name}</span> },
  { header: "Category", render: (row) => row.category.label },
  { header: "Level", render: (row) => `${row.level}%` },
  { header: "Order", render: (row) => row.sortOrder },
];

export default function SkillsPage() {
  return (
    <ResourceListPage
      title="Skills"
      description="Levels are shown as percentages in the public skills section."
      newLabel="New skill"
      newHref="/admin/skills/new"
      load={adminApi.listSkills}
      remove={adminApi.deleteSkill}
      restore={adminApi.restoreSkill}
      columns={columns}
    />
  );
}
