import { describe, expect, it } from 'vitest'
import {
  EXPERIENCE_STATUS,
  experienceMilestones,
  resolveMilestoneStatus,
  toMadridDateKey,
} from './experience'

const internship = experienceMilestones.find((milestone) => milestone.id === 'metascope')
const master = experienceMilestones.find((milestone) => milestone.id === 'master')

describe('Experience status resolution', () => {
  it('uses Europe/Madrid date-only semantics at the internship start boundary', () => {
    expect(toMadridDateKey(new Date('2026-10-04T21:59:59Z'))).toBe('2026-10-04')
    expect(toMadridDateKey(new Date('2026-10-04T22:00:00Z'))).toBe('2026-10-05')
    expect(resolveMilestoneStatus(internship, new Date('2026-10-04T21:59:59Z'))).toBe(EXPERIENCE_STATUS.CONFIRMED)
    expect(resolveMilestoneStatus(internship, new Date('2026-10-04T22:00:00Z'))).toBe(EXPERIENCE_STATUS.CURRENT)
  })

  it('keeps the internship current through its inclusive end date', () => {
    expect(resolveMilestoneStatus(internship, '2026-11-17')).toBe(EXPERIENCE_STATUS.CURRENT)
    expect(resolveMilestoneStatus(internship, '2026-11-18')).toBe(EXPERIENCE_STATUS.REVIEW)
  })

  it('does not infer completion after the internship end date', () => {
    expect(resolveMilestoneStatus(internship, '2030-01-01')).toBe(EXPERIENCE_STATUS.REVIEW)
  })

  it('never promotes the manual planned master by date', () => {
    expect(resolveMilestoneStatus(master, '2026-01-01')).toBe(EXPERIENCE_STATUS.PLANNED)
    expect(resolveMilestoneStatus(master, '2027-09-01')).toBe(EXPERIENCE_STATUS.PLANNED)
    expect(resolveMilestoneStatus(master, '2035-01-01')).toBe(EXPERIENCE_STATUS.PLANNED)
  })
})
