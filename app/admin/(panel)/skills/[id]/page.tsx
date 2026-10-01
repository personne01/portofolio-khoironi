import SkillForm from "@/components/admin/SkillForm";

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SkillForm id={id} />;
}
