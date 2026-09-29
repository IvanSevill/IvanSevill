import { motion as Motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTimeMode } from '../context/timeMode'

const entrance = {
  hidden: {},
  visible: { transition: { delayChildren: 0.18, staggerChildren: 0.15 } },
}

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const { t } = useTranslation()
  const { resolvedPeriod } = useTimeMode()
  const reduceMotion = useReducedMotion()

  return (
    <section id="hero" className="hero-section relative isolate flex min-h-screen items-end overflow-hidden bg-[#05050a] pt-24 pb-32 lg:items-center lg:pb-12">
      <div className="hero-section__image absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <picture>
          <source type="image/avif" srcSet="/images/responsive/profile-640.avif 640w, /images/responsive/profile-960.avif 960w, /images/responsive/profile-1440.avif 1440w" sizes="100vw" />
          <source type="image/webp" srcSet="/images/responsive/profile-640.webp 640w, /images/responsive/profile-960.webp 960w, /images/responsive/profile-1440.webp 1440w" sizes="100vw" />
          <img src="/images/profile.jpg" width="1440" height="1920" fetchPriority="high" decoding="async" alt="" className="hero-section__portrait" />
        </picture>
        <div className="hero-section__tint" />
        <div className="hero-section__shade" />
      </div>

      <div className="hero-section__atmosphere absolute inset-0 z-[1] pointer-events-none" aria-hidden="true">
        <span className="hero-section__glow" />
        <span className="hero-section__grid" />
        <span className="hero-section__sweep" />
      </div>

      <div className="container relative z-10 w-full">
        <Motion.div
          variants={entrance}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          className="hero-section__copy max-w-2xl"
        >
          <Motion.div variants={reveal} className="hero-section__chapter" aria-hidden="true">
            <span>01 / 06</span><span className="hero-section__chapter-line" />
          </Motion.div>
          <Motion.p variants={reveal} className="hero-section__boot">
            {t(`hero.bootLine.${resolvedPeriod}`)}
          </Motion.p>
          <Motion.p variants={reveal} className="hero-section__greeting uppercase">
            <span className="text-[var(--accent-primary)]">$ </span>{t('hero.greeting')}
          </Motion.p>
          <Motion.h1 variants={reveal} className="hero-section__headline font-bold tracking-tighter">
            <span className="gradient-text">Iván</span><span className="cursor-blink h-[0.85em] align-middle" aria-hidden="true" />
          </Motion.h1>
          <Motion.p variants={reveal} className="hero-section__role font-light leading-relaxed">
            {t('hero.role')}
          </Motion.p>
          <Motion.div variants={reveal} className="hero-section__actions flex flex-col gap-4 sm:flex-row">
            <a href="#projects" className="btn-primary group flex items-center justify-center gap-2">
              {t('hero.viewWork')}
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
            </a>
            <a href="#contact" className="btn-outline flex items-center justify-center">
              {t('hero.contactMe')}
            </a>
          </Motion.div>
        </Motion.div>
      </div>

      <Motion.a
        href="#about"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 8, 0] }}
        transition={reduceMotion ? { duration: 0 } : { delay: 1.3, duration: 2.2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] md:block"
        aria-label={t('navbar.about')}
      >
        <ChevronDown size={32} />
      </Motion.a>
    </section>
  )
}
