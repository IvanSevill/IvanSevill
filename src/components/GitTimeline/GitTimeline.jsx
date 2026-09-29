import { computeLanes } from './computeLanes'

const DEFAULT_LANE_COLORS = ['var(--accent-primary)', 'var(--accent-complement)']

const stateClass = (item) => `git-timeline__entry--${String(item.status || 'default').toLowerCase()}`

const timelineRole = (item) => {
  if (item.relationship === 'degree-branch' || (item.relationship == null && item.lane > 0)) return 'branch'
  return 'main'
}

const Badges = ({ item }) => (
  <>
    {(item.badges || []).map((label) => (
      <span key={label} className="timeline-badge">{label}</span>
    ))}
    {item.current && (
      <span className="timeline-head">
        <span className="timeline-head__signal" aria-hidden="true" />
        HEAD
      </span>
    )}
  </>
)

const MergeChip = ({ label, planned }) => (
  <span className={`timeline-merge ${planned ? 'timeline-merge--planned' : ''}`}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M6 21V9a9 9 0 0 0 9 9" />
    </svg>
    {label}
  </span>
)

const DefaultCard = ({ item }) => {
  const lines = Array.isArray(item.description)
    ? item.description
    : item.description ? [item.description] : []

  return (
    <article className={`timeline-card ${item.planned ? 'timeline-card--planned' : ''} ${item.current ? 'timeline-card--current' : ''}`}>
      <div className="timeline-context" aria-label={`${item.phaseLabel}, ${item.relationshipLabel}`}>
        <span>{item.phaseLabel}</span>
        <span>{item.relationshipLabel}</span>
      </div>

      <div className="timeline-card__header">
        <div className="timeline-card__identity">
          {item.icon && <div className="timeline-card__icon">{item.icon}</div>}
          <div className="timeline-card__heading">
            <div className="timeline-card__title-row">
              {item.title && <h3>{item.title}</h3>}
              <Badges item={item} />
              {item.statusLabel && <span className="timeline-status">{item.statusLabel}</span>}
            </div>
            {item.subtitle && <p className="timeline-card__subtitle">{item.subtitle}</p>}
          </div>
        </div>
        {item.meta && <p className="timeline-card__meta">{item.meta}</p>}
      </div>

      {item.location && <p className="timeline-card__location">{item.location}</p>}
      {lines.length > 0 && (
        <ul className="timeline-card__description">
          {lines.map((line, index) => <li key={index}>{line}</li>)}
        </ul>
      )}
      {item.image && (
        <div className="timeline-card__media">
          <img src={item.image} alt={item.title || ''} loading="lazy" decoding="async" />
        </div>
      )}
    </article>
  )
}

const GitTimeline = ({
  items,
  laneColors = DEFAULT_LANE_COLORS,
  surfaceColor = 'var(--bg-color)',
  order = 'desc',
  showArrow = true,
  renderCard,
  mergedFallback = 'merged',
  className = '',
}) => {
  const { ordered } = computeLanes(items, { order })
  const colorFor = (item) => item.color || laneColors[item.lane % laneColors.length]
  const roles = ordered.map(timelineRole)
  const firstRailIndex = roles.findIndex((role) => role !== 'independent')
  const lastRailIndex = roles.findLastIndex((role) => role !== 'independent')
  const timelineItems = ordered.map((item, index) => ({ item, index, role: roles[index] }))
  const groupedItems = []

  timelineItems.forEach((entry) => {
    const previous = groupedItems.at(-1)
    if (entry.role === 'branch' && previous?.type === 'branch-group') {
      previous.entries.push(entry)
    } else if (entry.role === 'branch') {
      groupedItems.push({ type: 'branch-group', entries: [entry] })
    } else if (previous?.type === 'branch-group' && !previous.anchor) {
      previous.anchor = entry
    } else {
      groupedItems.push({ type: 'item', entry })
    }
  })

  const renderItemCard = (item, isBranch) => {
    const color = colorFor(item)
    return {
      card: renderCard
        ? renderCard(item, { color, isBranch })
        : <DefaultCard item={item} />,
      color,
    }
  }

  return (
    <ol
      className={`git-timeline ${className}`.trim()}
      style={{ '--timeline-surface': surfaceColor }}
    >
      {groupedItems.map((group) => {
        if (group.type === 'branch-group') {
          const firstItem = group.entries[0].item
          const anchorEntry = group.anchor
          const merged = group.entries.every(({ item }) => item._end != null)
          const mergedLabel = group.entries.find(({ item }) => item.mergedLabel)?.item.mergedLabel || mergedFallback
          const anchorResult = anchorEntry ? renderItemCard(anchorEntry.item, false) : null

          return (
            <li
              key={`branch-group-${firstItem.id}`}
              className="git-timeline__branch-group"
              data-timeline-role="branch-group"
              data-branch-count={group.entries.length}
              data-branch-anchor={anchorEntry?.item.id}
              style={{ '--timeline-color': colorFor(firstItem) }}
            >
              <div className="git-timeline__branch-stage">
                <div className="git-timeline__branch-topology" aria-hidden="true">
                  <span className="git-timeline__shared-branch-rail" />
                  <span className="git-timeline__branch-junction git-timeline__branch-junction--upper" />
                </div>
                <div className="git-timeline__branch-content">
                  <ol className="git-timeline__branch-entries">
                    {group.entries.map(({ item }) => {
                      const { card, color } = renderItemCard(item, true)

                      return (
                        <li
                          key={item.id}
                          className={`git-timeline__branch-entry ${item.planned ? 'git-timeline__entry--planned' : ''} ${stateClass(item)}`}
                          data-timeline-id={item.id}
                          data-timeline-role="branch"
                          style={{ '--timeline-color': color }}
                        >
                          <span className="git-timeline__branch-connection" aria-hidden="true" />
                          {card}
                        </li>
                      )
                    })}
                  </ol>
                  {merged && (
                    <div className="git-timeline__branch-merge">
                      <MergeChip label={mergedLabel} />
                    </div>
                  )}
                </div>
              </div>
              {anchorEntry && (
                <div
                  className={`git-timeline__branch-anchor ${anchorEntry.item.planned ? 'git-timeline__entry--planned' : ''} ${stateClass(anchorEntry.item)}`}
                  data-timeline-id={anchorEntry.item.id}
                  data-timeline-role="main"
                  style={{ '--timeline-color': anchorResult.color }}
                >
                  <div className="git-timeline__branch-anchor-rail" aria-hidden="true">
                    <span className="git-timeline__node" />
                    <span className="git-timeline__branch-junction git-timeline__branch-junction--lower" />
                  </div>
                  <div className="git-timeline__branch-anchor-content">
                    {anchorResult.card}
                  </div>
                </div>
              )}
            </li>
          )
        }

        const { item, index, role } = group.entry
        const { card, color } = renderItemCard(item, false)

        return (
          <li
            key={item.id}
            className={`git-timeline__entry git-timeline__entry--${role} ${index === firstRailIndex ? 'git-timeline__entry--rail-start' : ''} ${index === lastRailIndex ? 'git-timeline__entry--rail-end' : ''} ${item.planned ? 'git-timeline__entry--planned' : ''} ${stateClass(item)}`}
            data-timeline-id={item.id}
            data-timeline-role={role}
            style={{ '--timeline-color': color }}
          >
            <div className="git-timeline__rail" aria-hidden="true">
              {index === firstRailIndex && showArrow && <span className="git-timeline__arrow" />}
              <span className="git-timeline__node" />
              <span className="git-timeline__lead" />
            </div>
            <div className="git-timeline__content">
              {card}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default GitTimeline
