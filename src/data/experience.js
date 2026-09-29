export const EXPERIENCE_STATUS = Object.freeze({
  COMPLETED: 'COMPLETED',
  CURRENT: 'CURRENT',
  CONFIRMED: 'CONFIRMED',
  PLANNED: 'PLANNED',
  REVIEW: 'REVIEW',
})

export const experienceMilestones = [
  {
    id: 'master',
    statusPolicy: 'manual',
    status: EXPERIENCE_STATUS.PLANNED,
    start: '2027-09-01',
    end: null,
    relationship: 'future',
  },
  {
    id: 'seville',
    statusPolicy: 'manual',
    status: EXPERIENCE_STATUS.CURRENT,
    start: '2023-09-01',
    end: '2027-06-30',
    relationship: 'main',
  },
  {
    id: 'metascope',
    statusPolicy: 'scheduled-confirmed',
    start: '2026-10-05',
    end: '2026-11-17',
    relationship: 'degree-branch',
  },
  {
    id: 'erasmus',
    statusPolicy: 'manual',
    status: EXPERIENCE_STATUS.COMPLETED,
    start: '2024-09-01',
    end: '2025-06-30',
    relationship: 'degree-branch',
  },
  {
    id: 'freelance',
    statusPolicy: 'manual',
    status: EXPERIENCE_STATUS.COMPLETED,
    start: '2023-06-01',
    end: '2023-08-01',
    relationship: 'independent',
  },
]

const madridDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Madrid',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export function toMadridDateKey(value = new Date()) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) throw new TypeError('Invalid date value')
  return madridDateFormatter.format(date)
}

export function resolveMilestoneStatus(milestone, now = new Date()) {
  if (milestone.statusPolicy === 'manual') return milestone.status
  if (milestone.statusPolicy !== 'scheduled-confirmed') {
    throw new TypeError(`Unknown status policy: ${milestone.statusPolicy}`)
  }

  const today = toMadridDateKey(now)
  if (today < milestone.start) return EXPERIENCE_STATUS.CONFIRMED
  if (today <= milestone.end) return EXPERIENCE_STATUS.CURRENT
  return EXPERIENCE_STATUS.REVIEW
}

export function resolveExperienceMilestones(now = new Date()) {
  return experienceMilestones.map((milestone) => ({
    ...milestone,
    resolvedStatus: resolveMilestoneStatus(milestone, now),
  }))
}
