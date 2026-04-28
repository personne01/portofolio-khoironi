import Projects from "@/components/Home/Projects/Projects";
import Footer from "@/components/Home/Footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Khoironi - Full-Stack Developer",
  description: "Browse through my portfolio of web development projects, case studies, and products.",
};

export default function ProjectsPage() {
  return (
    <>
      <div className="pt-24">
        <Projects />
      </div>
      <Footer />
    </>
  );
}