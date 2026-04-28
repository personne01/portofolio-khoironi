import Services from "@/components/Home/Services/Services";
import Contact from "@/components/Home/Contact/Contact";
import Footer from "@/components/Home/Footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Khoironi - Full-Stack Developer",
  description: "Professional web development services - Web Development, E-Commerce Solutions, API Development, and Technical Consulting.",
};

export default function ServicesPage() {
  return (
    <>
      <div className="pt-24">
        <Services />
      </div>
      <Contact />
      <Footer />
    </>
  );
}