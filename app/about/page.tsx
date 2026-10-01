import About from "@/components/Home/About/About";
import Footer from "@/components/Home/Footer/Footer";
import type { Metadata } from "next";
import {
  fetchNavLinks,
  fetchProfile,
  fetchSkills,
  fetchSocialLinks,
} from "@/lib/api-client";

// Dynamic SSR while fetches use the framework data cache (lib/api-client.ts).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About | Khoironi - Full-Stack Developer",
  description:
    "Learn more about Khoironi, a Full-Stack Developer with 5+ years of experience building digital products.",
};

export default async function AboutPage() {
  const [profile, skills, navLinks, socialLinks] = await Promise.all([
    fetchProfile().catch(() => undefined),
    fetchSkills().catch(() => undefined),
    fetchNavLinks().catch(() => undefined),
    fetchSocialLinks().catch(() => undefined),
  ]);

  return (
    <>
      <About
        personalInfo={profile?.personalInfo}
        heroStats={profile?.heroStats}
        skills={skills}
      />
      <Footer
        personalInfo={profile?.personalInfo}
        navLinks={navLinks}
        socialLinks={socialLinks}
      />
    </>
  );
}
