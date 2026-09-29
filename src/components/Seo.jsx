import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'

const SITE_URL = 'https://ivansevill.com'

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    const [key, rawName] = attribute.split('=')
    element.setAttribute(key, rawName)
    document.head.appendChild(element)
  }
  element.setAttribute('content', value)
}

export default function Seo({ project, notFound = false }) {
  const { i18n } = useTranslation()
  const location = useLocation()
  const spanish = i18n.resolvedLanguage?.startsWith('es')
  const title = notFound
    ? `404 | ${spanish ? 'Ruta no encontrada' : 'Route not found'}`
    : project
    ? `${project.name} | ${spanish ? 'Proyecto de Iván Sevillano' : 'Project by Iván Sevillano'}`
    : 'IvanSevill | Portfolio'
  const description = notFound
    ? spanish ? 'La ruta solicitada no forma parte de este portfolio.' : 'The requested route is not part of this portfolio.'
    : project
    ? project.summary
    : spanish
      ? 'Portfolio de ingeniería de software con proyectos de herramientas para desarrolladores, aplicaciones web e infraestructura.'
      : 'Software engineering portfolio spanning developer tools, web applications and personal infrastructure.'
  const path = project ? `/projects/${project.slug}` : notFound ? location.pathname : '/'
  const canonical = `${SITE_URL}${path}`

  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'name=description', description)
    setMeta('meta[property="og:title"]', 'property=og:title', title)
    setMeta('meta[property="og:description"]', 'property=og:description', description)
    setMeta('meta[property="og:url"]', 'property=og:url', canonical)
    setMeta('meta[name="twitter:title"]', 'name=twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name=twitter:description', description)
    setMeta('meta[name="robots"]', 'name=robots', notFound ? 'noindex,follow' : 'index,follow')

    let link = document.head.querySelector('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = canonical

    const id = 'portfolio-json-ld'
    document.getElementById(id)?.remove()
    if (notFound) return undefined

    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.text = JSON.stringify(project
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.name,
          description,
          url: canonical,
          author: { '@type': 'Person', name: 'Iván Sevillano' },
          codeRepository: project.links.github,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Iván Sevillano',
          url: SITE_URL,
          jobTitle: spanish ? 'Estudiante de Ingeniería del Software' : 'Software Engineering student',
          sameAs: ['https://github.com/IvanSevill'],
        })
    document.head.appendChild(script)
    return () => script.remove()
  }, [canonical, description, notFound, project, spanish, title])

  return null
}
