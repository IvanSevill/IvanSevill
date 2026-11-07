import { PERSON, PERSON_JSON_LD, SITE_TITLE, SITE_URL } from './person'
import { featuredProjects, getLocalizedProject, projectPath } from './projects'

export function getPageMeta({ project, notFound = false, spanish = true } = {}) {
  if (notFound) {
    return {
      title: `404 | ${spanish ? 'Ruta no encontrada' : 'Route not found'}`,
      description: spanish ? 'La ruta solicitada no forma parte de este portfolio.' : 'The requested route is not part of this portfolio.',
      canonical: null,
      robots: 'noindex,follow',
      jsonLd: null,
    }
  }

  if (project) {
    const canonical = `${SITE_URL}${projectPath(project.slug)}`
    return {
      title: `${project.name} | ${spanish ? 'Proyecto de Iván Sevillano' : 'Project by Iván Sevillano'}`,
      description: project.summary,
      canonical,
      robots: 'index,follow',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.name,
        description: project.summary,
        url: canonical,
        author: { '@type': 'Person', name: PERSON.name, url: SITE_URL },
        codeRepository: project.links.github,
      },
    }
  }

  return {
    title: SITE_TITLE,
    description: spanish
      ? 'Portfolio de Iván Jesús Sevillano Plaza (IvanSevill): ingeniería de software con proyectos de herramientas para desarrolladores, aplicaciones web e infraestructura.'
      : 'Portfolio of Iván Jesús Sevillano Plaza (IvanSevill): software engineering spanning developer tools, web applications and personal infrastructure.',
    canonical: `${SITE_URL}/`,
    robots: 'index,follow',
    jsonLd: spanish ? PERSON_JSON_LD : { ...PERSON_JSON_LD, jobTitle: 'Software Engineering student' },
  }
}

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

function replaceRequired(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`Template is missing ${pattern}`)
  return html.replace(pattern, replacement)
}

// Build-time counterpart of <Seo />: rewrites the static head of index.html for one route.
export function renderRouteHtml(template, meta) {
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)
  let html = template
  html = replaceRequired(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`)
  html = replaceRequired(html, /<meta name="description"\s+content="[^"]*" \/>/, `<meta name="description"\n    content="${description}" />`)
  html = replaceRequired(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${meta.robots}" />`)
  html = replaceRequired(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
  html = replaceRequired(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)

  const canonical = /\s*<link rel="canonical" href="[^"]*" \/>/
  const ogUrl = /\s*<meta property="og:url" content="[^"]*" \/>/
  html = meta.canonical
    ? replaceRequired(replaceRequired(html, canonical, `\n  <link rel="canonical" href="${meta.canonical}" />`), ogUrl, `\n  <meta property="og:url" content="${meta.canonical}" />`)
    : replaceRequired(replaceRequired(html, canonical, ''), ogUrl, '')

  const jsonLd = /\s*<script id="portfolio-json-ld" type="application\/ld\+json">[\s\S]*?<\/script>/
  const script = meta.jsonLd
    ? `\n  <script id="portfolio-json-ld" type="application/ld+json">${JSON.stringify(meta.jsonLd).replaceAll('<', '\\u003c')}</script>`
    : ''
  return replaceRequired(html, jsonLd, script)
}

export function getPrerenderRoutes() {
  return [
    ...featuredProjects.map((project) => ({
      file: `projects/${project.slug}/index.html`,
      meta: getPageMeta({ project: getLocalizedProject(project, 'es'), spanish: true }),
    })),
    { file: '404.html', meta: getPageMeta({ notFound: true, spanish: true }) },
  ]
}
