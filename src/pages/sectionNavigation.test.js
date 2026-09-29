import { describe, expect, it } from 'vitest'
import { nextSectionAtBoundary } from './sectionNavigation'

const section = (top, bottom) => ({ getBoundingClientRect: () => ({ top, bottom }) })

describe('home section navigation', () => {
  it('lets a long section scroll normally before reaching its end', () => {
    const next = section(1800, 2600)
    expect(nextSectionAtBoundary([section(0, 1800), next], 800)).toBeNull()
  })

  it('advances at the end of a section when the visitor scrolls down again', () => {
    const next = section(800, 1700)
    expect(nextSectionAtBoundary([section(-800, 800), next], 800)).toBe(next)
  })

  it('does not advance prematurely into the following section or past the last section', () => {
    const next = section(100, 950)
    expect(nextSectionAtBoundary([section(-900, 100), next], 800)).toBeNull()
    expect(nextSectionAtBoundary([section(-900, 800)], 800)).toBeNull()
  })
})
