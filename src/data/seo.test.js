import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PERSON_JSON_LD, SITE_TITLE } from './person'
import { FEATURED_PROJECT_SLUGS, getLocalizedProject, getProjectBySlug } from './projects'
import { getPageMeta, getPrerenderRoutes, renderRouteHtml } from './seo'

const template = readFileSync(new URL('../../index.html', import.meta.url), 'utf8')
const gymhub = getLocalizedProject(getProjectBySlug('gymhub'), 'es')

function jsonLd(html) {
  const match = html.match(/<script id="portfolio-json-ld" type="application\/ld\+json">([\s\S]*?)<\/script>/)
  return match && JSON.parse(match[1])
}

describe('page metadata', () => {
  it('keeps the home identity unchanged', () => {
    const meta = getPageMeta({ spanish: true })
    expect(meta.title).toBe(SITE_TITLE)
    expect(meta.canonical).toBe('https://ivansevill.com/')
    expect(meta.robots).toBe('index,follow')
    expect(meta.jsonLd).toEqual(PERSON_JSON_LD)
  })

  it('describes a project with its own canonical URL and CreativeWork data', () => {
    const meta = getPageMeta({ project: gymhub, spanish: true })
    expect(meta.title).toBe('GymHub | Proyecto de Iván Sevillano')
    expect(meta.description).toBe(gymhub.summary)
    expect(meta.canonical).toBe('https://ivansevill.com/projects/gymhub')
    expect(meta.jsonLd).toMatchObject({ '@type': 'CreativeWork', name: 'GymHub', url: meta.canonical })
  })

  it('marks missing routes as noindex without a canonical URL or structured data', () => {
    const meta = getPageMeta({ notFound: true, spanish: true })
    expect(meta.title).toBe('404 | Ruta no encontrada')
    expect(meta.robots).toBe('noindex,follow')
    expect(meta.canonical).toBeNull()
    expect(meta.jsonLd).toBeNull()
  })
})

describe('prerendered routes', () => {
  it('emits one file per featured project plus the 404 page, in Spanish', () => {
    const routes = getPrerenderRoutes()
    expect(routes.map((route) => route.file)).toEqual([
      ...FEATURED_PROJECT_SLUGS.map((slug) => `projects/${slug}/index.html`),
      '404.html',
    ])
    expect(routes[1].meta).toEqual(getPageMeta({ project: gymhub, spanish: true }))
    expect(routes.at(-1).meta.robots).toBe('noindex,follow')
  })

  it('covers every project URL listed in the sitemap', () => {
    const sitemap = readFileSync(new URL('../../public/sitemap.xml', import.meta.url), 'utf8')
    const projectUrls = [...sitemap.matchAll(/<loc>https:\/\/ivansevill\.com\/(projects\/[^<]+)<\/loc>/g)].map((match) => `${match[1]}/index.html`)
    expect(projectUrls).toEqual(getPrerenderRoutes().slice(0, -1).map((route) => route.file))
  })
})

describe('prerendered route HTML', () => {
  it('rewrites the head of the template for a project route', () => {
    const meta = getPageMeta({ project: gymhub, spanish: true })
    const html = renderRouteHtml(template, meta)
    expect(html).toContain(`<title>${meta.title}</title>`)
    expect(html).toContain(`<link rel="canonical" href="${meta.canonical}" />`)
    expect(html).toContain(`<meta property="og:url" content="${meta.canonical}" />`)
    expect(html).toContain(`<meta property="og:title" content="${meta.title}" />`)
    expect(html.match(/<meta name="description"\s+content="([^"]*)"/)[1]).toBe(meta.description)
    expect(jsonLd(html)).toEqual(meta.jsonLd)
    expect(html).not.toContain(`<title>${SITE_TITLE}</title>`)
  })

  it('escapes HTML-significant characters in metadata', () => {
    const html = renderRouteHtml(template, { ...getPageMeta({ spanish: true }), title: 'A & "B" <C>' })
    expect(html).toContain('<title>A &amp; &quot;B&quot; &lt;C&gt;</title>')
  })

  it('drops canonical, og:url and structured data from the 404 page', () => {
    const html = renderRouteHtml(template, getPageMeta({ notFound: true, spanish: true }))
    expect(html).toContain('<meta name="robots" content="noindex,follow" />')
    expect(html).not.toContain('rel="canonical"')
    expect(html).not.toContain('og:url')
    expect(jsonLd(html)).toBeNull()
  })
})
