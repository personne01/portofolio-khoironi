import Projects from "@/components/Home/Projects/Projects";
import Footer from "@/components/Home/Footer/Footer";
import type { Metadata } from "next";
import {
  fetchNavLinks,
  fetchProfile,
  fetchProjects,
  fetchSocialLinks,
} from "@/lib/api-client";

// Dynamic SSR while fetches use the framework data cache (lib/api-client.ts).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects | Khoironi - Full-Stack Developer",
  description:
    "Browse through my portfolio of web development projects, case studies, and products.",
};

export default async function ProjectsPage() {
  const [projects, profile, navLinks, socialLinks] = await Promise.all([
    fetchProjects().catch(() => undefined),
    fetchProfile().catch(() => undefined),
    fetchNavLinks().catch(() => undefined),
    fetchSocialLinks().catch(() => undefined),
  ]);

  return (
    <>
      <div className="pt-24">
        <Projects projects={projects} />
      </div>
      <Footer
        personalInfo={profile?.personalInfo}
        navLinks={navLinks}
        socialLinks={socialLinks}
      />
    </>
  );
}
