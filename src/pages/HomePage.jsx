import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import Seo from '../components/Seo'

export default function HomePage() {
  return (
    <>
      <Seo />
      <main id="main-content" tabIndex="-1" className="home-page">
        <Hero />
        <About />
        <Experience />
        <Education />
        <Projects />
        <Contact />
      </main>
    </>
  )
}
