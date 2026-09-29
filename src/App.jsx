import { lazy, Suspense, useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { Route, Routes, useLocation, useNavigationType } from 'react-router'
import { useTranslation } from 'react-i18next'
import Navbar from './components/Navbar'
import { TimeModeProvider } from './context/TimeModeContext'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function RouteEffects() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en'
  }, [i18n.resolvedLanguage])

  useEffect(() => {
    window.history.scrollRestoration = 'auto'
    const frame = window.requestAnimationFrame(() => {
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1))
        target?.scrollIntoView()
        if (target) {
          target.tabIndex = -1
          target.focus({ preventScroll: true })
        }
        return
      }
      if (navigationType === 'POP') return
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.getElementById('main-content')?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, location.hash, navigationType])

  return null
}

function App() {
  const { i18n } = useTranslation()
  const isSpanish = i18n.resolvedLanguage?.startsWith('es')

  return (
    <TimeModeProvider>
      <MotionConfig reducedMotion="user">
        <div className="App">
          <div className="crt-overlay" aria-hidden="true" />
          <a className="skip-link" href="#main-content">
            {isSpanish ? 'Saltar al contenido' : 'Skip to content'}
          </a>
          <Navbar />
          <RouteEffects />
          <Suspense fallback={<div className="route-loading" role="status">{isSpanish ? 'Cargando…' : 'Loading…'}</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
          <footer className="site-footer">
            © {new Date().getFullYear()} Iván Jesús Sevillano Plaza. {isSpanish ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </footer>
        </div>
      </MotionConfig>
    </TimeModeProvider>
  )
}

export default App
