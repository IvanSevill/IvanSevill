import { useEffect } from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Projects from '../components/Projects'
import Contact from '../components/Contact'
import Seo from '../components/Seo'
import { nextSectionAtBoundary } from './sectionNavigation'

export default function HomePage() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const sections = [...document.querySelectorAll('.home-page > section[id]')]
    let touchStartY = null
    let touchTarget = null
    let navigating = false
    let releaseTimer

    const advance = (next) => {
      navigating = true
      next.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.clearTimeout(releaseTimer)
      releaseTimer = window.setTimeout(() => { navigating = false }, 650)
    }

    const onWheel = (event) => {
      if (event.deltaY <= 0 || event.ctrlKey || document.querySelector('dialog[open]')) return
      if (navigating) {
        event.preventDefault()
        return
      }
      const next = nextSectionAtBoundary(sections, window.innerHeight)
      if (!next) return
      event.preventDefault()
      advance(next)
    }

    const onTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? null
      touchTarget = document.querySelector('dialog[open]') ? null : nextSectionAtBoundary(sections, window.innerHeight)
    }

    const onTouchEnd = (event) => {
      if (touchTarget && touchStartY != null && touchStartY - event.changedTouches[0]?.clientY > 45) {
        advance(touchTarget)
      }
      touchTarget = null
      touchStartY = null
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.clearTimeout(releaseTimer)
    }
  }, [])

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
