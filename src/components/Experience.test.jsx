import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import Experience from './Experience'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key, i18n: { resolvedLanguage: 'es' } }),
}))

afterEach(() => vi.useRealTimers())

describe('Experience descriptions', () => {
  it('speaks about the confirmed internship as upcoming without claiming completed work', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-29T12:00:00Z'))

    const markup = renderToStaticMarkup(<Experience />)
    expect(markup).toContain('Voy a empezar mis prácticas curriculares')
    expect(markup).toContain('tengo muchas ganas de aprender')
    expect(markup).toContain('me hizo volver a los fundamentos')
  })

  it('drops the upcoming wording once the scheduled internship starts', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-10T12:00:00Z'))

    const markup = renderToStaticMarkup(<Experience />)
    expect(markup).not.toContain('Voy a empezar mis prácticas curriculares')
    expect(markup).toContain('Mi objetivo en estas prácticas curriculares')
  })
})
