import { useEffect, useRef, useState } from 'react'
import { motion as Motion } from 'framer-motion'
import { Globe, Menu, X } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import TimeIndicator from './TimeIndicator'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef(null)
  const firstMobileLinkRef = useRef(null)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    firstMobileLinkRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const links = [
    { name: t('navbar.home'), hash: 'hero' },
    { name: t('navbar.about'), hash: 'about' },
    { name: t('navbar.experience'), hash: 'experience' },
    { name: t('navbar.education'), hash: 'education' },
    { name: t('navbar.projects'), hash: 'projects' },
    { name: t('navbar.contact'), hash: 'contact' },
  ]
  const isSpanish = i18n.resolvedLanguage?.startsWith('es')
  const linkTo = (hash) => ({ pathname: '/', hash: `#${hash}` })
  const toggleLanguage = () => i18n.changeLanguage(isSpanish ? 'en' : 'es')

  return (
    <nav className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`} aria-label={isSpanish ? 'Navegación principal' : 'Primary navigation'}>
      <div className="container nav-inner">
        <Link to={linkTo('hero')} className="nav-brand" onClick={() => setIsOpen(false)} aria-label={isSpanish ? 'Ir al inicio' : 'Go home'}>
          <span>~/</span>ivansevill
        </Link>

        <div className="nav-desktop">
          {links.map((link) => <Link key={link.hash} to={linkTo(link.hash)}>{link.name}</Link>)}
          <TimeIndicator />
          <button onClick={toggleLanguage} className="language-button" aria-label={isSpanish ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}>
            <Globe size={16} aria-hidden="true" />
            <span>{isSpanish ? 'ES' : 'EN'}</span>
          </button>
        </div>

        <div className="nav-mobile-actions">
          <button onClick={toggleLanguage} className="language-button" aria-label={isSpanish ? 'Cambiar idioma a inglés' : 'Switch language to Spanish'}>
            {isSpanish ? 'ES' : 'EN'}
          </button>
          <button
            ref={menuButtonRef}
            className="menu-button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={isOpen ? (isSpanish ? 'Cerrar menú' : 'Close menu') : (isSpanish ? 'Abrir menú' : 'Open menu')}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X size={27} aria-hidden="true" /> : <Menu size={27} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <Motion.div id="mobile-navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mobile-navigation">
          {links.map((link, index) => (
            <Link ref={index === 0 ? firstMobileLinkRef : undefined} key={link.hash} to={linkTo(link.hash)} onClick={() => setIsOpen(false)}>
              {link.name}
            </Link>
          ))}
        </Motion.div>
      )}
    </nav>
  )
}
