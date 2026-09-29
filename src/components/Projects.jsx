import { motion as Motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { featuredProjects, getLocalizedProject, projectPath, secondaryProjects } from '../data/projects'

export default function Projects() {
  const { t, i18n } = useTranslation()
  const spanish = i18n.resolvedLanguage?.startsWith('es')

  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <Motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-heading">
          <p className="section-kicker">projects --featured</p>
          <h2>{t('projects.title')}</h2>
          <p>{spanish ? 'Cinco casos con alcance, decisiones y limitaciones verificadas.' : 'Five case studies with verified scope, decisions and limitations.'}</p>
        </Motion.div>

        <div className="featured-project-grid">
          {featuredProjects.map((rawProject, index) => {
            const project = getLocalizedProject(rawProject, i18n.resolvedLanguage)
            return (
              <Motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.04 }}
                className="project-card"
              >
                <div className="terminal-bar" aria-hidden="true"><span /><span /><span /><code>{project.slug}.case-study</code></div>
                <div className="project-card-body">
                  <div className="project-card-meta"><span>{project.type}</span><span>{project.status}</span></div>
                  <h3><Link to={projectPath(project.slug)}>{project.name}</Link></h3>
                  <p>{project.summary}</p>
                  <ul className="tech-list" aria-label={`${project.name} stack`}>
                    {project.stack.slice(0, 5).map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                  <div className="project-card-links">
                    <Link className="project-primary-link" to={projectPath(project.slug)}>
                      {spanish ? 'Leer caso' : 'Read case study'} <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                    {project.links.github && (
                      <a href={project.links.github} target="_blank" rel="noreferrer" aria-label={`${spanish ? 'Código fuente de' : 'Source code for'} ${project.name}`}>
                        <Github size={17} aria-hidden="true" /> {spanish ? 'Código' : 'Source'}
                      </a>
                    )}
                  </div>
                </div>
              </Motion.article>
            )
          })}
        </div>

        <div className="secondary-projects">
          <div>
            <p className="section-kicker">{spanish ? 'Otros repositorios' : 'More repositories'}</p>
            <h3>{spanish ? 'Exploraciones anteriores' : 'Earlier explorations'}</h3>
          </div>
          <ul>
            {secondaryProjects.map((item) => (
              <li key={item.name}>
                <a href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.name} · GitHub`}>
                  <span><strong>{item.name}</strong><small>{item.stack}</small></span>
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
