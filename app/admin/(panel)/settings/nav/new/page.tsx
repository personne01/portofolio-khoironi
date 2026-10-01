"use client";

import { Card } from "@/components/admin/fields";
import { NavLinkForm } from "@/components/admin/LinkForms";

export default function NewNavLinkPage() {
  return (
    <Card title="New nav link" description="Links shown in the public navigation bar.">
      <NavLinkForm />
    </Card>
  );
}
