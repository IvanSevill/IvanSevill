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

const projectsSource = readFileSync(new URL('../components/Projects.jsx', import.meta.url), 'utf8')
const detailSource = readFileSync(new URL('../pages/ProjectDetailPage.jsx', import.meta.url), 'utf8')

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

  it('has no pending captures and all media files exist', () => {
    const pending = featuredProjects.flatMap((project) => project.pendingMedia ?? [])
    expect(pending).toEqual([])
    for (const project of featuredProjects) {
      for (const media of project.media) {
        expect(existsSync(new URL(`../../public${media.src}`, import.meta.url))).toBe(true)
      }
    }
  })

  it('uses existing authentic assets as visible project covers without publishing pending placeholders', () => {
    expect(projectsSource).not.toContain('project-card-visual')
    expect(detailSource).toContain('className="project-hero-visual"')
    expect(detailSource).not.toContain('pending-media-card')
  })

  it('opens project links in an accessible dialog while preserving direct routes', () => {
    expect(projectsSource).toContain('<dialog')
    expect(projectsSource).toContain('dialog.showModal()')
    expect(projectsSource).toContain('onCancel=')
    expect(projectsSource).toContain('returnFocusRef.current?.focus()')
    expect(projectsSource).toContain("matchMedia('(pointer: fine)'")
    expect(projectsSource).toContain('to={projectPath(project.slug)}')
    expect(detailSource).toContain('project-full-link')
    expect(detailSource).not.toContain('autoFocus')
  })

  it('keeps the dialog nav fixed with section snapping and touch-safe focus', () => {
    const stylesheet = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
    expect(stylesheet).toMatch(/\.project-detail--modal \.project-detail-nav \{[\s\S]*?position: sticky;/)
    expect(stylesheet).toMatch(/\.project-dialog \{[\s\S]*?overscroll-behavior: contain;/)
    expect(stylesheet).toMatch(/\.project-dialog \{[\s\S]*?scroll-snap-type: y proximity;/)
    expect(stylesheet).toContain('scroll-padding-top')
    expect(stylesheet).toContain('.project-detail--modal .project-body > .detail-section')
    expect(stylesheet).toContain('scroll-snap-align: start;')
    expect(stylesheet).toMatch(/-webkit-tap-highlight-color: transparent;/)
    expect(detailSource).toMatch(/\{\s*modal && \(\s*<div className="project-detail-nav"/)
  })

  it('opens the dialog from anywhere on the card with a hidden dialog scrollbar', () => {
    const stylesheet = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
    expect(projectsSource).toContain('openFromCard')
    expect(projectsSource).toContain("closest('a, button')")
    expect(projectsSource).toContain("querySelector('.project-title-link')")
    expect(projectsSource).toContain('dialog.scrollTop = 0')
    expect(projectsSource).not.toContain('project-primary-link')
    expect(projectsSource).not.toContain('Leer caso')
    expect(stylesheet).toMatch(/\.project-card \{[\s\S]*?cursor: pointer;/)
    expect(stylesheet).toContain('scrollbar-width: none;')
    expect(stylesheet).toContain('.project-dialog::-webkit-scrollbar')
    expect(stylesheet).toContain('html::-webkit-scrollbar')
    expect(stylesheet).toMatch(/\.project-dialog \{[\s\S]*?margin: auto;/)
  })

  it('shows a grander hero at the top of the dialog', () => {
    const stylesheet = readFileSync(new URL('../index.css', import.meta.url), 'utf8')
    expect(stylesheet).toMatch(/\.project-detail--modal \.project-hero \{[\s\S]*?padding-top: 3\.5rem;/)
    expect(stylesheet).toMatch(/\.project-detail--modal \.project-hero h1 \{[\s\S]*?font-size: clamp\(3\.2rem, 9vw, 7rem\);/)
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
