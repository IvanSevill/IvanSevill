export function nextSectionAtBoundary(sections, viewportHeight) {
  const edge = viewportHeight - Math.min(88, viewportHeight * 0.12)

  for (let index = 0; index < sections.length - 1; index += 1) {
    const { top, bottom } = sections[index].getBoundingClientRect()
    if (top <= edge && bottom >= edge && bottom <= viewportHeight + 24) {
      return sections[index + 1]
    }
  }

  return null
}
