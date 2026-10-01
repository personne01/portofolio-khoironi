import Services from "@/components/Home/Services/Services";
import Contact from "@/components/Home/Contact/Contact";
import Footer from "@/components/Home/Footer/Footer";
import type { Metadata } from "next";
import {
  fetchContactInfo,
  fetchNavLinks,
  fetchProfile,
  fetchServices,
  fetchSocialLinks,
} from "@/lib/api-client";

// Dynamic SSR while fetches use the framework data cache (lib/api-client.ts).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services | Khoironi - Full-Stack Developer",
  description:
    "Professional web development services - Web Development, E-Commerce Solutions, API Development, and Technical Consulting.",
};

export default async function ServicesPage() {
  const [services, contactInfo, profile, navLinks, socialLinks] =
    await Promise.all([
      fetchServices().catch(() => undefined),
      fetchContactInfo().catch(() => undefined),
      fetchProfile().catch(() => undefined),
      fetchNavLinks().catch(() => undefined),
      fetchSocialLinks().catch(() => undefined),
    ]);

  return (
    <>
      <div className="pt-24">
        <Services services={services} />
      </div>
      <Contact contactInfo={contactInfo} socialLinks={socialLinks} />
      <Footer
        personalInfo={profile?.personalInfo}
        navLinks={navLinks}
        socialLinks={socialLinks}
      />
    </>
  );
}
