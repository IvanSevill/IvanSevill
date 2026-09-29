import { useEffect, useState } from 'react'
import { ArrowLeft, ExternalLink, Github, ImageOff, ImagePlus } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import Seo from '../components/Seo'
import NotFoundPage from './NotFoundPage'
import { getLocalizedProject, getProjectBySlug } from '../data/projects'

const copy = {
  en: {
    back: 'Back to projects', overview: 'Overview', problem: 'Problem and motivation', features: 'Implemented features',
    architecture: 'Architecture and decisions', challenges: 'Technical challenges', media: 'Authentic project media',
    lessons: 'Lessons learned', limitations: 'Current limitations', future: 'Future improvements', source: 'View source',
    deployment: 'Deployment facts', stack: 'Actual stack', status: 'Status', role: 'Role', diagram: 'Architecture diagram for',
    assetUnavailable: 'Visual unavailable', pending: 'Pending captures',
    pendingDescription: 'Reserved for an authentic, non-sensitive capture. No substitute claim or fabricated screenshot is shown.',
  },
  es: {
    back: 'Volver a proyectos', overview: 'Resumen', problem: 'Problema y motivación', features: 'Funcionalidades implementadas',
    architecture: 'Arquitectura y decisiones', challenges: 'Retos técnicos', media: 'Material auténtico del proyecto',
    lessons: 'Aprendizajes', limitations: 'Limitaciones actuales', future: 'Mejoras futuras', source: 'Ver código',
    deployment: 'Datos de despliegue', stack: 'Stack real', status: 'Estado', role: 'Rol', diagram: 'Diagrama de arquitectura de',
    assetUnavailable: 'Recurso visual no disponible', pending: 'Capturas pendientes',
    pendingDescription: 'Espacio reservado para una captura auténtica y sin datos sensibles. No se muestra una imagen inventada ni una afirmación sustitutiva.',
  },
}

function ProjectImage({ src, sources = [], width, height, alt, unavailableLabel }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="asset-fallback" role="img" aria-label={`${alt}. ${unavailableLabel}`}>
        <ImageOff size={28} aria-hidden="true" />
        <span>{unavailableLabel}</span>
      </div>
    )
  }

  const image = <img src={src} width={width} height={height} loading="lazy" decoding="async" alt={alt} onError={() => setFailed(true)} />
  if (sources.length === 0) return image
  return (
    <picture>
      {sources.map((source) => <source key={source.srcSet} {...source} />)}
      {image}
    </picture>
  )
}

function DetailList({ title, items }) {
  return (
    <section className="detail-section">
      <h2>{title}</h2>
      <ul className="detail-list">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  )
}

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const rawProject = getProjectBySlug(slug)

  useEffect(() => {
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [slug])

  if (!rawProject) return <NotFoundPage projectSlug={slug} />

  const project = getLocalizedProject(rawProject, i18n.resolvedLanguage)
  const text = copy[project.locale]

  return (
    <main id="main-content" tabIndex="-1" className="project-detail">
      <Seo project={project} />
      <header className="project-hero container">
        <Link to="/#projects" className="back-link"><ArrowLeft size={17} /> {text.back}</Link>
        <p className="project-eyebrow">{project.eyebrow}</p>
        <h1>{project.name}</h1>
        <p className="project-lede">{project.summary}</p>
        <div className="project-facts" aria-label={text.overview}>
          <div><span>{text.status}</span><strong>{project.status}</strong></div>
          <div><span>{text.role}</span><strong>{project.role}</strong></div>
          <div><span>{text.deployment}</span><strong>{project.deployment}</strong></div>
        </div>
        {project.links.github && (
          <a className="btn-primary" href={project.links.github} target="_blank" rel="noreferrer" aria-label={`${text.source}: ${project.name}`}>
            <Github size={17} /> {text.source} <ExternalLink size={15} />
          </a>
        )}
      </header>

      <div className="project-body container">
        <section className="detail-section detail-problem">
          <h2>{text.problem}</h2>
          <p>{project.problem}</p>
        </section>
        <section className="detail-section">
          <h2>{text.stack}</h2>
          <ul className="tech-list" aria-label={text.stack}>
            {project.stack.map((technology) => <li key={technology}>{technology}</li>)}
          </ul>
        </section>
        <DetailList title={text.features} items={project.features} />
        <section className="detail-section architecture-panel">
          <div>
            <h2>{text.architecture}</h2>
            <ul className="detail-list">
              {project.decisions.map((decision) => <li key={decision}>{decision}</li>)}
            </ul>
          </div>
          <ProjectImage
            key={project.architectureImage}
            src={project.architectureImage}
            width="1400"
            height="820"
            alt={`${text.diagram} ${project.name}`}
            unavailableLabel={text.assetUnavailable}
          />
        </section>
        <DetailList title={text.challenges} items={project.challenges} />

        {(project.media.length > 0 || project.pendingMedia.length > 0) && (
          <section className="detail-section project-media">
            <h2>{text.media}</h2>
            {project.media.map((media) => (
              <figure key={media.src}>
                <ProjectImage
                  src={media.src}
                  sources={media.sources}
                  width={media.width}
                  height={media.height}
                  alt={media.alt[project.locale]}
                  unavailableLabel={text.assetUnavailable}
                />
                <figcaption>{media.caption[project.locale]}</figcaption>
              </figure>
            ))}
            {project.pendingMedia.length > 0 && (
              <div className="pending-media">
                <h3>{text.pending}</h3>
                <div className="pending-media-grid">
                  {project.pendingMedia.map((media) => (
                    <article key={media.filename} className="pending-media-card">
                      <ImagePlus size={24} aria-hidden="true" />
                      <div>
                        <strong>{media.title}</strong>
                        <code>{media.filename}</code>
                        <p>{text.pendingDescription}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <div className="detail-columns">
          <DetailList title={text.lessons} items={project.lessons} />
          <DetailList title={text.limitations} items={project.limitations} />
        </div>
        <DetailList title={text.future} items={project.future} />
      </div>
    </main>
  )
}
