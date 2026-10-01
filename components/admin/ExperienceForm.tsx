"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminApi, ApiClientError } from "@/lib/admin/client";
import { normalizeTechnologies, toDateInput, toNullableDate, toNullableText } from "@/lib/admin/forms";
import type { AdminExperience, AdminTechnology } from "@/lib/admin/dto";
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
import TechListEditor from "@/components/admin/TechListEditor";
import { useResourceById } from "@/components/admin/hooks";

/**
 * Create/edit form for a work-experience entry. `location` and `endDate` are
 * optional, so blank inputs are sent as `null` rather than empty strings.
 */
export default function ExperienceForm({ id }: { id?: string }) {
  const { row, error, invalidId, loading } = useResourceById(adminApi.listExperiences, id);

  if (id !== undefined) {
    if (invalidId) {
      return (
        <Card title="Experience">
          <ErrorBanner message="Invalid experience id" />
        </Card>
      );
    }
    if (error !== null) {
      return (
        <Card title="Experience">
          <ErrorBanner message={error} />
        </Card>
      );
    }
    if (loading || row === null) {
      return (
        <Card title="Experience">
          <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>
        </Card>
      );
    }
    return <ExperienceFormBody key={row.id} initial={row} />;
  }

  return <ExperienceFormBody />;
}

function ExperienceFormBody({ initial }: { initial?: AdminExperience }) {
  const router = useRouter();
  const [company, setCompany] = useState(initial?.company ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [startDate, setStartDate] = useState(initial === undefined ? "" : toDateInput(initial.startDate));
  const [endDate, setEndDate] = useState(initial === undefined || initial.endDate === null ? "" : toDateInput(initial.endDate));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false);
  const [technologies, setTechnologies] = useState<AdminTechnology[]>(initial?.technologies ?? []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const input = {
      company,
      role,
      location: toNullableText(location),
      startDate,
      endDate: toNullableDate(endDate),
      description,
      sortOrder,
      isPublished,
      technologies: normalizeTechnologies(technologies),
    };
    try {
      if (initial === undefined) await adminApi.createExperience(input);
      else await adminApi.updateExperience(initial.id, input);
      router.replace("/admin/experience");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof ApiClientError ? caught.message : "Unable to save experience");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card title={initial === undefined ? "New experience" : "Edit experience"} description={initial?.company}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <ErrorBanner message={error} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company" htmlFor="experience-company">
            <TextInput id="experience-company" value={company} onChange={setCompany} />
          </Field>
          <Field label="Role" htmlFor="experience-role">
            <TextInput id="experience-role" value={role} onChange={setRole} />
          </Field>
          <Field label="Location" htmlFor="experience-location" hint="Leave blank for remote or unknown.">
            <TextInput id="experience-location" value={location} onChange={setLocation} />
          </Field>
          <Field label="Sort order" htmlFor="experience-sort">
            <NumberInput id="experience-sort" value={sortOrder} onChange={setSortOrder} min={0} />
          </Field>
          <Field label="Start date" htmlFor="experience-start">
            <TextInput id="experience-start" value={startDate} onChange={setStartDate} type="date" />
          </Field>
          <Field label="End date" htmlFor="experience-end" hint="Leave blank if this is the current role.">
            <TextInput id="experience-end" value={endDate} onChange={setEndDate} type="date" />
          </Field>
        </div>
        <Field label="Description" htmlFor="experience-description">
          <TextArea id="experience-description" value={description} onChange={setDescription} rows={5} />
        </Field>
        <Field label="Technologies" htmlFor="experience-tech-0" hint="Order here is the order saved.">
          <TechListEditor value={technologies} onChange={setTechnologies} idPrefix="experience" />
        </Field>
        <Checkbox id="experience-published" checked={isPublished} onChange={setIsPublished} label="Published" />
        <SubmitButton pending={pending} pendingLabel="Saving…">
          {initial === undefined ? "Create experience" : "Save experience"}
        </SubmitButton>
      </form>
    </Card>
  );
}
