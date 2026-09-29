import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { experienceMilestones } from '../../data/experience'
import GitTimeline from './GitTimeline'

const timelineSource = readFileSync(new URL('./GitTimeline.jsx', import.meta.url), 'utf8')
const experienceSource = readFileSync(new URL('../Experience.jsx', import.meta.url), 'utf8')
const stylesheet = readFileSync(new URL('../../index.css', import.meta.url), 'utf8')
const experienceStyles = stylesheet.slice(
  stylesheet.indexOf('/* Experience graph */'),
  stylesheet.indexOf('/* Project detail routes */'),
)

const markup = renderToStaticMarkup(
  <GitTimeline
    items={experienceMilestones}
    order="desc"
    renderCard={(item) => <article>{item.id}</article>}
  />,
)

const entryMarkup = (id) => markup.match(
  new RegExp(`<li[^>]*data-timeline-id="${id}"[^>]*>[\\s\\S]*?</li>`),
)?.[0] || ''
const branchGroupStart = markup.indexOf('<li class="git-timeline__branch-group"')
const branchGroupEnd = markup.indexOf('data-timeline-id="freelance"')
const branchGroupMarkup = markup.slice(branchGroupStart, branchGroupEnd)

describe('GitTimeline Experience contract', () => {
  it('keeps the integration newest-first', () => {
    expect(experienceSource).toMatch(/<GitTimeline[^>]*order="desc"/)
    expect(markup.indexOf('data-timeline-id="master"')).toBeLessThan(markup.indexOf('data-timeline-id="metascope"'))
    expect(markup.indexOf('data-timeline-id="metascope"')).toBeLessThan(markup.indexOf('data-timeline-id="erasmus"'))
    expect(markup.indexOf('data-timeline-id="erasmus"')).toBeLessThan(markup.indexOf('data-timeline-id="seville"'))
    expect(markup.indexOf('data-timeline-id="seville"')).toBeLessThan(markup.indexOf('data-timeline-id="freelance"'))
  })

  it('groups both degree branches on one shared secondary rail', () => {
    expect(entryMarkup('master')).toContain('data-timeline-role="main"')
    expect(markup.match(/data-timeline-role="branch-group"/g)).toHaveLength(1)
    expect(markup.match(/git-timeline__shared-branch-rail/g)).toHaveLength(1)
    expect(branchGroupMarkup).toContain('data-branch-count="2"')
    expect(branchGroupMarkup).toContain('data-branch-anchor="seville"')
    expect(branchGroupMarkup).toContain('data-timeline-id="metascope"')
    expect(branchGroupMarkup).toContain('data-timeline-id="erasmus"')
    expect(branchGroupMarkup).toContain('data-timeline-id="seville"')
    expect(branchGroupMarkup).toContain('git-timeline__branch-anchor-content')
    expect(branchGroupMarkup.match(/data-timeline-role="branch"/g)).toHaveLength(2)
    expect(branchGroupMarkup.match(/git-timeline__branch-connection/g)).toHaveLength(2)
  })

  it('bounds the shared rail with one upper and one lower junction', () => {
    expect(markup.match(/git-timeline__branch-junction--upper/g)).toHaveLength(1)
    expect(markup.match(/git-timeline__branch-junction--lower/g)).toHaveLength(1)
    expect(markup).not.toContain('git-timeline__branch-path')
  })

  it('connects tutoring directly to the main rail without branch connectors', () => {
    expect(entryMarkup('freelance')).toContain('data-timeline-role="main"')
    expect(entryMarkup('freelance')).toContain('git-timeline__rail')
    expect(entryMarkup('freelance')).not.toContain('git-timeline__branch-connection')
    expect(entryMarkup('freelance')).not.toContain('git-timeline__shared-branch-rail')
    expect(branchGroupMarkup).not.toContain('data-timeline-id="freelance"')
    expect(experienceMilestones.find(({ id }) => id === 'freelance')?.relationship).toBe('independent')
  })

  it('uses one grid contract for both rails, junctions, and card connections', () => {
    expect(experienceStyles).toContain('--timeline-rail-track: clamp(')
    expect(experienceStyles).toContain('--timeline-branch-indent: clamp(')
    expect(experienceStyles).toContain('--timeline-branch-step: clamp(')
    expect(experienceStyles).toMatch(/grid-template-columns:\s*var\(--timeline-rail-track\)\s*var\(--timeline-branch-indent\)\s*var\(--timeline-branch-step\)/)
    expect(experienceStyles).toMatch(/\.git-timeline__branch-topology \{[\s\S]*?grid-column: 1 \/ 3;/)
    expect(experienceStyles).toMatch(/\.git-timeline__shared-branch-rail \{[\s\S]*?top: 0;[\s\S]*?right: 0;[\s\S]*?bottom: calc\(-1 \* var\(--timeline-row-gap\) - var\(--timeline-node-y\)\);/)
    expect(experienceStyles).toMatch(/\.git-timeline__branch-junction \{[\s\S]*?right: 0;[\s\S]*?left: calc\(var\(--timeline-rail-track\) \/ 2\);/)
    expect(experienceStyles).toMatch(/\.git-timeline__branch-junction--upper \{\s*top: 0;/)
    expect(experienceStyles).toMatch(/\.git-timeline__branch-junction--lower \{[\s\S]*?top: calc\(var\(--timeline-node-y\) - var\(--timeline-stroke\) \/ 2\);/)
    expect(experienceStyles).toMatch(/\.git-timeline__branch-content \{[\s\S]*?grid-column: 4;/)
    expect(experienceStyles).toMatch(/\.git-timeline__branch-anchor-content \{[\s\S]*?grid-column: 3 \/ 5;/)
    expect(experienceStyles).toMatch(/\.git-timeline__branch-connection \{[\s\S]*?left: calc\(-1 \* \(var\(--timeline-branch-step\) \+ var\(--timeline-card-gap\)\)\);/)
    expect(experienceStyles).not.toMatch(/grid-template-columns:\s*5rem|(?:left|width): -?5rem/)
  })

  it('paints the main rail above branch rails and junctions', () => {
    expect(experienceStyles).toMatch(/\.git-timeline__rail::before,[\s\S]*?\.git-timeline__branch-group::before \{[\s\S]*?z-index: 3;/)
    expect(experienceStyles).toMatch(/\.git-timeline__shared-branch-rail \{[\s\S]*?z-index: 1;/)
    expect(experienceStyles).toMatch(/\.git-timeline__branch-junction \{[\s\S]*?z-index: 2;/)
    expect(experienceStyles).toMatch(/\.git-timeline__node \{[\s\S]*?z-index: 4;/)
  })

  it('renders without stateful DOM measurement hooks', () => {
    expect(timelineSource).not.toMatch(/useState|useEffect|useLayoutEffect|ResizeObserver|getBoundingClientRect/)
  })
})
