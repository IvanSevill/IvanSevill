import { useEffect, useState } from 'react'
import { ArrowLeft, ExternalLink, Github, ImageOff, X } from 'lucide-react'
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
    assetUnavailable: 'Visual unavailable', caseStudy: 'Case study visual', close: 'Close project', openPage: 'Open full page',
  },
  es: {
    back: 'Volver a proyectos', overview: 'Resumen', problem: 'Problema y motivación', features: 'Funcionalidades implementadas',
    architecture: 'Arquitectura y decisiones', challenges: 'Retos técnicos', media: 'Material auténtico del proyecto',
    lessons: 'Aprendizajes', limitations: 'Limitaciones actuales', future: 'Mejoras futuras', source: 'Ver código',
    deployment: 'Datos de despliegue', stack: 'Stack real', status: 'Estado', role: 'Rol', diagram: 'Diagrama de arquitectura de',
    assetUnavailable: 'Recurso visual no disponible', caseStudy: 'Visual del caso de estudio', close: 'Cerrar proyecto', openPage: 'Abrir página completa',
  },
}

function ProjectImage({ src, sources = [], width, height, alt, unavailableLabel, priority = false }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="asset-fallback" role="img" aria-label={`${alt}. ${unavailableLabel}`}>
        <ImageOff size={28} aria-hidden="true" />
        <span>{unavailableLabel}</span>
      </div>
    )
  }

  const image = <img src={src} width={width} height={height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" alt={alt} onError={() => setFailed(true)} />
  if (sources.length === 0) return image
  return (
    <picture>
      {sources.map((source) => <source key={source.srcSet} {...source} />)}
      {image}
    </picture>
  )
}

function DetailList({ number, title, items, className = '' }) {
  return (
    <section className={`detail-section ${className}`.trim()}>
      <div className="detail-section__heading"><span>{number}</span><h2>{title}</h2></div>
      <ul className="detail-list">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  )
}

export default function ProjectDetailPage({ projectData, modal = false, onClose }) {
  const { slug } = useParams()
  const { i18n } = useTranslation()
  const rawProject = projectData ?? getProjectBySlug(slug)

  useEffect(() => {
    if (modal) return
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [modal, slug])

  if (!rawProject) return <NotFoundPage projectSlug={slug} />

  const project = getLocalizedProject(rawProject, i18n.resolvedLanguage)
  const text = copy[project.locale]
  const featuredMedia = project.media[0]
  const heroVisual = featuredMedia ?? {
    src: project.architectureImage,
    width: 1400,
    height: 820,
    sources: [],
    alt: { [project.locale]: `${text.diagram} ${project.name}` },
    caption: { [project.locale]: text.caseStudy },
  }
  const remainingMedia = featuredMedia ? project.media.slice(1) : []
  const Root = modal ? 'article' : 'main'

  return (
    <Root id={modal ? 'project-dialog-content' : 'main-content'} tabIndex="-1" className={`project-detail ${modal ? 'project-detail--modal' : ''}`.trim()}>
      {!modal && <Seo project={project} />}
      {modal && (
        <div className="project-detail-nav">
          <button type="button" className="back-link project-modal-close" onClick={onClose}><X size={17} /> {text.close}</button>
          <Link to={`/projects/${project.slug}`} className="project-full-link">{text.openPage} <ExternalLink size={15} /></Link>
        </div>
      )}
      <header className="project-hero container">
        {!modal && (
          <div className="project-detail-nav">
            <Link to="/#projects" className="back-link"><ArrowLeft size={17} /> {text.back}</Link>
          </div>
        )}
        <div className="project-hero-grid">
          <div className="project-hero-copy">
            <p className="project-eyebrow">{project.eyebrow}</p>
            <h1>{project.name}</h1>
            <p className="project-lede">{project.summary}</p>
            {project.links.github && (
              <a className="btn-primary" href={project.links.github} target="_blank" rel="noreferrer" aria-label={`${text.source}: ${project.name}`}>
                <Github size={17} /> {text.source} <ExternalLink size={15} />
              </a>
            )}
          </div>
          <figure className="project-hero-visual">
            <div className="project-visual-label" aria-hidden="true"><span>{project.slug}</span><span>01</span></div>
            <ProjectImage
              src={heroVisual.src}
              sources={heroVisual.sources}
              width={heroVisual.width}
              height={heroVisual.height}
              alt={heroVisual.alt[project.locale]}
              unavailableLabel={text.assetUnavailable}
              priority
            />
            <figcaption>{heroVisual.caption[project.locale]}</figcaption>
          </figure>
        </div>
        <dl className="project-facts" aria-label={text.overview}>
          <div><dt>{text.status}</dt><dd>{project.status}</dd></div>
          <div><dt>{text.role}</dt><dd>{project.role}</dd></div>
          <div><dt>{text.deployment}</dt><dd>{project.deployment}</dd></div>
        </dl>
      </header>

      <div className="project-body container">
        <div className="case-study-intro">
          <section className="detail-section detail-problem">
            <div className="detail-section__heading"><span>01</span><h2>{text.problem}</h2></div>
            <p>{project.problem}</p>
          </section>
          <aside className="detail-section project-stack-panel">
            <div className="detail-section__heading"><span>STACK</span><h2>{text.stack}</h2></div>
            <ul className="tech-list" aria-label={text.stack}>
              {project.stack.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </aside>
        </div>
        <DetailList number="02" title={text.features} items={project.features} className="detail-section--wide" />
        <section className={`detail-section architecture-panel ${featuredMedia ? '' : 'architecture-panel--text-only'}`.trim()}>
          <div className="architecture-copy">
            <div className="detail-section__heading"><span>03</span><h2>{text.architecture}</h2></div>
            <ul className="detail-list">
              {project.decisions.map((decision) => <li key={decision}>{decision}</li>)}
            </ul>
          </div>
          {featuredMedia && (
            <div className="architecture-visual">
              <ProjectImage
                key={project.architectureImage}
                src={project.architectureImage}
                width="1400"
                height="820"
                alt={`${text.diagram} ${project.name}`}
                unavailableLabel={text.assetUnavailable}
              />
            </div>
          )}
        </section>
        <DetailList number="04" title={text.challenges} items={project.challenges} />

        {remainingMedia.length > 0 && (
          <section className="detail-section project-media">
            <div className="detail-section__heading"><span>05</span><h2>{text.media}</h2></div>
            {remainingMedia.map((media) => (
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
          </section>
        )}

        <div className="detail-columns">
          <DetailList number="05" title={text.lessons} items={project.lessons} />
          <DetailList number="06" title={text.limitations} items={project.limitations} />
        </div>
        <DetailList number="07" title={text.future} items={project.future} className="detail-section--future" />
      </div>
    </Root>
  )
}
