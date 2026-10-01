"use client";

import { Card } from "@/components/admin/fields";
import { SocialLinkForm } from "@/components/admin/LinkForms";

export default function NewSocialLinkPage() {
  return (
    <Card title="New social link" description="Links shown in the footer and contact area.">
      <SocialLinkForm />
    </Card>
  );
}
