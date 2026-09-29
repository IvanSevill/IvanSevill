import { motion as Motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

export default function About() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const traits = [
    { title: t('about.growth'), description: t('about.growthDesc') },
    { title: t('about.team'), description: t('about.teamDesc') },
    { title: t('about.passions'), description: t('about.passionsDesc') },
    { title: t('about.travel'), description: t('about.travelDesc') },
  ]

  return (
    <section id="about" className="section about-section">
      <div className="container">
        <Motion.header
          className="about-section__header"
          variants={reveal}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true }}
        >
          <span className="about-section__chapter" aria-hidden="true">02 / 06</span>
          <h2>{t('about.title')}</h2>
          <span className="about-section__header-rule" aria-hidden="true" />
        </Motion.header>

        <div className="about-section__story">
          <Motion.div
            className="about-section__copy"
            variants={reveal}
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p>
              {t('about.desc1')} <span className="about-section__highlight">{t('about.desc1_highlight')}</span>
              {t('about.desc1_cont')} <span className="about-section__highlight about-section__highlight--complement">{t('about.desc2_highlight')}</span>.
            </p>
            <p>{t('about.desc2')}</p>
          </Motion.div>

          <Motion.figure
            className="about-section__photo"
            variants={reveal}
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            <picture>
              <source type="image/avif" srcSet="/images/responsive/about-640.avif 640w, /images/responsive/about-960.avif 960w, /images/responsive/about-1440.avif 1440w" sizes="(min-width: 768px) 50vw, 100vw" />
              <source type="image/webp" srcSet="/images/responsive/about-640.webp 640w, /images/responsive/about-960.webp 960w, /images/responsive/about-1440.webp 1440w" sizes="(min-width: 768px) 50vw, 100vw" />
              <img src="/images/about.jpg" width="1440" height="810" loading="lazy" decoding="async" alt={t('about.imageAlt')} />
            </picture>

          </Motion.figure>
        </div>

        <Motion.div
          className="about-section__traits"
          variants={list}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {traits.map(({ title, description }) => (
            <Motion.article key={title} variants={reveal} className="about-section__trait">
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </Motion.article>
          ))}
        </Motion.div>
      </div>
    </section>
  )
}
