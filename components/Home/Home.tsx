import React from "react";
import Hero from "./Hero/Hero";
import About from "./About/About";
import Projects from "./Projects/Projects";
import Services from "./Services/Services";
import Experience from "./Experience/Experience";
import Contact from "./Contact/Contact";
import Footer from "./Footer/Footer";
import Articles from "./Articles/Articles";
import type { HomeData } from "@/lib/api-client";

type HomeProps = {
  data?: Partial<HomeData>;
};

const Home = ({ data }: HomeProps) => {
  return (
    <div className="overflow-hidden">
      <Hero
        personalInfo={data?.profile?.personalInfo}
        heroStats={data?.profile?.heroStats}
      />
      <About
        personalInfo={data?.profile?.personalInfo}
        heroStats={data?.profile?.heroStats}
        skills={data?.skills}
      />
      <Projects projects={data?.projects} />
      <Services services={data?.services} />
      <Experience experience={data?.experiences} />
      <Articles articles={data?.articles} />
      <Contact
        contactInfo={data?.contactInfo}
        socialLinks={data?.socialLinks}
      />
      <Footer
        personalInfo={data?.profile?.personalInfo}
        navLinks={data?.navLinks}
        socialLinks={data?.socialLinks}
      />
    </div>
  );
};

export default Home;
