import EditSocialLink from "@/components/admin/EditSocialLink";

export default async function EditSocialLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditSocialLink id={id} />;
}
