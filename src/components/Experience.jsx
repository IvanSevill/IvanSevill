import { motion as Motion } from 'framer-motion'
import { BriefcaseBusiness, Cloud, GitCommit, GraduationCap, Pencil, Plane } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EXPERIENCE_STATUS, resolveExperienceMilestones } from '../data/experience'
import { GitTimeline } from './GitTimeline'

const LANE_COLORS = ['var(--accent-primary)', '#b89cff', '#62c9f5', '#ffad6b', '#63d98b']

const translations = {
  en: {
    intro: 'A status-driven path: solid work is completed or active; outlined work is confirmed or intended.',
    now: 'NOW', future: 'FUTURE', past: 'PAST / REVIEW', main: 'main path', branch: 'branch from degree', independent: 'independent',
    statuses: { COMPLETED: 'COMPLETED', CURRENT: 'CURRENT', CONFIRMED: 'CONFIRMED', PLANNED: 'PLANNED', REVIEW: 'PAST · REVIEW PENDING' },
    master: {
      title: 'Master’s Degree in Software Engineering: Cloud, Data and IT Management', subtitle: 'University of Seville',
      meta: 'Intended academic year 2027–2028', location: 'Seville, Spain',
      description: 'Planned study subject to application and admission. It has no confirmed start or graduation outcome and is never promoted automatically by date.',
    },
    seville: {
      title: 'Software Engineering', subtitle: 'University of Seville', meta: '2023–2027 · active', location: 'Seville, Spain',
      description: ['Building foundations in software design, algorithms, systems and collaborative delivery.', 'The degree is the main branch from which international study and the curricular internship fork.'],
    },
    metascope: {
      title: 'Curricular AI Internship', subtitle: 'MetaScope Consulting SL', meta: '5 Oct–17 Nov 2026 · 150 h · 25 h/week', location: 'Curricular placement',
      description: ['Evaluate new AI models, agents and automation platforms.', 'Document findings and support technical proofs of concept. This is a curricular internship, not employment.'],
    },
    erasmus: {
      title: 'Erasmus+ Study Period', subtitle: 'University of Pannonia', meta: '2024–2025 · completed', location: 'Veszprém, Hungary',
      description: 'Completed international study period focused on academic and personal growth in a new environment.',
    },
    freelance: {
      title: 'Volunteer Private Tutor', subtitle: 'Independent', meta: '2023 · completed', location: 'Seville, Spain',
      description: ['Introduced two students to Python and supported a third student with mathematics.', 'Volunteer teaching strengthened communication, mentoring and technical fundamentals.'],
    },
  },
  es: {
    intro: 'Un recorrido guiado por estados: lo sólido está completado o activo; lo delineado está confirmado o previsto.',
    now: 'AHORA', future: 'FUTURO', past: 'PASADO / REVISIÓN', main: 'trayectoria principal', branch: 'rama desde el grado', independent: 'independiente',
    statuses: { COMPLETED: 'COMPLETADO', CURRENT: 'ACTUAL', CONFIRMED: 'CONFIRMADO', PLANNED: 'PLANIFICADO', REVIEW: 'PASADO · REVISIÓN PENDIENTE' },
    master: {
      title: 'Máster Universitario en Ingeniería del Software: Cloud, Datos y Gestión de las Tecnologías de la Información', subtitle: 'Universidad de Sevilla',
      meta: 'Curso académico previsto 2027–2028', location: 'Sevilla, España',
      description: 'Estudio planificado, sujeto a solicitud y admisión. No tiene inicio ni graduación confirmados y nunca cambia automáticamente de estado por fecha.',
    },
    seville: {
      title: 'Ingeniería del Software', subtitle: 'Universidad de Sevilla', meta: '2023–2027 · activo', location: 'Sevilla, España',
      description: ['Desarrollo de fundamentos en diseño de software, algoritmos, sistemas y entrega colaborativa.', 'El grado es la rama principal de la que parten la movilidad internacional y las prácticas curriculares.'],
    },
    metascope: {
      title: 'Prácticas curriculares de IA', subtitle: 'MetaScope Consulting SL', meta: '5 oct–17 nov 2026 · 150 h · 25 h/semana', location: 'Prácticas curriculares',
      description: ['Evaluación de nuevos modelos de IA, agentes y plataformas de automatización.', 'Documentación de hallazgos y apoyo a pruebas de concepto técnicas. Son prácticas curriculares, no empleo.'],
    },
    erasmus: {
      title: 'Estancia Erasmus+', subtitle: 'Universidad de Pannonia', meta: '2024–2025 · completado', location: 'Veszprém, Hungría',
      description: 'Estancia internacional completada, centrada en el crecimiento académico y personal en un entorno nuevo.',
    },
    freelance: {
      title: 'Profesor particular voluntario', subtitle: 'Independiente', meta: '2023 · completado', location: 'Sevilla, España',
      description: ['Introducción a Python para dos estudiantes y apoyo de matemáticas para un tercero.', 'La docencia voluntaria reforzó comunicación, mentoría y fundamentos técnicos.'],
    },
  },
}

const icons = {
  master: <Cloud size={21} aria-hidden="true" />,
  seville: <GraduationCap size={22} aria-hidden="true" />,
  metascope: <BriefcaseBusiness size={21} aria-hidden="true" />,
  erasmus: <Plane size={20} aria-hidden="true" />,
  freelance: <Pencil size={21} aria-hidden="true" />,
}

export default function Experience() {
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en'
  const text = translations[locale]
  const statusPhase = (status) => status === EXPERIENCE_STATUS.PLANNED || status === EXPERIENCE_STATUS.CONFIRMED
    ? text.future
    : status === EXPERIENCE_STATUS.CURRENT ? text.now : text.past
  const relationship = { main: text.main, 'degree-branch': text.branch, independent: text.independent, future: text.main }
  const items = resolveExperienceMilestones().map((milestone) => {
    const content = text[milestone.id]
    const status = milestone.resolvedStatus
    return {
      ...milestone,
      ...content,
      icon: icons[milestone.id],
      status,
      statusLabel: text.statuses[status],
      phaseLabel: statusPhase(status),
      relationshipLabel: relationship[milestone.relationship],
      badges: milestone.relationship === 'degree-branch' ? [text.branch] : [],
      current: status === EXPERIENCE_STATUS.CURRENT,
      planned: status === EXPERIENCE_STATUS.PLANNED || status === EXPERIENCE_STATUS.CONFIRMED,
      mergedLabel: locale === 'es' ? 'integrado en la trayectoria' : 'merged into path',
    }
  })

  return (
    <section id="experience" className="section experience-section">
      <div className="container">
        <Motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-heading">
          <p className="section-kicker">git log --graph --status</p>
          <h2>{t('experience.title')}</h2>
          <p>{text.intro}</p>
        </Motion.div>
        <div className="experience-legend" aria-label={locale === 'es' ? 'Leyenda de estados' : 'Status legend'}>
          <span><i className="legend-solid" />{text.now}: {text.statuses.CURRENT}</span>
          <span><i className="legend-dashed" />{text.future}: {text.statuses.CONFIRMED} / {text.statuses.PLANNED}</span>
        </div>
        <GitTimeline items={items} laneColors={LANE_COLORS} surfaceColor="#050507" mergedFallback={locale === 'es' ? 'integrado' : 'merged'} />
      </div>
    </section>
  )
}
