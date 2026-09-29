import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  FEATURED_PROJECT_SLUGS,
  featuredProjects,
  getLocalizedProject,
  getProjectBySlug,
  projectPath,
} from './projects'

describe('featured project data', () => {
  it('contains exactly the five evidence-backed stable slugs', () => {
    expect(featuredProjects.map((project) => project.slug)).toEqual(FEATURED_PROJECT_SLUGS)
    expect(new Set(FEATURED_PROJECT_SLUGS).size).toBe(5)
  })

  it.each(FEATURED_PROJECT_SLUGS)('resolves %s with complete localized route data', (slug) => {
    const project = getProjectBySlug(slug)
    const english = getLocalizedProject(project, 'en-US')
    const spanish = getLocalizedProject(project, 'es-ES')

    expect(projectPath(slug)).toBe(`/projects/${slug}`)
    expect(english.summary).toBeTruthy()
    expect(spanish.summary).toBeTruthy()
    expect(project.architectureImage).toContain(`/projects/${slug}/architecture.svg`)
    expect(project.stack.length).toBeGreaterThan(2)
    expect(english.features.length).toBeGreaterThan(2)
    expect(english.limitations.length).toBeGreaterThan(1)
    expect(english.type).toBeTruthy()
    expect(spanish.type).toBeTruthy()
    expect(spanish.type).not.toBe(english.type)
    expect(existsSync(new URL(`../../public${project.architectureImage}`, import.meta.url))).toBe(true)
    for (const media of project.media) {
      expect(existsSync(new URL(`../../public${media.src}`, import.meta.url))).toBe(true)
    }
  })

  it('tracks intentional pending captures without pointing image elements at missing files', () => {
    const pending = featuredProjects.flatMap((project) => project.pendingMedia ?? [])
    expect(pending.map((item) => item.filename)).toEqual([
      'kaiprompt-tui.png',
      'gymhub-dashboard.png',
      'quota-watch-tui.png',
      'aiss-miner-swagger.png',
      'aiss-miner-graphiql.png',
    ])
  })

  it('returns undefined for unknown project slugs', () => {
    expect(getProjectBySlug('not-a-project')).toBeUndefined()
  })

  it('represents every internal detail route in the sitemap', () => {
    const sitemap = readFileSync(new URL('../../public/sitemap.xml', import.meta.url), 'utf8')
    for (const slug of FEATURED_PROJECT_SLUGS) {
      expect(sitemap).toContain(`https://ivansevill.com${projectPath(slug)}`)
    }
  })
})
