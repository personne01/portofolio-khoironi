import ExperienceForm from "@/components/admin/ExperienceForm";

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ExperienceForm id={id} />;
}
