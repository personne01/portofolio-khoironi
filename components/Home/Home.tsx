import React from 'react'
import Hero from './Hero/Hero'
import About from './About/About'
import Projects from './Projects/Projects'
import Services from './Services/Services'
import Experience from './Experience/Experience'
import Testimonials from './Articles/Articles'
import Contact from './Contact/Contact'
import Footer from './Footer/Footer'
import Articles from './Articles/Articles'

const Home = () => {
  return (
    <div className="overflow-hidden">
      <Hero />
      <About />
      <Projects />
      <Services />
      <Experience />
      <Articles />
      <Contact />
      <Footer />
    </div>
  )
}

export default Home