import About from "@/components/Home/About/About";
import Footer from "@/components/Home/Footer/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Khoironi - Full-Stack Developer",
  description: "Learn more about Khoironi, a Full-Stack Developer with 5+ years of experience building digital products.",
};

export default function AboutPage() {
  return (
    <>
      <About />
      <Footer />
    </>
  );
}