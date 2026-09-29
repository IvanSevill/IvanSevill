import { motion as Motion } from 'framer-motion'
import { BriefcaseBusiness, Cloud, GraduationCap, Pencil, Plane } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EXPERIENCE_STATUS, resolveExperienceMilestones } from '../data/experience'
import { GitTimeline } from './GitTimeline'

const LANE_COLORS = ['var(--accent-primary)', 'var(--accent-complement)']

const translations = {
  en: {
    intro: 'A status-driven path: solid work is completed or active; outlined work is confirmed or intended.',
    now: 'NOW', future: 'FUTURE', past: 'PAST / REVIEW', main: 'main path', branch: 'branch from degree', independent: 'independent',
    statuses: { COMPLETED: 'COMPLETED', CURRENT: 'CURRENT', CONFIRMED: 'CONFIRMED', PLANNED: 'PLANNED', REVIEW: 'PAST · REVIEW PENDING' },
    master: {
      title: 'Master’s Degree in Software Engineering: Cloud, Data and IT Management', subtitle: 'University of Seville',
      meta: 'Intended academic year 2027–2028', location: 'Seville, Spain',
      description: 'I want to take this master’s degree to deepen my knowledge of software engineering, cloud, data and technology management. I’m especially interested in how it connects with my passion for infrastructure: understanding how the systems behind an application are designed, deployed and maintained. It is still a plan, subject to application and admission.',
    },
    seville: {
      title: 'Software Engineering', subtitle: 'University of Seville', meta: '2023–2027 · active', location: 'Seville, Spain',
      description: ['The degree has given me a solid foundation in designing, building and maintaining software, from programming, architecture and databases to requirements, testing and project management.', 'It has also helped me understand the full software lifecycle, solve complex problems and adapt to different technologies and working environments.'],
    },
    metascope: {
      title: 'Curricular AI Internship', subtitle: 'MetaScope Consulting SL', meta: '5 Oct–17 Nov 2026 · 150 h · 25 h/week', location: 'Curricular placement',
      upcomingDescription: 'I’m about to start my curricular internship at MetaScope and I’m really looking forward to learning from the professionals there. I want to see how they evaluate AI models, agents and automation tools in practice.',
      description: 'My goal for this curricular internship at MetaScope is to learn from professionals and see firsthand how AI models, agents and automation tools are evaluated.',
    },
    erasmus: {
      title: 'Erasmus+ Study Period', subtitle: 'University of Pannonia', meta: '2024–2025 · completed', location: 'Hungary',
      description: 'Erasmus pushed me out of my comfort zone: I had to find my feet in Hungary and adapt to a different environment. It also made me see the international job market as a real option for my future as a software engineer.',
    },
    freelance: {
      title: 'Volunteer Private Tutor', subtitle: 'Independent', meta: '2023 · completed', location: 'Seville, Spain',
      description: 'Tutoring two students in Python and another in maths made me go back to the basics and check whether I could explain them clearly. It also helped me become more patient and adapt my explanations to each person.',
    },
  },
  es: {
    intro: 'Un recorrido guiado por estados: lo sólido está completado o activo; lo delineado está confirmado o previsto.',
    now: 'AHORA', future: 'FUTURO', past: 'PASADO / REVISIÓN', main: 'trayectoria principal', branch: 'rama desde el grado', independent: 'independiente',
    statuses: { COMPLETED: 'COMPLETADO', CURRENT: 'ACTUAL', CONFIRMED: 'CONFIRMADO', PLANNED: 'PLANIFICADO', REVIEW: 'PASADO · REVISIÓN PENDIENTE' },
    master: {
      title: 'Máster Universitario en Ingeniería del Software: Cloud, Datos y Gestión de las Tecnologías de la Información', subtitle: 'Universidad de Sevilla',
      meta: 'Curso académico previsto 2027–2028', location: 'Sevilla, España',
      description: 'Quiero cursar este máster para profundizar en ingeniería del software, cloud, datos y gestión tecnológica. Me interesa especialmente lo que puede aportar a mi pasión por la infraestructura: entender mejor cómo se diseñan, despliegan y mantienen los sistemas que hay detrás de una aplicación. Todavía es un plan, sujeto a solicitud y admisión.',
    },
    seville: {
      title: 'Ingeniería del Software', subtitle: 'Universidad de Sevilla', meta: '2023–2027 · activo', location: 'Sevilla, España',
      description: ['La carrera me ha dado una base sólida en diseño, desarrollo y mantenimiento de software, desde programación, arquitectura y bases de datos hasta requisitos, pruebas y gestión de proyectos.', 'También me ha ayudado a entender el ciclo de vida completo del software, resolver problemas complejos y adaptarme a distintas tecnologías y entornos de trabajo.'],
    },
    metascope: {
      title: 'Prácticas curriculares de IA', subtitle: 'MetaScope Consulting SL', meta: '5 oct–17 nov 2026 · 150 h · 25 h/semana', location: 'Prácticas curriculares',
      upcomingDescription: 'Voy a empezar mis prácticas curriculares en MetaScope y tengo muchas ganas de aprender de los profesionales que trabajan allí. Quiero ver de cerca cómo evalúan modelos de IA, agentes y herramientas de automatización.',
      description: 'Mi objetivo en estas prácticas curriculares en MetaScope es aprender de profesionales y conocer de cerca cómo se evalúan modelos de IA, agentes y herramientas de automatización.',
    },
    erasmus: {
      title: 'Estancia Erasmus+', subtitle: 'Universidad de Pannonia', meta: '2024–2025 · completado', location: 'Hungría',
      description: 'Erasmus me sacó de mi zona de confort: tuve que desenvolverme en Hungría y adaptarme a un entorno diferente. También me hizo ver el mercado laboral internacional como una opción real para mi futuro como ingeniero de software.',
    },
    freelance: {
      title: 'Profesor particular voluntario', subtitle: 'Independiente', meta: '2023 · completado', location: 'Sevilla, España',
      description: 'Dar clases de Python a dos alumnos y de matemáticas a otro me hizo volver a los fundamentos y comprobar si sabía explicarlos con claridad. También me ayudó a tener más paciencia y a adaptar mis explicaciones a cada persona.',
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
      description: milestone.id === 'metascope' && status === EXPERIENCE_STATUS.CONFIRMED
        ? content.upcomingDescription
        : content.description,
      icon: icons[milestone.id],
      color: milestone.relationship === 'degree-branch' ? 'var(--accent-complement)' : 'var(--accent-primary)',
      status,
      statusLabel: text.statuses[status],
      phaseLabel: statusPhase(status),
      relationshipLabel: relationship[milestone.relationship],
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
        <GitTimeline items={items} laneColors={LANE_COLORS} surfaceColor="var(--bg-color)" order="desc" mergedFallback={locale === 'es' ? 'integrado' : 'merged'} />
      </div>
    </section>
  )
}
