import EditNavLink from "@/components/admin/EditNavLink";

export default async function EditNavLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditNavLink id={id} />;
}
